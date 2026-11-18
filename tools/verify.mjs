#!/usr/bin/env node
/**
 * Everything that has to be true before the site ships, in one command.
 * CI runs it on every push; run it locally before pushing.
 *
 *   npm run verify
 *
 *   1. build     node build.mjs — which itself fails on a performance-budget
 *                breach or on any gap in the English/Persian parity check.
 *   2. output    dist/ holds every file Pages needs, the hashed script, and
 *                a CNAME naming mammadali.ir.
 *   3. workflow  .github/workflows holds exactly one file, named
 *                <slug-of-its-name>-<UTC YYYYMMDD>-<UTC HHMMSS>.yml, with a
 *                verify job and a deploy job that needs it.
 *   4. history   main is a single root commit with the agreed message, and
 *                author and committer are the one repository identity. No
 *                other branches and no refs/original backups. Skipped only
 *                outside a git checkout or before the first commit.
 */

import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { root, workflowFiles, workflowName, slugify, parseRotated, workflowDir } from './workflow.mjs';

/* The repository's rules for its history. */
const COMMIT_MESSAGE = 'Initial commit: mammadali.ir';
const IDENTITY = 'Noormohammadiazad <Noormohammadiazad@users.noreply.github.com>';
const DOMAIN = 'mammadali.ir';

const results = [];
const check = (name, fn) => {
  try {
    const detail = fn();
    results.push({ name, ok: true, detail });
  } catch (err) {
    results.push({ name, ok: false, detail: err.message });
  }
};
const fail = (msg) => { throw new Error(msg); };

/* 1. Build. Its own output (size report, budget) prints as it runs. */
check('build', () => {
  try {
    execFileSync(process.execPath, [join(root, 'build.mjs')], { cwd: root, stdio: 'inherit' });
  } catch {
    fail('build.mjs failed (see its output above)');
  }
  return 'budgets and translation parity hold';
});

/* 2. Output. */
check('output', () => {
  const dist = join(root, 'dist');
  const required = [
    'index.html', 'fa/index.html', '404.html', 'CNAME', '.nojekyll', 'sitemap.xml',
    'robots.txt', 'site.webmanifest', 'favicon.svg', 'og.jpg', 'apple-touch-icon.png',
    'assets/vazirmatn-fa.woff2', 'assets/vazirmatn-OFL.txt',
  ];
  const missing = required.filter((f) => !existsSync(join(dist, f)));
  if (missing.length) fail(`missing from dist/: ${missing.join(', ')}`);
  const scripts = readdirSync(join(dist, 'assets')).filter((f) => /^app\.[0-9a-f]{10}\.js$/.test(f));
  if (scripts.length !== 1) fail(`expected one dist/assets/app.<hash>.js, found ${scripts.length}`);
  const cname = readFileSync(join(dist, 'CNAME'), 'utf8').trim();
  if (cname !== DOMAIN) fail(`dist/CNAME is "${cname}", expected "${DOMAIN}"`);
  return `${required.length} files, ${scripts[0]}, CNAME ${cname}`;
});

/* 3. The single rotated workflow. */
check('workflow', () => {
  const files = workflowFiles();
  if (files.length !== 1) fail(`.github/workflows must hold exactly one file, found ${files.length}: ${files.join(', ') || '(none)'}`);
  const [file] = files;
  const parsed = parseRotated(file);
  if (!parsed) fail(`${file} is not named <slug>-<YYYYMMDD>-<HHMMSS>.yml — run npm run rotate:workflow`);
  const slug = slugify(workflowName(file));
  if (parsed.slug !== slug) fail(`${file} should start with "${slug}" (the slug of its name)`);
  if (parsed.date.getTime() > Date.now() + 5 * 60 * 1000) fail(`${file} is stamped in the future`);
  const yml = readFileSync(join(workflowDir, file), 'utf8');
  if (!/^ {2}verify:\s*$/m.test(yml)) fail(`${file} has no "verify" job`);
  if (!/^ {2}deploy:\s*$/m.test(yml)) fail(`${file} has no "deploy" job`);
  if (!/^ {4}needs:\s*verify\s*$/m.test(yml)) fail(`${file}: the deploy job must need verify`);
  return file;
});

/* 4. History. */
check('history', () => {
  const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  try {
    git('rev-parse', '--verify', 'HEAD');
  } catch {
    return 'skipped: no commit yet';
  }

  const count = Number(git('rev-list', '--count', 'HEAD'));
  if (count !== 1) fail(`main must be a single commit, found ${count}`);
  const parents = git('rev-list', '--parents', '-n', '1', 'HEAD').split(/\s+/).length - 1;
  if (parents !== 0) fail('the commit must be a root commit (no parents)');

  const message = git('log', '-1', '--format=%B');
  if (message !== COMMIT_MESSAGE) fail(`commit message must be exactly "${COMMIT_MESSAGE}"`);

  const identities = [...new Set(git('log', '--format=%an <%ae> | %cn <%ce>').split('\n'))];
  const expected = `${IDENTITY} | ${IDENTITY}`;
  if (identities.length !== 1 || identities[0] !== expected) {
    fail(`author and committer must both be ${IDENTITY}; found: ${identities.join('; ')}`);
  }

  const refs = git('for-each-ref', '--format=%(refname)').split('\n').filter(Boolean);
  const backups = refs.filter((r) => r.startsWith('refs/original/'));
  if (backups.length) fail(`backup refs present: ${backups.join(', ')}`);
  const branches = refs.filter((r) => r.startsWith('refs/heads/'));
  if (branches.length !== 1 || branches[0] !== 'refs/heads/main') fail(`only main may exist locally, found: ${branches.join(', ')}`);

  return `one root commit "${COMMIT_MESSAGE}" by ${IDENTITY}`;
});

/* Report. */
console.log('\n  verify');
for (const r of results) console.log(`  ${r.ok ? '✓' : '✗'} ${r.name.padEnd(9)} ${r.detail}`);
const failed = results.filter((r) => !r.ok);
console.log(failed.length ? `\n  ${failed.length} check(s) failed\n` : '\n  all checks passed\n');
process.exitCode = failed.length ? 1 : 0;
