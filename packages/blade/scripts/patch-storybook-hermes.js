#!/usr/bin/env node
// Patches Unicode property escapes (\p{Lu}, \p{ID_Start}, etc.) with ASCII equivalents.
// Hermes in RN 0.72 doesn't support Unicode property escapes in RegExp.
//
// Affected dependencies:
//   - es-toolkit (CASE_SPLIT_PATTERN uses \p{Lu}/\p{Ll}) — bundled into Storybook chunks
//   - jsdoc-type-pratt-parser (identifierStartRegex uses \p{ID_Start}) — bundled into Storybook chunks
//
// Why not upgrade RN? RN 0.76+ ships Hermes with Unicode property escape support,
// but requires React 19 which is incompatible with blade's React 18 peer dependency.
// See: https://github.com/nicolo-ribaudo/tc39-proposal-regexp-unicode-property-escapes
//      https://hermesengine.dev/docs/language-features
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const localNodeModules = path.resolve(__dirname, '../node_modules');
const rootNodeModules = path.resolve(__dirname, '../../../node_modules');

const CASE_SPLIT_REPLACEMENT = 'var CASE_SPLIT_PATTERN = /[A-Z]?[a-z]+|[0-9]+|[A-Z]+(?![a-z])/g;';

const COMPAT_WORDS_CJS = `'use strict';
Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
var CASE_SPLIT_PATTERN = /[A-Z]?[a-z]+|[0-9]+|[A-Z]+(?![a-z])/g;
function words(str, pattern, guard) {
  var input = String(str == null ? '' : str);
  var re = (guard || !pattern) ? CASE_SPLIT_PATTERN : pattern;
  if (typeof re === 'number') re = re.toString();
  var result = Array.from(input.match(re) || []);
  return result.filter(function(x) { return x !== ''; });
}
exports.words = words;
`;

const COMPAT_WORDS_ESM = `var CASE_SPLIT_PATTERN = /[A-Z]?[a-z]+|[0-9]+|[A-Z]+(?![a-z])/g;
function words(str, pattern, guard) {
  var input = String(str == null ? '' : str);
  var re = (guard || !pattern) ? CASE_SPLIT_PATTERN : pattern;
  if (typeof re === 'number') re = re.toString();
  var result = Array.from(input.match(re) || []);
  return result.filter(function(x) { return x !== ''; });
}
export { words };
`;

// Find all files containing Unicode property escapes
const files = [];
for (const nodeModules of [localNodeModules, rootNodeModules]) {
  if (!fs.existsSync(nodeModules)) continue;
  try {
    const found = execSync(
      `grep -rl "\\\\p{" "${nodeModules}" --include="*.js" --include="*.mjs" 2>/dev/null || true`,
      { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 },
    )
      .trim()
      .split('\n')
      .filter(Boolean);
    files.push(...found);
  } catch {
    // ignore
  }
}

let patched = 0;
for (const file of files) {
  if (file.includes('.d.ts') || file.includes('.map')) continue;
  // Skip files not related to es-toolkit or storybook string utils
  if (!file.includes('es-toolkit') && !file.includes('storybook')) continue;

  let content = fs.readFileSync(file, 'utf8');

  // Case 1: compat/string/words.js or words.mjs — full file replacement
  if (file.endsWith('/compat/string/words.js') || file.endsWith('/compat/string/words.mjs')) {
    const isCjs = file.endsWith('.js');
    fs.writeFileSync(file, isCjs ? COMPAT_WORDS_CJS : COMPAT_WORDS_ESM);
    console.log('[patch-storybook-hermes] Replaced:', file);
    patched++;
    continue;
  }

  // Case 2: Files with CASE_SPLIT_PATTERN inline regex containing \p{
  const idx = content.indexOf('CASE_SPLIT_PATTERN');
  if (idx >= 0) {
    const lineStart = content.lastIndexOf('\n', idx) + 1;
    const lineEnd = content.indexOf('\n', idx);
    if (lineEnd < 0) continue;
    const line = content.substring(lineStart, lineEnd);

    if (line.includes('\\p{') || line.includes('/\\p{')) {
      content =
        content.substring(0, lineStart) + CASE_SPLIT_REPLACEMENT + content.substring(lineEnd);
      fs.writeFileSync(file, content);
      console.log('[patch-storybook-hermes] Patched CASE_SPLIT:', file);
      patched++;
      continue;
    }
  }

  // Case 3: browser.global.js or other bundled files with \p{ in regex context
  if (content.includes('\\p{') && (file.includes('browser.global') || file.includes('chunk-'))) {
    // Replace the Unicode word regex pattern with ASCII equivalent
    content = content.replace(
      /var CASE_SPLIT_PATTERN\s*=\s*\/[^/]+\/[gimusy]*;/g,
      CASE_SPLIT_REPLACEMENT,
    );
    // Also replace string-built Unicode regexes referencing \p{Lu} etc
    content = content.replace(
      /const rUnicodeUpper\s*=\s*['"]\\\\p\{Lu\}['"];/g,
      "const rUnicodeUpper = '[A-Z]';",
    );
    content = content.replace(
      /const rUnicodeLower\s*=\s*['"]\\\\p\{Ll\}['"];/g,
      "const rUnicodeLower = '[a-z]';",
    );
    fs.writeFileSync(file, content);
    console.log('[patch-storybook-hermes] Patched bundle:', file);
    patched++;
  }
}

// Patch identifierStartRegex from jsdoc-type-pratt-parser (uses \p{ID_Start}, \p{Hex_Digit})
const idFiles = [];
for (const nodeModules of [localNodeModules, rootNodeModules]) {
  if (!fs.existsSync(nodeModules)) continue;
  try {
    const found = execSync(
      `grep -rl "identifierStartRegex = new RegExp" "${nodeModules}" --include="*.js" --include="*.mjs" 2>/dev/null || true`,
      { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 },
    )
      .trim()
      .split('\n')
      .filter(Boolean);
    idFiles.push(...found);
  } catch {
    // ignore
  }
}

for (const file of idFiles) {
  let content = fs.readFileSync(file, 'utf8');
  const marker = 'identifierStartRegex = new RegExp';
  const idx = content.indexOf(marker);
  if (idx < 0) continue;
  const lineStart = content.lastIndexOf('\n', idx) + 1;
  const endMarker = 'identifierContinueRegex = new RegExp';
  const contIdx = content.indexOf(endMarker, idx);
  if (contIdx < 0) continue;
  const semiIdx = content.indexOf(';', contIdx);
  if (semiIdx < 0) continue;
  const lineEnd = semiIdx + 1;
  content = `${content.substring(
    0,
    lineStart,
  )}        var identifierStartRegex = /[$_a-zA-Z]/, identifierContinueRegex = /[$_a-zA-Z0-9]/;${content.substring(
    lineEnd,
  )}`;
  fs.writeFileSync(file, content);
  console.log('[patch-storybook-hermes] Patched identifierRegex:', file);
  patched++;
}

console.log(`[patch-storybook-hermes] Done. Patched ${patched} file(s).`);
