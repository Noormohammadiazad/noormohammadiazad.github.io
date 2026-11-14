/**
 * Inline SVG. Every icon is a small path set on a 16-unit grid, drawn with
 * currentColor, so icons inherit text colour and cost no extra requests.
 * Square caps and mitred joins on purpose: the site is drawn with hard edges.
 */

const stroke = (body, cls = '') =>
  `<svg${cls ? ` class="${cls}"` : ''} viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true" focusable="false">${body}</svg>`;

export const icons = {
  arrowRight: stroke('<path d="M2.5 8h10M9 4.5 12.5 8 9 11.5"/>', 'i-fwd'),
  external: stroke('<path d="M9.5 2.5h4v4M13.5 2.5 7.5 8.5M11.5 9.5v4h-9v-9h4"/>'),
  mail: stroke('<path d="M1.75 3.5h12.5v9H1.75zM2.5 4.5 8 8.75l5.5-4.25"/>'),
  warn: stroke('<path d="M8 1.75 15 14H1z"/><path d="M8 6.25v3.5M8 11.5v.5"/>'),
  sun: stroke(
    '<path d="M5 5h6v6H5zM8 1v2M8 13v2M15 8h-2M3 8H1M13 3l-1.5 1.5M4.5 11.5 3 13M13 13l-1.5-1.5M4.5 4.5 3 3"/>',
    'i-sun'
  ),
  moon: stroke('<path d="M13.5 10A6 6 0 0 1 6 2.5 6 6 0 1 0 13.5 10Z"/>', 'i-moon'),
  github:
    '<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" focusable="false"><path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.03 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8 8 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>',
  /* The khatam: two overlapping squares, the eight-point star of Persian
     geometric ornament. Drawn on one face of the hero cube. */
  star: '<svg class="i-star" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" focusable="false"><path d="M8 .6l2.17 2.17h3.06v3.06L15.4 8l-2.17 2.17v3.06h-3.06L8 15.4l-2.17-2.17H2.77v-3.06L.6 8l2.17-2.17V2.77h3.06z"/></svg>',
};
