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

/* A run of Latin text inside Persian: a word that starts with a Latin
   letter, plus any Latin words that follow it after single spaces. */
const LATIN = /[A-Za-z][\w.+\-/():@]*(?: [A-Za-z0-9][\w.+\-/():@]*)*/g;

/**
 * Escape copy for the page. On Persian pages, every Latin run (API names,
 * algorithms, code) is wrapped in <bdi>, so the bidi algorithm can never
 * reorder it: `exportKey()` keeps its parentheses on the right side, and
 * "AES-GCM" stays in one piece. Trailing sentence punctuation is left
 * outside the isolate, where the Persian sentence expects it.
 */
export function txt(locale, value) {
  const s = String(value);
  if (locale !== 'fa') return esc(s);
  let out = '';
  let last = 0;
  for (const m of s.matchAll(LATIN)) {
    let run = m[0];
    while (/[.,:;]$/.test(run) || (run.endsWith(')') && !run.includes('('))) run = run.slice(0, -1);
    out += esc(s.slice(last, m.index)) + '<bdi>' + esc(run) + '</bdi>';
    last = m.index + run.length;
  }
  return out + esc(s.slice(last));
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

/** Bytes as kilobytes to one decimal, with the local decimal separator.
    A no-break space keeps the number and its unit on one line. */
export function kb(locale, bytes, unit) {
  const s = (bytes / 1024).toFixed(1);
  return digits(locale, locale === 'fa' ? s.replace('.', '٫') : s) + '\u00a0' + unit;
}

/** A 0–1 ratio as a whole percentage, with the local percent sign. */
export function pct(locale, ratio) {
  return digits(locale, Math.round(ratio * 100)) + (locale === 'fa' ? '٪' : '%');
}

/** Fill {placeholders} in a translated string. */
export function fill(template, values) {
  return template.replace(/\{(\w+)\}/g, (_, k) => values[k]);
}
