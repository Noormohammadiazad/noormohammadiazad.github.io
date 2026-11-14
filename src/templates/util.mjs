/** Escape a string for use in HTML text or a double-quoted attribute. */
export function esc(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Render `items` with `fn`, then join. */
export function map(items, fn) {
  return items.map(fn).join('\n');
}

/** Western digits → Persian digits (۰۱۲۳…) on Persian pages. */
export function digits(locale, value) {
  const s = String(value);
  return locale === 'fa' ? s.replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]) : s;
}

/** Two-digit index, localised: 01, 02 … or ۰۱, ۰۲ … */
export function index(locale, i) {
  return digits(locale, String(i + 1).padStart(2, '0'));
}
