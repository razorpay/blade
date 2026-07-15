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

// Always resolve symlinks so grep -R works correctly on macOS
const localNodeModules = (() => {
  try {
    return fs.realpathSync(path.resolve(__dirname, '../node_modules'));
  } catch {
    return path.resolve(__dirname, '../node_modules');
  }
})();
const rootNodeModules = path.resolve(__dirname, '../../../node_modules');

const CASE_SPLIT_REPLACEMENT_VAR =
  'var CASE_SPLIT_PATTERN = /[A-Z]?[a-z]+|[0-9]+|[A-Z]+(?![a-z])/g;';
const CASE_SPLIT_REPLACEMENT_CONST =
  'const CASE_SPLIT_PATTERN = /[A-Z]?[a-z]+|[0-9]+|[A-Z]+(?![a-z])/g;';

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

// Collect ALL files containing \p{ across both node_modules dirs.
// Use -R (uppercase) so grep follows symlinks on macOS.
const allFiles = new Set();
for (const nodeModules of [localNodeModules, rootNodeModules]) {
  if (!fs.existsSync(nodeModules)) continue;
  try {
    const found = execSync(
      `grep -Rl "\\\\p{" "${nodeModules}" --include="*.js" --include="*.mjs" 2>/dev/null || true`,
      { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 },
    )
      .trim()
      .split('\n')
      .filter(Boolean);
    found.forEach((f) => allFiles.add(f));
  } catch {
    // ignore
  }
}

let patched = 0;
for (const file of allFiles) {
  if (file.includes('.d.ts') || file.includes('.map') || file.includes('/.cache/')) continue;

  let content = fs.readFileSync(file, 'utf8');
  const orig = content;

  // Case 1: compat/string/words.js or words.mjs — full file replacement
  if (file.endsWith('/compat/string/words.js') || file.endsWith('/compat/string/words.mjs')) {
    const isCjs = file.endsWith('.js');
    fs.writeFileSync(file, isCjs ? COMPAT_WORDS_CJS : COMPAT_WORDS_ESM);
    console.log('[patch-storybook-hermes] Replaced words file:', file);
    patched++;
    continue;
  }

  // Case 2: CASE_SPLIT_PATTERN (var or const, in any file)
  content = content.replace(/var CASE_SPLIT_PATTERN\s*=\s*\/[^\n;]+;/g, CASE_SPLIT_REPLACEMENT_VAR);
  content = content.replace(
    /const CASE_SPLIT_PATTERN\s*=\s*\/[^\n;]+;/g,
    CASE_SPLIT_REPLACEMENT_CONST,
  );

  // Case 3: identifierStartRegex + identifierContinueRegex (jsdoc-type-pratt-parser, bundled into chunks)
  content = content.replace(
    /(?:let|var|const)\s+identifierStartRegex\s*=\s*new RegExp\([^;\n]{0,200}identifierContinueRegex\s*=\s*new RegExp\([^;\n]{0,200};/g,
    'var identifierStartRegex = /[$_a-zA-Z]/, identifierContinueRegex = /[$_a-zA-Z0-9]/;',
  );
  content = content.replace(
    /(?:let|var|const)\s+identifierStartRegex\s*=\s*new RegExp\([^;]+;/g,
    'var identifierStartRegex = /[$_a-zA-Z]/;',
  );
  content = content.replace(
    /(?:let|var|const)\s+identifierContinueRegex\s*=\s*new RegExp\([^;]+;/g,
    'var identifierContinueRegex = /[$_a-zA-Z0-9]/;',
  );

  // Case 4: string-built Unicode class references (\p{Lu}, \p{Ll})
  content = content.replace(
    /const rUnicodeUpper\s*=\s*['"]\\\\p\{Lu\}['"];/g,
    "const rUnicodeUpper = '[A-Z]';",
  );
  content = content.replace(
    /const rUnicodeLower\s*=\s*['"]\\\\p\{Ll\}['"];/g,
    "const rUnicodeLower = '[a-z]';",
  );

  // Case 5: `new RegExp("…\p{…}…", "…u…")` string form.
  // Minified Storybook browser chunks build these patterns dynamically (with mangled var
  // names), so Case 2 (literal /…/ only) and Case 3 (matches specific var names) both miss
  // them. Hermes rejects \p{} escapes even inside `new RegExp` with the `u` flag, so we
  // neutralise them by pattern *content* and emit an ASCII-equivalent literal instead.
  content = content.replace(
    /new RegExp\(\s*"((?:[^"\\]|\\.)*)"\s*(?:,\s*"([a-z]*)")?\s*\)/g,
    (match, body, flags) => {
      // `body` is the raw source between the quotes, so \p{ appears as the two chars "\\p{".
      if (!body.includes('\\p{')) return match;
      // ASCII fallbacks don't need the `u` flag (and keeping it would re-enable strict escapes).
      const safeFlags = (flags || '').replace(/u/g, '');
      // es-toolkit CASE_SPLIT_PATTERN (word/case splitting)
      if (body.includes('\\p{Lu}') && body.includes('\\p{Ll}')) {
        return `/[A-Z]?[a-z]+|[0-9]+|[A-Z]+(?![a-z])/${safeFlags}`;
      }
      // jsdoc-type-pratt-parser identifierStartRegex
      if (body.includes('\\p{ID_Start}')) {
        return `/[$_a-zA-Z]/${safeFlags}`;
      }
      // jsdoc-type-pratt-parser identifierContinueRegex
      if (body.includes('\\p{ID_Continue}')) {
        return `/[$_a-zA-Z0-9]/${safeFlags}`;
      }
      // Unknown \p{} pattern — leave it untouched rather than risk corrupting an unrelated
      // library (zod, pdfjs, …) that shares node_modules with the web build. If a new
      // Storybook-bundled pattern starts crashing Hermes, add an explicit branch above.
      return match;
    },
  );

  if (content !== orig) {
    fs.writeFileSync(file, content);
    console.log('[patch-storybook-hermes] Patched:', file);
    patched++;
  }
}

console.log(`[patch-storybook-hermes] Done. Patched ${patched} file(s).`);
