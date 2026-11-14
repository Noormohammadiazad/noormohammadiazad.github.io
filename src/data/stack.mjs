/**
 * "What I work with" — the grouped table in the About section.
 *
 * Group labels are translated in src/data/i18n/*.mjs under `stack.groups`.
 * Item names stay untranslated: product and language names read the same
 * in both locales, and transliterating them into Persian hurts more than
 * it helps.
 */

export const stack = [
  { id: 'languages', items: ['TypeScript', 'JavaScript', 'Rust', 'HTML', 'CSS'] },
  { id: 'web', items: ['React', 'Svelte', 'Web Workers', 'WebAssembly', 'Service workers'] },
  { id: 'crypto', items: ['WebCrypto', 'WebAuthn', 'Nostr', 'WebRTC', 'iroh'] },
  { id: 'tooling', items: ['Vite', 'Node.js', 'Vitest', 'GitHub Actions'] },
];
