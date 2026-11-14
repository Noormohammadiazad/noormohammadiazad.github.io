import { site, localeMeta, urlFor } from '../data/site.mjs';
import { icons } from './icons.mjs';
import { esc, map, digits } from './util.mjs';

const other = (locale) => (locale === 'en' ? 'fa' : 'en');
const repoUrl = 'https://github.com/Noormohammadiazad/noormohammadiazad.github.io';

/** A language link: a real <a>, so switching works with JavaScript off. */
function langLink(code, cls, text, current) {
  const lang = localeMeta[code].htmlLang;
  return `<a${cls ? ` class="${cls}"` : ''} href="${esc(urlFor(code))}" data-lang="${code}" lang="${lang}" hreflang="${lang}"${
    current ? ' aria-current="true"' : ''
  }>${esc(text)}</a>`;
}

/**
 * Header: one row of bordered cells, like an exposed table. The script only
 * adds preference persistence and keeps your place when you switch language.
 */
function header(locale, t) {
  const nav = ['projects', 'principles', 'about', 'contact']
    .map((id) => `<a href="#${id}">${esc(t.nav[id])}</a>`)
    .join('\n    ');

  return `<header class="site-header">
  <a class="brand" href="#intro">
    <span class="brand__mark" aria-hidden="true">${esc(site.monogram[locale])}</span>
    <span class="brand__name">${esc(site.shortName[locale])}</span>
  </a>
  <nav class="nav" aria-label="${esc(t.nav.primary)}">
    ${nav}
  </nav>
  <div class="tools">
    <div class="seg" role="group" aria-label="${esc(t.controls.language)}">
      ${['en', 'fa'].map((c) => langLink(c, 'seg__item', localeMeta[c].short, c === locale)).join('')}
    </div>
    <button class="icon-btn" type="button" data-theme-toggle
      aria-label="${esc(t.controls.theme)}"
      data-label-dark="${esc(t.controls.toTheme.dark)}"
      data-label-light="${esc(t.controls.toTheme.light)}">
      ${icons.moon}${icons.sun}
    </button>
  </div>
</header>`;
}

/**
 * The marquee. Two identical groups on one track, translated by exactly one
 * group width, so the loop is seamless. Everything it says is said elsewhere
 * on the page, so it is hidden from assistive tech rather than read twice.
 */
function marquee(t) {
  const group = `<ul class="marquee__group">${map(t.chrome.marquee, (item) => `<li>${esc(item)}</li>`)}</ul>`;
  return `<div class="marquee" aria-hidden="true"><div class="marquee__track">${group}${group}</div></div>`;
}

/**
 * Browser-style status bar. Decorative. The first cell shows the "path" of
 * the section you are reading (C:\MAMMADALI\PROJECTS\TEXTOR.EXE), the last a
 * progress meter.
 */
function statusbar(locale, t) {
  const pct = locale === 'fa' ? '۰٪' : '0%';
  return `<div class="statusbar" aria-hidden="true">
  <span class="statusbar__cell statusbar__ready"><i class="dot"></i><span class="statusbar__path" data-path-out>${esc(t.chrome.statusReady)}</span></span>
  <span class="statusbar__cell statusbar__lang">${esc(t.chrome.statusLang)}</span>
  <span class="statusbar__cell statusbar__scroll"><span class="meter"><span class="meter__mask" data-meter></span></span><span class="statusbar__pct" data-pct>${pct}</span></span>
</div>`;
}

function footer(locale, t) {
  const o = other(locale);
  return `<footer class="site-footer">
  <div class="wrap">
    <ul class="badges">
      ${map(t.chrome.badges, ([a, b]) => `<li class="badge88"><span>${esc(a)}</span><span>${esc(b)}</span></li>`)}
    </ul>
    <hr class="groove">
    <p class="counter" data-visits hidden>
      <span class="counter__label">${esc(t.chrome.visits)}</span>
      <span class="counter__digits" data-visits-digits></span>
      <span class="counter__note">${esc(t.chrome.visitsNote)}</span>
    </p>
    <div class="site-footer__meta">
      <p>© ${digits(locale, new Date().getFullYear())} ${esc(site.fullName[locale])}</p>
      <p>${esc(t.footer.builtWith)}</p>
      <p class="site-footer__links">
        <a href="${repoUrl}" rel="noopener">${esc(t.footer.source)}</a>
        ${langLink(o, '', localeMeta[o].label, false)}
      </p>
    </div>
  </div>
</footer>`;
}

/**
 * Full document. Everything needed to paint — CSS, the pre-paint script,
 * the markup — is inline, so a page renders from its first round trip with
 * no render-blocking requests. The interactive layer (app.js) is the one
 * external file: deferred, content-hashed, and shared by every page, so it
 * downloads in parallel and is fetched once per visit.
 *
 * `bare` drops the header, marquee, footer and status bar. The 404 uses it,
 * because it serves both languages from one file and localised chrome
 * around it would always be wrong for one of them.
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
     system fonts only and download no font at all. */
  const fontUrl = '/assets/vazirmatn-fa.woff2';
  const fontFace = `<style>@font-face{font-family:"Vazirmatn";src:url("${fontUrl}") format("woff2");font-weight:400 700;font-display:swap;font-named-instance:"Regular"}</style>`;
  const preload = `<link rel="preload" href="${fontUrl}" as="font" type="font/woff2" crossorigin>\n  `;
  const fontBits = locale === 'fa' ? preload + fontFace : declareFont ? fontFace : '';

  const alternates = ['en', 'fa']
    .map((code) => `<link rel="alternate" hreflang="${localeMeta[code].htmlLang}" href="${esc(site.origin + urlFor(code))}">`)
    .join('\n  ');

  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.fullName[locale],
    alternateName: site.fullName[other(locale)],
    url: site.origin + urlFor(locale),
    description,
    sameAs: [site.links.github],
    knowsLanguage: ['en', 'fa'],
  });

  const chromeTop = bare
    ? ''
    : `<a class="skip" href="#main">${esc(t.nav.skipToContent)}</a>
<div data-header-sentinel aria-hidden="true"></div>
${header(locale, t)}
${marquee(t)}`;

  const chromeBottom = bare ? '' : `${footer(locale, t)}\n${statusbar(locale, t)}`;

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
  <meta name="theme-color" content="#f2eee3" media="(prefers-color-scheme: light)">
  <meta name="theme-color" content="#000022" media="(prefers-color-scheme: dark)">
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
  ${fontBits}
  <style>${css}</style>
  <script type="application/ld+json">${jsonLd}</script>
</head>
<body${bare ? ' class="is-bare"' : ''}>
${chromeTop}
<main id="main">
${body}
</main>
${chromeBottom}
${tailScript ? `<script>${tailScript}</script>` : ''}
</body>
</html>`;
}
