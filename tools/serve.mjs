#!/usr/bin/env node
/**
 * Development server. Builds the site, serves dist/, and rebuilds whenever
 * anything under src/ changes. Standard library only, like the build itself.
 *
 *   node tools/serve.mjs [port]
 */

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { watch } from 'node:fs';
import { spawn } from 'node:child_process';
import { join, extname, normalize, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const port = Number(process.argv[2]) || 4173;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

let building = false;
let queued = false;

function build() {
  if (building) { queued = true; return Promise.resolve(); }
  building = true;
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [join(root, 'build.mjs')], { stdio: 'inherit' });
    child.on('exit', () => {
      building = false;
      if (queued) { queued = false; build().then(resolve); } else resolve();
    });
  });
}

async function resolve(urlPath) {
  // Contain the path: never serve anything outside dist/.
  const clean = normalize(decodeURIComponent(urlPath.split('?')[0])).replace(/^(\.\.[/\\])+/, '');
  let file = join(dist, clean);
  if (file !== dist && !file.startsWith(dist + '/')) return null;

  let isDir = false;
  try {
    isDir = (await stat(file)).isDirectory();
  } catch {
    return null;
  }
  if (isDir) file = join(file, 'index.html');

  try {
    return { file, isDir, body: await readFile(file) };
  } catch {
    return null;
  }
}

const server = createServer(async (req, res) => {
  const url = req.url || '/';
  const path = url.split('?')[0];
  const hit = await resolve(url);

  // Match GitHub Pages: a directory reached without a trailing slash gets a
  // 301, so relative URLs and the language switcher resolve the same locally
  // as they do in production.
  if (hit && hit.isDir && !path.endsWith('/')) {
    res.writeHead(301, { Location: path + '/' + url.slice(path.length) });
    return res.end();
  }

  if (!hit) {
    const notFound = await resolve('/404.html');
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(notFound ? notFound.body : 'Not found');
  }

  res.writeHead(200, {
    'Content-Type': TYPES[extname(hit.file)] || 'application/octet-stream',
    'Cache-Control': 'no-store',
  });
  res.end(hit.body);
});

// Build once before accepting requests, so the first load is never served
// from a half-written dist/.
await build();
watch(join(root, 'src'), { recursive: true }, build);
server.listen(port, () => {
  console.log(`\n  serving http://localhost:${port}  (watching src/)\n`);
});
