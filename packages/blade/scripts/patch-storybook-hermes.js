#!/usr/bin/env node
// Patches es-toolkit Unicode property escapes (\p{Lu}) with ASCII equivalents.
// Hermes in RN 0.72 doesn't support Unicode property escapes in RegExp.
// The regex is inlined in multiple storybook dist files via bundling.
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const nodeModules = path.resolve(__dirname, '../node_modules');
const replacement = 'var CASE_SPLIT_PATTERN = /[A-Z]?[a-z]+|[0-9]+|[A-Z]+(?![a-z])/g;';

// Find all files containing the problematic regex
let files;
try {
  files = execSync(
    `grep -rl "\\\\\\\\p{Lu}" "${nodeModules}" --include="*.js" --include="*.mjs" 2>/dev/null || true`,
    { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 }
  ).trim().split('\n').filter(Boolean);
} catch {
  files = [];
}

let patched = 0;
for (const file of files) {
  if (file.includes('.d.ts') || file.includes('.map')) continue;
  let content = fs.readFileSync(file, 'utf8');
  const idx = content.indexOf('CASE_SPLIT_PATTERN');
  if (idx < 0) continue;

  const lineStart = content.lastIndexOf('\n', idx) + 1;
  const lineEnd = content.indexOf('\n', idx);
  const line = content.substring(lineStart, lineEnd);

  if (line.includes('\\p{') || line.includes('/\\p{')) {
    content = content.substring(0, lineStart) + replacement + content.substring(lineEnd);
    fs.writeFileSync(file, content);
    console.log('[patch-storybook-hermes] Patched:', path.relative(nodeModules, file));
    patched++;
  }
}

console.log(`[patch-storybook-hermes] Done. Patched ${patched} file(s).`);
