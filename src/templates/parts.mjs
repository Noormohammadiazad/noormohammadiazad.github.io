/**
 * Reusable chunks of markup: the retro window, the numbered section header,
 * and the wireframe cube.
 */
import { esc, index } from './util.mjs';

/**
 * A retro "window": title bar + body. The title bar is decoration (a file
 * name and three fake controls), so it is hidden from assistive tech; the
 * real heading lives in the body.
 */
export function win({ title, body, cls = '', tag = 'div', attrs = '', latinTitle = true }) {
  return `<${tag} class="win${cls ? ' ' + cls : ''}"${attrs}>
  <div class="win__bar" aria-hidden="true"><span class="win__title${latinTitle ? ' code' : ''}">${esc(title)}</span><span class="win__ctrls"><i></i><i></i><i></i></span></div>
  ${body}
</${tag}>`;
}

/** Section header bar: [01] label / title [////////]. */
export function secHead(locale, i, kicker, title) {
  return `<header class="sec-head" data-depth>
  <span class="sec-head__num" aria-hidden="true">${index(locale, i)}</span>
  <div class="sec-head__text">
    <p class="label">${esc(kicker)}</p>
    <h2 data-scramble>${esc(title)}</h2>
  </div>
  <span class="sec-head__rule" aria-hidden="true"></span>
</header>`;
}

/** The wireframe cube. Pure CSS 3D; faces carry the monogram both ways. */
export function cube(faces) {
  const names = ['front', 'back', 'right', 'left', 'top', 'bottom'];
  return `<div class="cube-stage" aria-hidden="true"><div class="cube" data-cube><div class="cube__spin">${names
    .map((n, i) => `<i class="cube__face cube__face--${n}">${faces[i] ?? ''}</i>`)
    .join('')}</div></div></div>`;
}
