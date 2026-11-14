#!/usr/bin/env node
/**
 * Static site build.
 *
 * Reads the content in src/data, renders the home page once per language
 * plus a bilingual 404, and writes a directory GitHub Pages can serve as-is.
 * No dependencies — Node's standard library only.
 *
 *   node build.mjs
 *
 * Everything needed to paint (CSS, the pre-paint script, the markup) is
 * inlined into each document; the interactive layer is one deferred,
 * content-hashed script. The build checks the two languages for parity and
 * fails if a page breaks the performance budget.
 */

import { mkdir, readFile, writeFile, rm, cp, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { gzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';

import { site, locales, localeMeta, urlFor } from './src/data/site.mjs';
import { projects } from './src/data/projects.mjs';
import { principles } from './src/data/principles.mjs';
import { layout } from './src/templates/layout.mjs';
import { home, CRITICAL } from './src/templates/home.mjs';
import { notFound, notFoundScript } from './src/templates/notfound.mjs';
import en from './src/data/i18n/en.mjs';
import fa from './src/data/i18n/fa.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const src = join(root, 'src');
const out = join(root, 'dist');

const translations = { en, fa };

/* Performance budget, in gzipped bytes. See the check at the end of build().
     firstScreen  everything up to the end of the hero: head, inline CSS and
                  scripts, header, marquee, hero. Must fit in the first TCP
                  round trip (an initial window of 10 packets ≈ 14 KB), so a
                  cold visit paints without waiting on a second trip.
     document     the whole page, every project included.
     script       the deferred app.js. */
const BUDGET = { firstScreen: 14 * 1024, document: 28 * 1024, script: 6 * 1024 };

/* ── CSS minifier ─────────────────────────────────────────────────────────
   Small and deliberately conservative: it walks the source so quoted strings
   are never touched, strips comments, then collapses whitespace only around
   punctuation that can never be a descendant combinator. It does not try to
   merge rules or shorten values. */
function minifyCss(css) {
  let outBuf = '';
  let i = 0;
  const n = css.length;

  while (i < n) {
    const c = css[i];

    if (c === '"' || c === "'") {
      const quote = c;
      outBuf += c;
      i++;
      while (i < n) {
        const ch = css[i];
        outBuf += ch;
        i++;
        if (ch === '\\' && i < n) { outBuf += css[i]; i++; continue; }
        if (ch === quote) break;
      }
      continue;
    }

    if (c === '/' && css[i + 1] === '*') {
      i += 2;
      while (i < n && !(css[i] === '*' && css[i + 1] === '/')) i++;
      i += 2;
      outBuf += ' ';
      continue;
    }

    if (c === ' ' || c === '\n' || c === '\t' || c === '\r' || c === '\f') {
      while (i < n && /\s/.test(css[i])) i++;
      outBuf += ' ';
      continue;
    }

    outBuf += c;
    i++;
  }

  return outBuf
    .replace(/\s*([{}:;,>])\s*/g, '$1')
    .replace(/;}/g, '}')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/** Guard against a minifier bug silently shipping broken CSS. */
function assertCssIntact(original, minified) {
  const count = (s, ch) => (s.match(new RegExp('\\' + ch, 'g')) || []).length;
  const problems = [];
  if (count(minified, '{') !== count(minified, '}')) problems.push('unbalanced braces');
  // Comments are the only construct allowed to change the brace count.
  const stripped = original.replace(/\/\*[\s\S]*?\*\//g, '');
  if (count(stripped, '{') !== count(minified, '{')) problems.push('rule count changed');
  if (problems.length) throw new Error('CSS minification failed: ' + problems.join(', '));
}

/* ── JS minifier ──────────────────────────────────────────────────────────
   Equally conservative: it removes comments and indentation and nothing
   else — no renaming, no rewriting. It understands strings and regex
   literals, so a "//" inside either is left alone, and it keeps every line
   break, so automatic semicolon insertion behaves exactly as in the source.
   The result is syntax-checked before it is allowed into a page. */
const SAFE = '{}()[];,=:?<>!&|';

function minifyJs(js) {
  let out = '';
  let i = 0;
  const n = js.length;
  // Last significant character, to tell a regex literal from division.
  let prev = '';

  while (i < n) {
    const c = js[i];
    const next = js[i + 1];

    if (c === '`') throw new Error('minifyJs: template literals are not supported in client scripts');

    if (c === '"' || c === "'") {
      let j = i + 1;
      while (j < n && js[j] !== c) j += js[j] === '\\' ? 2 : 1;
      out += js.slice(i, j + 1);
      i = j + 1;
      prev = c;
      continue;
    }

    if (c === '/' && next === '*') {
      const end = js.indexOf('*/', i + 2);
      i = end < 0 ? n : end + 2;
      out += ' ';
      continue;
    }

    if (c === '/' && next === '/') {
      while (i < n && js[i] !== '\n') i++;
      continue;
    }

    if (c === '/' && (prev === '' || '(,=:[!&|?{};+-*%<>~^'.includes(prev) || /\b(return|typeof|case)$/.test(out))) {
      let j = i + 1;
      let inClass = false;
      while (j < n) {
        const ch = js[j];
        if (ch === '\\') { j += 2; continue; }
        if (ch === '[') inClass = true;
        else if (ch === ']') inClass = false;
        else if (ch === '/' && !inClass) break;
        j++;
      }
      j++;
      while (j < n && /[a-z]/i.test(js[j])) j++;
      out += js.slice(i, j);
      i = j;
      prev = '/';
      continue;
    }

    /* A space survives only between two characters that would otherwise
       fuse into one token (identifiers, numbers, + +, - -). */
    if (c === ' ' || c === '\t') {
      let j = i;
      while (j < n && (js[j] === ' ' || js[j] === '\t')) j++;
      const before = out[out.length - 1] || '';
      const after = js[j] || '';
      if (!(SAFE.includes(before) || SAFE.includes(after))) out += ' ';
      i = j;
      continue;
    }

    out += c;
    if (!/\s/.test(c)) prev = c;
    i++;
  }

  /* Join a line onto the previous one when the previous ends in ; { , ( [
     — no statement can end there, so automatic semicolon insertion is
     never involved. Every other line break is kept. */
  const result = out
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .reduce((acc, line) => (acc && /[;{,([]$/.test(acc) ? acc + line : acc + (acc ? '\n' : '') + line), '');

  // Parse (never run) the output; a minifier bug fails the build, not the site.
  new Function(result);
  return result;
}

/* ── Content checks ───────────────────────────────────────────────────────
   The two languages must say the same things: identical keys everywhere,
   arrays of equal length, and every project and principle written in both.
   A missing translation fails the build instead of shipping a hole. */
function shape(value, path = '') {
  if (Array.isArray(value)) return [`${path}[${value.length}]`, ...value.flatMap((v, i) => shape(v, `${path}[${i}]`))];
  if (value && typeof value === 'object') return Object.keys(value).flatMap((k) => shape(value[k], path ? `${path}.${k}` : k));
  return [path];
}

function checkContent() {
  const problems = [];
  const diff = (a, b, where) => {
    const sa = new Set(shape(a));
    const sb = new Set(shape(b));
    for (const k of sa) if (!sb.has(k)) problems.push(`${where}: "${k}" is in English but not in Persian`);
    for (const k of sb) if (!sa.has(k)) problems.push(`${where}: "${k}" is in Persian but not in English`);
  };

  diff(en, fa, 'i18n');
  for (const p of projects) {
    diff(p.en, p.fa, `project ${p.id}`);
    p.layers.forEach((l, i) => { if (!l.en || !l.fa) problems.push(`project ${p.id}: layer ${i} needs en and fa`); });
    if (!en.status[p.status]) problems.push(`project ${p.id}: unknown status "${p.status}"`);
  }
  const ids = new Set(projects.map((p) => p.id));
  principles.forEach((r, i) => {
    diff(r.en, r.fa, `principle ${i + 1}`);
    for (const id of r.seen) if (!ids.has(id)) problems.push(`principle ${i + 1}: unknown project "${id}"`);
  });

  if (problems.length) throw new Error('content check failed:\n    ' + problems.join('\n    '));
}

/* ── Output helpers ───────────────────────────────────────────────────── */

/* Collapse indentation outside <pre>/<script>/<style>/<textarea>. Line
   breaks stay, so inline spacing renders exactly as before. */
function tidyHtml(html) {
  const keep = [];
  const masked = html.replace(/<(pre|script|style|textarea)\b[\s\S]*?<\/\1>/gi, (m) => `\u0000${keep.push(m) - 1}\u0000`);
  return masked
    .replace(/\n[ \t]+/g, '\n')
    .replace(/\n{2,}/g, '\n')
    .replace(/\u0000(\d+)\u0000/g, (_, i) => keep[i]);
}

const gz = (s) => gzipSync(s).length;

/** Size of a document, its first screen, and what each costs on the wire. */
function measureDoc(label, html) {
  const cut = html.indexOf(CRITICAL);
  const clean = html.replace(CRITICAL, '');
  return {
    label,
    html: clean,
    raw: Buffer.byteLength(clean),
    gz: gz(clean),
    first: cut < 0 ? gz(clean) : gz(html.slice(0, cut)),
  };
}

async function collect(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) files.push(...(await collect(p)));
    else files.push({ path: p, size: (await stat(p)).size });
  }
  return files;
}

/* ── Build ────────────────────────────────────────────────────────────── */

async function build() {
  const started = Date.now();
  checkContent();

  await rm(out, { recursive: true, force: true });
  await mkdir(join(out, 'assets'), { recursive: true });

  /* Each document ships only the CSS it uses: base + its own sheet + motion
     (motion last, so reduced-motion overrides beat every component rule). */
  const readCss = (name) => readFile(join(src, 'assets/css', name + '.css'), 'utf8');
  const [base, motion] = await Promise.all([readCss('base'), readCss('motion')]);
  const cssFor = async (name) => {
    const raw = [base, await readCss(name), motion].join('\n');
    const min = minifyCss(raw);
    assertCssIntact(raw, min);
    return min;
  };
  const css = { home: await cssFor('home'), error: await cssFor('error') };

  const readJs = async (name) => minifyJs(await readFile(join(src, 'assets', name), 'utf8'));
  const headScript = await readJs('head.js');
  const restoreScript = await readJs('restore.js');

  /* The interactive layer is the one external script. A content hash in the
     name means a deploy can never pair new HTML with a stale cached copy. */
  const appScript = await readJs('app.js');
  const appSrc = `/assets/app.${createHash('sha256').update(appScript).digest('hex').slice(0, 10)}.js`;
  await writeFile(join(out, appSrc), appScript);

  const report = [];

  /* The home page, once per language. */
  for (const locale of locales) {
    const t = translations[locale];
    const doc = measureDoc(
      localeMeta[locale].base.slice(1) + 'index.html',
      tidyHtml(layout({
        locale,
        t,
        meta: t.meta.home,
        body: home(locale, t),
        css: css.home,
        headScript,
        appSrc,
        tailScript: restoreScript,
      }))
    );
    await mkdir(join(out, localeMeta[locale].base), { recursive: true });
    await writeFile(join(out, doc.label), doc.html);
    report.push(doc);
  }

  /* 404: one bilingual document, since GitHub Pages serves a single 404 for
     every unmatched path regardless of language prefix. */
  const notFoundDoc = measureDoc(
    '404.html',
    tidyHtml(layout({
      locale: 'en',
      t: en,
      meta: en.meta.notFound,
      body: notFound(translations),
      css: css.error,
      headScript,
      appSrc,
      /* Inline and parser-blocking, so the language is settled before first
         paint and before the deferred app.js reads lang/dir. */
      tailScript: minifyJs(notFoundScript(fa.meta.notFound.title)),
      langRedirect: false,
      declareFont: true,
      bare: true,
    }))
  );
  await writeFile(join(out, notFoundDoc.label), notFoundDoc.html);
  report.push(notFoundDoc);

  /* Static assets. */
  const copies = [
    ['assets/fonts/vazirmatn-fa.woff2', 'assets/vazirmatn-fa.woff2'],
    ['assets/fonts/OFL.txt', 'assets/vazirmatn-OFL.txt'],
    ['assets/favicon.svg', 'favicon.svg'],
    ['assets/apple-touch-icon.png', 'apple-touch-icon.png'],
    ['assets/og.jpg', 'og.jpg'],
  ];
  for (const [from, to] of copies) await cp(join(src, from), join(out, to));

  await writeFile(
    join(out, 'site.webmanifest'),
    JSON.stringify({
      name: site.fullName.en,
      short_name: site.shortName.en,
      start_url: '/',
      display: 'browser',
      background_color: '#000022',
      theme_color: '#000022',
      icons: [
        { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
        { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
    })
  );

  /* Sitemap with hreflang alternates, so search engines pair the two
     language versions instead of treating them as duplicates. */
  const alternates = locales
    .map((code) => `    <xhtml:link rel="alternate" hreflang="${localeMeta[code].htmlLang}" href="${site.origin}${urlFor(code)}"/>`)
    .concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${site.origin}${urlFor('en')}"/>`)
    .join('\n');
  const urls = locales.map((locale) => `  <url>\n    <loc>${site.origin}${urlFor(locale)}</loc>\n${alternates}\n  </url>`);
  await writeFile(
    join(out, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`
  );
  await writeFile(join(out, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site.origin}/sitemap.xml\n`);

  /* The custom domain, on record. Deployments from GitHub Actions take the
     domain from Settings → Pages rather than from this file, but it is kept
     in the repository and the artifact so the domain is written down in
     one checked place (and still works if Pages is ever served from a
     branch). verify.mjs checks it names mammadali.ir. */
  const cname = join(root, 'CNAME');
  if (!existsSync(cname)) throw new Error('CNAME is missing');
  await cp(cname, join(out, 'CNAME'));

  /* Tell Pages not to run the output through Jekyll. */
  await writeFile(join(out, '.nojekyll'), '');

  /* ── Report ─────────────────────────────────────────────────────────── */
  const pad = (s, n) => String(s).padEnd(n);
  const kb = (b) => (b / 1024).toFixed(1) + ' KB';
  const line = (a, b, c, d = '') => console.log(`  ${pad(a, 24)}${pad(b, 11)}${pad(c, 11)}${d}`);

  console.log(`\n  built in ${Date.now() - started}ms\n`);
  line('document', 'size', 'gzipped', 'first screen');
  console.log('  ' + '─'.repeat(58));
  for (const r of report) line(r.label, kb(r.raw), kb(r.gz), kb(r.first));
  console.log('  ' + '─'.repeat(58));
  for (const [name, sheet] of Object.entries(css)) line(`css: ${name} (inline)`, kb(sheet.length), kb(gz(sheet)));
  line('js: head+restore (inl)', kb(headScript.length + restoreScript.length), kb(gz(headScript + restoreScript)));
  line(`js: ${appSrc.slice(8)}`, kb(appScript.length), kb(gz(appScript)), '(deferred, shared)');
  const files = await collect(out);
  console.log(`  ${pad('whole site on disk', 24)}${kb(files.reduce((s, f) => s + f.size, 0))} across ${files.length} files\n`);

  /* ── Budget ─────────────────────────────────────────────────────────────
     Breaking any limit fails the build — and therefore the deploy. */
  const over = [];
  for (const r of report) {
    if (r.first > BUDGET.firstScreen) over.push(`${r.label}: first screen is ${kb(r.first)} (budget ${kb(BUDGET.firstScreen)})`);
    if (r.gz > BUDGET.document) over.push(`${r.label}: document is ${kb(r.gz)} (budget ${kb(BUDGET.document)})`);
  }
  if (gz(appScript) > BUDGET.script) over.push(`app.js is ${kb(gz(appScript))} (budget ${kb(BUDGET.script)})`);
  if (over.length) throw new Error('performance budget exceeded:\n    ' + over.join('\n    '));
  console.log(
    `  budget ok: first screen ≤ ${kb(BUDGET.firstScreen)}, document ≤ ${kb(BUDGET.document)}, app.js ≤ ${kb(BUDGET.script)} (gzipped)\n`
  );
}

build().catch((err) => {
  console.error('\n  build failed:', err.message, '\n');
  process.exitCode = 1;
});
