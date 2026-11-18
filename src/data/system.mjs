/**
 * The structure of the page's central pieces. The words for each entry live
 * in src/data/i18n/*.mjs, keyed by the same ids; the build fails if an id
 * here has no text in either language.
 */

/**
 * The time scales on the Range map, shortest first. `seconds` places each on
 * a logarithmic axis from 1 ms to about a century (see `axis`). Each one
 * stands for a kind of system and the clock it has to answer to.
 */
export const scales = [
  { id: 'audio', seconds: 128 / 48000 },        // one 128-sample buffer at 48 kHz
  { id: 'frame', seconds: 1 / 60 },             // one frame at 60 fps
  { id: 'input', seconds: 0.1 },                // a response that feels instant
  { id: 'otp', seconds: 30 },                   // one RFC 6238 time step
  { id: 'render', seconds: 600 },               // one video render
  { id: 'session', seconds: 86400 },            // one trading day
  { id: 'platform', seconds: 5 * 3.156e7 },     // the life of a platform
  { id: 'secrecy', seconds: 25 * 3.156e7 },     // how long a secret must hold
  { id: 'print', seconds: 60 * 3.156e7 },       // a printed page
];

/** The Range axis: log10 of seconds, and its labelled ticks. */
export const axis = {
  from: -3,
  to: 9.5,
  ticks: [
    { id: 'ms', seconds: 1e-3 },
    { id: 's', seconds: 1 },
    { id: 'min', seconds: 60 },
    { id: 'h', seconds: 3600 },
    { id: 'day', seconds: 86400 },
    { id: 'yr', seconds: 3.156e7 },
    { id: 'dec', seconds: 3.156e8 },
    { id: 'cen', seconds: 3.156e9 },
  ],
};

/** Position of a duration on the axis, 0–1. */
export const place = (seconds) => (Math.log10(seconds) - axis.from) / (axis.to - axis.from);

/** The principles, in page order. Each gets the anchor #p-<id>. */
export const principles = ['model', 'deadlines', 'placement', 'crypto', 'verify', 'rtl'];

/** The pipeline, in order. */
export const steps = ['constraints', 'model', 'core', 'verify', 'ship'];
