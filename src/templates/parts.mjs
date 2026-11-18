/**
 * Reusable chunks of markup: the window, and the section header.
 */
import { icons } from './icons.mjs';
import { esc } from './util.mjs';

/**
 * A desktop window: a title bar with the three window controls, a centred
 * title and an optional accessory on the far side, then the body.
 *
 * The controls are decoration (aria-hidden): they show which window has
 * focus, nothing more. `title` and `acc` are HTML, already escaped by the
 * caller. `tag` sets the title's element, so a window whose title names its
 * content can carry the heading itself.
 *
 * `data-win` puts the window in app.js's focus tracking (the one nearest
 * your reading line is the active window); `data-depth` also puts it in the
 * scroll choreography (it glides and zooms as chapters hand over).
 */
export function win({ title, body, cls = '', id = '', acc = '', tag = 'p', glyph = false, depth = true, attrs = '' }) {
  return `<div class="win${cls ? ' ' + cls : ''}"${id ? ` id="${id}"` : ''} data-win${depth ? ' data-depth' : ''}${attrs}>
<div class="win__bar"><span class="lights" aria-hidden="true"><i></i><i></i><i></i></span><${tag} class="win__title">${glyph ? icons.mark : ''}<span>${title}</span></${tag}>${
    acc ? `<span class="win__acc">${acc}</span>` : ''
  }</div>
${body}
</div>`;
}

/** Section header: an eyebrow, the headline, and an optional intro. */
export function secHead({ id, kicker, title, intro = '' }) {
  return `<header class="sec-head">
<p class="kicker">${esc(kicker)}</p>
<h2 id="${id}">${title}</h2>
${intro ? `<p class="sec-head__intro">${intro}</p>` : ''}
</header>`;
}
