import { urlFor } from '../data/site.mjs';
import { icons } from './icons.mjs';
import { esc } from './util.mjs';

/**
 * GitHub Pages serves a single /404.html for every unmatched path, including
 * ones under /fa/. So this page ships both languages and picks one in the
 * browser — from the path prefix first, then the saved preference. Without
 * JavaScript the English copy is what shows, which matches the site default.
 *
 * It is drawn as a system alert: the app icon, a bold title, one line of
 * explanation and a single default button.
 */
export function notFound(translations) {
  const block = (locale) => {
    const t = translations[locale];
    return `<div class="error-page" data-error-lang="${locale}"${locale === 'fa' ? ' hidden' : ''}>
<div class="alert">
<span class="app-icon" aria-hidden="true">${icons.mark}</span>
<p class="alert__code">${esc(t.notFound.label)}</p>
<h1>${esc(t.notFound.title)}</h1>
<p>${esc(t.notFound.body)}</p>
<a class="btn btn--primary btn--block" href="${esc(urlFor(locale))}">${esc(t.notFound.cta)}</a>
</div>
</div>`;
  };

  return `${block('en')}\n${block('fa')}`;
}

/** Inlined at the end of the 404 document. */
export const notFoundScript = (faTitle) => `(function(){
  var want = location.pathname.indexOf("/fa/") === 0 || location.pathname === "/fa" ? "fa" : null;
  if (!want) { try { want = localStorage.getItem("lang"); } catch (e) {} }
  if (want !== "fa") return;
  var d = document.documentElement;
  d.lang = "fa"; d.dir = "rtl";
  var en = document.querySelector('[data-error-lang="en"]');
  var fa = document.querySelector('[data-error-lang="fa"]');
  if (en) en.hidden = true;
  if (fa) fa.hidden = false;
  document.title = ${JSON.stringify(faTitle)};
})();`;
