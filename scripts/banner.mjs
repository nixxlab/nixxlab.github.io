#!/usr/bin/env node
// Announcement banners of a post: 1280×720 PNG per language, screenshots of the dev-only page /banner/<slug>.<lang>/.
//   node scripts/banner.mjs <slug> [--out <dir>] [--lang ru,en,zh]
//   default output: banners/<slug>/banner-<lang>.png (gitignored)
// Uses a running `astro dev` on :4321 if there is one, otherwise starts its own on :4399 and stops it after.
// Chrome: $CHROME, else Google Chrome / Chromium found on the system.
import { spawn, execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';

const args = process.argv.slice(2);
const slug = args.find((a) => !a.startsWith('--') && !['--out', '--lang'].includes(args[args.indexOf(a) - 1]));
const opt = (name, fallback) => (args.includes(name) ? args[args.indexOf(name) + 1] : fallback);
if (!slug) {
  console.error('usage: node scripts/banner.mjs <slug> [--out <dir>] [--lang ru,en,zh]');
  process.exit(2);
}
const out = resolve(opt('--out', join('banners', slug)));
const langs = opt('--lang', 'ru,en,zh').split(',');

const chrome = [
  process.env.CHROME,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  ...['google-chrome', 'chromium', 'chromium-browser'].map((bin) => {
    try { return execFileSync('which', [bin], { encoding: 'utf8' }).trim(); } catch { return ''; }
  }),
].find((p) => p && existsSync(p));
if (!chrome) {
  console.error('Chrome not found; set CHROME to its binary.');
  process.exit(1);
}

const up = async (base) => {
  try { return (await fetch(`${base}/banner/${slug}.${langs[0]}/`)).ok; } catch { return false; }
};

let base = 'http://localhost:4321';
let server;
if (!(await up(base))) {
  base = 'http://localhost:4399';
  server = spawn('pnpm', ['astro', 'dev', '--port', '4399'], { stdio: 'ignore', detached: true });
  for (let i = 0; i < 60 && !(await up(base)); i++) await new Promise((r) => setTimeout(r, 500));
  if (!(await up(base))) {
    process.kill(-server.pid);
    console.error(`no banner page at ${base}/banner/${slug}.${langs[0]}/ — is "${slug}" a post?`);
    process.exit(1);
  }
}

try {
  mkdirSync(out, { recursive: true });
  for (const lang of langs) {
    const file = join(out, `banner-${lang}.png`);
    rmSync(file, { force: true });
    const shot = spawn(chrome, [
      '--headless=new', '--hide-scrollbars', '--force-device-scale-factor=1', '--window-size=1280,720',
      // time for the fonts and for the sky's glyph vortex to fill in
      '--virtual-time-budget=6000', `--screenshot=${file}`, `${base}/banner/${slug}.${lang}/`,
    ], { stdio: 'ignore' });
    // Against the dev server Chrome writes the shot but does not exit (the live-reload socket stays open):
    // wait for the file, then end Chrome.
    for (let i = 0; i < 120 && !existsSync(file); i++) await new Promise((r) => setTimeout(r, 250));
    await new Promise((r) => setTimeout(r, 500));
    shot.kill();
    if (!existsSync(file)) throw new Error(`no screenshot for ${lang}`);
    console.log(file);
  }
} finally {
  if (server) process.kill(-server.pid);
}
