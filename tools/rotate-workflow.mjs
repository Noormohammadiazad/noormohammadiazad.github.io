#!/usr/bin/env node
/**
 * Renames the repository's single workflow file to
 * <slug-of-its-name>-<UTC YYYYMMDD>-<UTC HHMMSS>.yml.
 *
 *   npm run rotate:workflow
 *
 * Run it before every push (see "Shipping" in the README). GitHub numbers
 * runs per workflow file, so a fresh file name means the push starts at
 * run #1. Refuses to run if the folder does not hold exactly one file.
 */

import { renameSync } from 'node:fs';
import { join } from 'node:path';
import { workflowDir, workflowFiles, workflowName, slugify, stamp } from './workflow.mjs';

const files = workflowFiles();
if (files.length !== 1) {
  console.error(`\n  rotate:workflow: .github/workflows must hold exactly one file, found ${files.length}: ${files.join(', ') || '(none)'}\n`);
  process.exit(1);
}

const [current] = files;
const next = `${slugify(workflowName(current))}-${stamp()}.yml`;

if (next === current) {
  console.log(`\n  rotate:workflow: ${current} is already current\n`);
} else {
  renameSync(join(workflowDir, current), join(workflowDir, next));
  console.log(`\n  rotate:workflow: ${current} -> ${next}\n`);
}
