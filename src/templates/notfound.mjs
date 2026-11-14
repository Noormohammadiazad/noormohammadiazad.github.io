import { urlFor } from '../data/site.mjs';
import { icons } from './icons.mjs';
import { esc } from './util.mjs';
import { win } from './parts.mjs';

/**
 * GitHub Pages serves a single /404.html for every unmatched path, including
 * ones under /fa/. So this page ships both languages and picks one in the
 * browser — from the path prefix first, then the saved preference. Without
 * JavaScript the English copy is what shows, which matches the site default.
 *
 * Styled as a classic error dialog: one window, one icon, one button.
 */
export function notFound(translations) {
  const block = (locale) => {
    const t = translations[locale];
    return `<div class="error-page" data-error-lang="${locale}"${locale === 'fa' ? ' hidden' : ''}>
  ${win({
    title: t.notFound.dialogTitle,
    latinTitle: locale === 'en',
    cls: 'dialog',
    body: `<div class="win__body dialog__body">
      <span class="dialog__icon">${icons.warn}</span>
      <div>
        <p class="error-code" aria-hidden="true">${esc(t.notFound.code)}</p>
        <h1>${esc(t.notFound.title)}</h1>
        <p>${esc(t.notFound.body)}</p>
      </div>
    </div>
    <div class="dialog__actions">
      <a class="btn btn--primary" href="${esc(urlFor(locale))}">${esc(t.notFound.cta)}${icons.arrowRight}</a>
    </div>`,
  })}
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
