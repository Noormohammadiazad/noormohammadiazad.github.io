/**
 * The performance budget, in gzipped bytes.
 *
 * One definition, used twice: build.mjs fails the build (and so the deploy)
 * if a page goes over any limit, and the Budget monitor on the page prints
 * the same limits next to the sizes the build measured.
 *
 *   firstScreen  everything up to the end of the hero: head, inline CSS and
 *                scripts, menu bar, hero. It must fit in the first TCP round
 *                trip (an initial window of 10 packets is about 14 KB), so a
 *                cold visit paints without waiting on a second trip.
 *   document     the whole page.
 *   script       the deferred app.js.
 */
export const budget = {
  firstScreen: 14 * 1024,
  document: 28 * 1024,
  script: 6 * 1024,
};
