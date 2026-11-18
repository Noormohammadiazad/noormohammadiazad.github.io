/**
 * Inline SVG icons on a 16-unit grid, drawn with currentColor so they take
 * the text colour and cost no extra requests.
 *
 * `mark` is the site's glyph: a Reuleaux triangle — a curve of constant
 * width, the same measured from any direction — with its centre point. It
 * is also the favicon, the app icon and the social card's title mark.
 */

const stroke = (body, cls = '') =>
  `<svg${cls ? ` class="${cls}"` : ''} viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`;

export const icons = {
  mark: stroke(
    '<path d="M8 2.5A11 11 0 0 1 13.5 12.03A11 11 0 0 1 2.5 12.03A11 11 0 0 1 8 2.5Z"/><circle cx="8" cy="8.85" r="1.6" fill="currentColor" stroke="none"/>',
    'glyph'
  ),
  arrowRight: stroke('<path d="M3 8h9.5M8.75 4.25 12.5 8l-3.75 3.75"/>', 'i-fwd'),
  mail: stroke('<rect x="1.75" y="3.25" width="12.5" height="9.5" rx="2"/><path d="m2.5 4.75 5.5 4 5.5-4"/>'),
  sun: stroke(
    '<circle cx="8" cy="8" r="3"/><path d="M8 1.25v1.5M8 13.25v1.5M14.75 8h-1.5M2.75 8h-1.5M12.77 3.23l-1.06 1.06M4.29 11.71l-1.06 1.06M12.77 12.77l-1.06-1.06M4.29 4.29 3.23 3.23"/>',
    'i-sun'
  ),
  moon: stroke('<path d="M13.6 9.72A5.9 5.9 0 0 1 6.28 2.4 5.9 5.9 0 1 0 13.6 9.72Z"/>', 'i-moon'),
  github:
    '<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" focusable="false"><path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.03 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8 8 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>',
};
