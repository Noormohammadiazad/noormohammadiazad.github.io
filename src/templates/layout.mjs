import { site, localeMeta, urlFor } from '../data/site.mjs';
import { icons } from './icons.mjs';
import { esc, map, digits } from './util.mjs';

const other = (locale) => (locale === 'en' ? 'fa' : 'en');
const repoUrl = 'https://github.com/Noormohammadiazad/noormohammadiazad.github.io';

/** Browser chrome colours, one per theme: the desk colour of each. */
export const themeColor = { light: '#f2eee3', dark: '#161618' };

/** A language link: a real <a>, so switching works with JavaScript off. */
function langLink(code, cls, text, current) {
  const lang = localeMeta[code].htmlLang;
  return `<a${cls ? ` class="${cls}"` : ''} href="${esc(urlFor(code))}" data-lang="${code}" lang="${lang}" hreflang="${lang}"${
    current ? ' aria-current="true"' : ''
  }>${esc(text)}</a>`;
}

/**
 * The menu bar, pinned to the top like the one on a Mac: the glyph and name
 * where the app menu would be, the sections as menu items, and the
 * language and theme controls on the far side. app.js marks the item for
 * the section you are reading.
 */
function menubar(locale, t) {
  const nav = ['range', 'principles', 'process', 'contact']
    .map((id) => `<a href="#${id}" data-nav="${id}">${esc(t.nav[id])}</a>`)
    .join('\n');

  return `<header class="menubar">
<div class="menubar__in">
<a class="brand" href="#intro">${icons.mark}<span>${esc(site.shortName[locale])}</span></a>
<nav class="menu" aria-label="${esc(t.nav.primary)}">
${nav}
</nav>
<div class="tools">
<div class="seg" role="group" aria-label="${esc(t.controls.language)}">${['en', 'fa']
    .map((c) => langLink(c, '', localeMeta[c].short, c === locale))
    .join('')}</div>
<button class="icon-btn" type="button" data-theme-toggle aria-label="${esc(t.controls.theme)}" data-label-dark="${esc(
    t.controls.toTheme.dark
  )}" data-label-light="${esc(t.controls.toTheme.light)}">${icons.moon}${icons.sun}</button>
</div>
</div>
</header>`;
}

function footer(locale, t) {
  const o = other(locale);
  return `<footer class="foot">
<div class="wrap foot__in">
<p>© ${digits(locale, new Date().getFullYear())} ${esc(site.fullName[locale])} · ${esc(t.footer.builtWith)}</p>
<ul class="foot__notes">${map(t.footer.notes, (n) => `<li>${esc(n)}</li>`)}</ul>
<p class="foot__links"><a href="${repoUrl}" rel="noopener">${esc(t.footer.source)}</a> ${langLink(o, '', localeMeta[o].label, false)}</p>
</div>
</footer>`;
}

/**
 * Full document. Everything needed to paint — CSS, the pre-paint script,
 * the markup — is inline, so a page renders from its first round trip with
 * no render-blocking requests. The interactive layer (app.js) is the one
 * external file: deferred, content-hashed, and shared by every page.
 *
 * `bare` (the 404) drops the menu bar and footer, because it serves both
 * languages from one file.
 */
export function layout({
  locale,
  t,
  meta,
  body,
  css,
  headScript,
  appSrc,
  tailScript = '',
  langRedirect = true,
  declareFont = false,
  bare = false,
}) {
  const m = localeMeta[locale];
  const canonical = site.origin + urlFor(locale);
  const { title, description } = meta;

  /* Only Persian pages pay for the Persian webfont. `declareFont` lets a page
     that *might* render Persian (the bilingual 404) declare the face without
     preloading it: with font-display:swap and no preload, the file is fetched
     only if something on screen actually uses the family. English pages use
     the system's own fonts and download none. */
  const fontUrl = '/assets/vazirmatn-fa.woff2';
  const fontFace = `<style>@font-face{font-family:"Vazirmatn";src:url("${fontUrl}") format("woff2");font-weight:400 700;font-display:swap}</style>`;
  const preload = `<link rel="preload" href="${fontUrl}" as="font" type="font/woff2" crossorigin>\n`;
  const fontBits = locale === 'fa' ? preload + fontFace : declareFont ? fontFace : '';

  const alternates = ['en', 'fa']
    .map((code) => `<link rel="alternate" hreflang="${localeMeta[code].htmlLang}" href="${esc(site.origin + urlFor(code))}">`)
    .join('\n');

  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.fullName[locale],
    alternateName: site.fullName[other(locale)],
    url: site.origin + urlFor(locale),
    description,
    sameAs: [site.links.github],
    knowsLanguage: ['en', 'fa'],
    knowsAbout: ['Local-first software', 'Applied cryptography', 'Web performance', 'Right-to-left typography'],
  });

  const chromeTop = bare
    ? ''
    : `<a class="skip" href="#main">${esc(t.nav.skipToContent)}</a>
${menubar(locale, t)}`;

  return `<!doctype html>
<html lang="${m.htmlLang}" dir="${m.dir}"${langRedirect ? '' : ' data-lang-redirect="off"'}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<script>${headScript}</script>
<script src="${appSrc}" defer></script>
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="author" content="${esc(site.fullName[locale])}">
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="${themeColor.light}" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="${themeColor.dark}" media="(prefers-color-scheme: dark)">
<link rel="canonical" href="${esc(canonical)}">
${alternates}
<link rel="alternate" hreflang="x-default" href="${esc(site.origin + urlFor('en'))}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.fullName[locale])}">
<meta property="og:locale" content="${locale === 'fa' ? 'fa_IR' : 'en_US'}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:image" content="${esc(site.origin)}/og.jpg">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(site.fullName[locale])}">
<meta name="twitter:card" content="summary_large_image">
${fontBits}<style>${css}</style>
<script type="application/ld+json">${jsonLd}</script>
</head>
<body${bare ? ' class="is-bare"' : ''}>
${chromeTop}
<main id="main">
${body}
</main>
${bare ? '' : footer(locale, t)}
${tailScript ? `<script>${tailScript}</script>` : ''}
</body>
</html>`;
}
