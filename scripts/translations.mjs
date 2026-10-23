#!/usr/bin/env node
// Translation check: every ru original has en and zh files whose `sourceHash` equals the original's hash.
//   node scripts/translations.mjs              check everything (exit 1 on problems)
//   node scripts/translations.mjs stamp <dir>  write the current ru hash into en/zh,
//                                              e.g. stamp src/content/posts/my-post
// Drafts (`draft: true` in ru) are skipped.
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOTS = ['src/content/posts', 'src/content/projects'];
const TARGETS = ['en', 'zh'];
const EXT = ['mdx', 'md'];

const find = (dir, lang) => EXT.map((e) => join(dir, `${lang}.${e}`)).find(existsSync);
const hash = (file) =>
  createHash('sha256').update(readFileSync(file, 'utf8').replace(/\r\n/g, '\n')).digest('hex').slice(0, 12);
const frontmatter = (text) => text.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
const field = (text, name) => frontmatter(text).match(new RegExp(`^${name}:\\s*['"]?([^'"\\n]+)`, 'm'))?.[1]?.trim();

function stamp(dir) {
  const ru = find(dir, 'ru');
  if (!ru) throw new Error(`${dir}: no ru original`);
  const h = hash(ru);
  for (const lang of TARGETS) {
    const file = find(dir, lang);
    if (!file) { console.error(`${dir}: no ${lang} translation`); process.exitCode = 1; continue; }
    const text = readFileSync(file, 'utf8');
    const next = /^sourceHash:/m.test(frontmatter(text))
      ? text.replace(/^(---\n[\s\S]*?)^sourceHash:.*$/m, `$1sourceHash: ${h}`)
      : text.replace(/^---\n/, `---\nsourceHash: ${h}\n`);
    writeFileSync(file, next);
    console.log(`${file}: sourceHash ${h}`);
  }
}

function check() {
  const problems = [];
  for (const root of ROOTS) {
    if (!existsSync(root)) continue;
    for (const entry of readdirSync(root, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const dir = join(root, entry.name);
      const ru = find(dir, 'ru');
      if (!ru) { problems.push(`${dir}: no ru original`); continue; }
      if (field(readFileSync(ru, 'utf8'), 'draft') === 'true') continue;
      const h = hash(ru);
      for (const lang of TARGETS) {
        const file = find(dir, lang);
        if (!file) { problems.push(`${dir}: no ${lang} translation`); continue; }
        const got = field(readFileSync(file, 'utf8'), 'sourceHash');
        if (got !== h) problems.push(`${file}: stale translation (sourceHash ${got ?? 'none'}, original ${h})`);
      }
    }
  }
  if (problems.length) {
    console.error(`Translations are out of date:\n  ${problems.join('\n  ')}\n` +
      'Update the translation from the ru original, then run: pnpm translations stamp <dir>');
    process.exit(1);
  }
  console.log('Translations are up to date.');
}

const [cmd, arg] = process.argv.slice(2);
if (cmd === 'stamp') {
  if (!arg) { console.error('usage: stamp <entry dir>'); process.exit(2); }
  stamp(arg);
} else check();
