/**
 * The single GitHub Actions workflow, and how it is named.
 *
 * The repository keeps exactly one workflow file. Before every push it is
 * renamed to <slug-of-its-name>-<UTC YYYYMMDD>-<UTC HHMMSS>.yml, so GitHub
 * treats it as a new workflow and every push starts again at run #1.
 * rotate-workflow.mjs does the renaming; verify.mjs checks the result. Both
 * read these rules from here so they cannot disagree.
 */

import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = join(dirname(fileURLToPath(import.meta.url)), '..');
export const workflowDir = join(root, '.github', 'workflows');

/* Files the OS may drop into the folder. They are git-ignored, so they can
   never reach the repository, and are not counted. */
const OS_JUNK = new Set(['.DS_Store', 'Thumbs.db']);

/** Everything in .github/workflows that could be committed. */
export function workflowFiles() {
  return readdirSync(workflowDir).filter((f) => !OS_JUNK.has(f));
}

/** The workflow's `name:` (its top-level display name). */
export function workflowName(file) {
  const text = readFileSync(join(workflowDir, file), 'utf8');
  const m = text.match(/^name:\s*(.+?)\s*$/m);
  if (!m) throw new Error(`${file} has no top-level "name:"`);
  return m[1].replace(/^(['"])(.*)\1$/, '$2');
}

/** "Verify and deploy" -> "verify-and-deploy". */
export function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** UTC timestamp in the file-name form: 20261114-013045. */
export function stamp(date = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return (
    `${date.getUTCFullYear()}${p(date.getUTCMonth() + 1)}${p(date.getUTCDate())}` +
    `-${p(date.getUTCHours())}${p(date.getUTCMinutes())}${p(date.getUTCSeconds())}`
  );
}

/** Parses a rotated file name; null if it does not follow the scheme. */
export function parseRotated(file) {
  const m = file.match(/^([a-z0-9]+(?:-[a-z0-9]+)*)-(\d{4})(\d{2})(\d{2})-(\d{2})(\d{2})(\d{2})\.yml$/);
  if (!m) return null;
  const [, slug, y, mo, d, h, mi, s] = m;
  const date = new Date(Date.UTC(+y, +mo - 1, +d, +h, +mi, +s));
  /* Reject impossible stamps like 20261399-256199. */
  if (stamp(date) !== `${y}${mo}${d}-${h}${mi}${s}`) return null;
  return { slug, date };
}
