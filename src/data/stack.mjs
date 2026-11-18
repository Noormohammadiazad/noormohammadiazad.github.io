/**
 * The toolbox table in the Process section.
 *
 * Group labels are translated in src/data/i18n/*.mjs under
 * `process.toolbox.groups`. Item names stay untranslated: language, library
 * and algorithm names read the same in both locales, and transliterating
 * them into Persian hurts more than it helps.
 */

export const stack = [
  { id: 'languages', items: ['TypeScript', 'Rust', 'Python', 'C++', 'SQL'] },
  { id: 'graphics', items: ['Three.js', 'WebGL', 'WebAssembly', 'Web Workers'] },
  { id: 'crypto', items: ['WebCrypto', 'WebAuthn', 'AES-GCM', 'HKDF', 'ML-KEM'] },
  { id: 'media', items: ['CLAP', 'FFmpeg', 'Manim', 'whisper.cpp'] },
  { id: 'data', items: ['TensorFlow.js', 'NumPy', 'IndexedDB'] },
  { id: 'platforms', items: ['Django', 'PostgreSQL', 'Redis', 'React', 'Svelte', 'Docker'] },
  { id: 'tooling', items: ['Vite', 'Vitest', 'CMake', 'GitHub Actions'] },
];
