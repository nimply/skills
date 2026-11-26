#!/usr/bin/env node
// Checks the skill before a release. No dependencies. Run: node scripts/check.mjs
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const skillDir = join(root, 'skills', 'nimply');
const errors = [];
const warn = [];
const read = (p) => readFileSync(join(root, p), 'utf8');

// 1. Frontmatter
const skill = read('skills/nimply/SKILL.md');
const fm = skill.match(/^---\n([\s\S]*?)\n---\n/);
if (!fm) errors.push('SKILL.md has no frontmatter');
const front = fm ? fm[1] : '';
const field = (k) => (front.match(new RegExp(`^${k}:\\s*(.+)$`, 'm')) || [])[1]?.trim();
const name = field('name');
const description = field('description') || '';
if (name !== 'nimply') errors.push(`name must be "nimply" to match its folder, got "${name}"`);
if (description.length < 50) errors.push('description is missing or too short');
if (description.length > 1024) errors.push(`description is ${description.length} chars; the limit is 1024`);
const allowed = new Set(['name', 'description', 'license', 'compatibility', 'metadata', 'allowed-tools']);
for (const line of front.split('\n')) {
  const m = line.match(/^([A-Za-z_-]+):/);
  if (m && !allowed.has(m[1])) errors.push(`frontmatter key "${m[1]}" is rejected by claude.ai uploads`);
}
const skillVersion = (front.match(/^\s+version:\s*"?([\d.]+)"?/m) || [])[1];
const snapshot = (front.match(/^\s+snapshot:\s*"?([\d-]+)"?/m) || [])[1];

// 2. Versions agree
const plugin = JSON.parse(read('.claude-plugin/plugin.json'));
const market = JSON.parse(read('.claude-plugin/marketplace.json'));
if (plugin.version !== skillVersion)
  errors.push(`version mismatch: plugin.json ${plugin.version} vs SKILL.md metadata ${skillVersion}`);
if (!read('CHANGELOG.md').includes(`## ${plugin.version} `))
  errors.push(`CHANGELOG.md has no entry for ${plugin.version}`);
if (market.plugins?.[0]?.name !== plugin.name) errors.push('marketplace entry name must equal plugin.json name');
if (market.plugins?.[0]?.version) errors.push('set version in plugin.json only, not in the marketplace entry');

// 3. Size and links
const lines = skill.split('\n').length;
if (lines > 500) errors.push(`SKILL.md is ${lines} lines; keep it under 500`);
const refs = readdirSync(join(skillDir, 'references')).filter((f) => f.endsWith('.md'));
for (const m of skill.matchAll(/references\/([a-z-]+\.md)/g))
  if (!refs.includes(m[1])) errors.push(`SKILL.md points to missing references/${m[1]}`);
for (const f of refs) {
  const body = read(`skills/nimply/references/${f}`);
  if (!skill.includes(`references/${f}`)) warn.push(`references/${f} is never mentioned in SKILL.md`);
  for (const m of body.matchAll(/`([a-z-]+\.md)`/g))
    if (!refs.includes(m[1]) && m[1] !== 'SKILL.md' && !existsSync(join(root, m[1])))
      errors.push(`${f} points to missing ${m[1]}`);
  if (body.split('\n').length > 300 && !/^## Contents/m.test(body))
    warn.push(`${f} is over 300 lines and has no "## Contents" section`);
  const snap = (body.match(/^Snapshot:\s*([\d-]+)/m) || [])[1];
  if (snap && snapshot && snap > snapshot) errors.push(`${f} snapshot ${snap} is newer than SKILL.md ${snapshot}`);
}

// 4. Nothing internal or secret. This repository is public.
const banned = [
  [/nim_live_[A-Za-z0-9]{12,}/, 'looks like a real API key'],
  [/whsec_[A-Za-z0-9]{12,}/, 'looks like a real webhook secret'],
  [/sk_(live|test)_[A-Za-z0-9]+/, 'looks like a Stripe key'],
  [/\b(Fargate|BullMQ|Prisma|Supabase|NestJS|Redis|Copilot manifest|SendGrid)\b/i, 'internal infrastructure detail'],
  [/nimply_(nestjs_backend|app_frontend|landing_nextjs|admin_panel)/, 'internal repository name'],
  [/\b[A-Z][A-Z0-9]+(_[A-Z0-9]+){2,}\s*=/, 'looks like an environment variable'],
  [/\.(service|controller|template)\.ts\b/, 'internal file path'],
  [/\b(unlimited AI|guaranteed)\b/i, 'overclaim'],
];
const publicFiles = ['README.md', 'CHANGELOG.md', 'skills/nimply/SKILL.md', ...refs.map((f) => `skills/nimply/references/${f}`)];
for (const f of publicFiles) {
  const body = read(f);
  for (const [re, why] of banned) {
    const m = body.match(re);
    if (m && !(why === 'overclaim' && /never say|Never say/.test(body.slice(Math.max(0, m.index - 40), m.index))))
      errors.push(`${f}: "${m[0]}" — ${why}`);
  }
}

for (const w of warn) console.log(`warning: ${w}`);
if (errors.length) {
  for (const e of errors) console.error(`error: ${e}`);
  process.exit(1);
}
console.log(`ok: nimply ${plugin.version} (snapshot ${snapshot}), SKILL.md ${lines} lines, ${refs.length} references, description ${description.length} chars`);
