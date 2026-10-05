/**
 * Declarative input formatting: an ordered list of regex replace rules that can
 * run identically in JS (web) and Kotlin/Swift (native). On web, `Input` builds
 * plain parse/format functions from the rules; on native checkout the spec is
 * serialized onto the element as the `format` attribute and the platform
 * formats synchronously in the same text-change pass (no bridge round-trip, so
 * the caret can't drift during fast typing).
 *
 * Execution model (both sides): left-fold over the rules,
 * `value.replace(new RegExp(pattern, flags), replacement)`. Flags are '' for a
 * first-match replace (Kotlin `replaceFirst`) or 'g' for replace-all (Kotlin
 * `replaceAll`). Null/undefined input folds as ''.
 *
 * PARITY CONTRACT — a rule must behave identically in JS RegExp and
 * java.util.regex / NSRegularExpression. Allowed: character classes
 * (\d \D \s \S \w, [^…]), anchors ^ $, capture groups + alternation,
 * quantifiers * + ? {n} {n,m}, lookahead (?=…) (?!…), dot. Forbidden:
 * lookbehind, named groups, backrefs (\1), unicode properties (\p{…}), any
 * flag other than ''/'g'. Replacement templates: literal text plus $1–$9 only
 * (no $&, no $', no literal `$`). The anatomy enforces this in dev by calling
 * `validateRules` (the model has no build-mode flag).
 */

/** [pattern, flags, replacement] — flags: '' (first match) | 'g' (all). */
export type FormatRule = [pattern: string, flags: '' | 'g', replacement: string];

export type FormatSpec = { parse: FormatRule[]; format: FormatRule[] };

/** True when a parse/format prop is the declarative rule-list form. */
export function isFormatRules(x: unknown): x is FormatRule[] {
  return Array.isArray(x) && (x.length === 0 || Array.isArray(x[0]));
}

// Compiled RegExp objects cached per rules array (specs are module-level
// constants or reactive-memoized factories, so identity is stable).
const compiledCache = new WeakMap<FormatRule[], RegExp[]>();

function compiled(rules: FormatRule[]): RegExp[] {
  let regexps = compiledCache.get(rules);
  if (!regexps) {
    regexps = rules.map(([pattern, flags]) => new RegExp(pattern, flags));
    compiledCache.set(rules, regexps);
  }
  return regexps;
}

/** Left-fold the rules over `value`. Null/undefined coerce to ''. */
export function applyRules(rules: FormatRule[], value: unknown): string {
  let out = value === undefined || value === null ? '' : String(value);
  const regexps = compiled(rules);
  for (let i = 0; i < rules.length; i++) {
    out = out.replace(regexps[i], rules[i][2]);
  }
  return out;
}

// Built functions cached per rules array (stable identity — see compiledCache)
// so reactive re-derivation in Input.svelte is free.
const fnCache = new WeakMap<FormatRule[], (value: unknown) => string>();

/** Build a pure (value) => string function from a rule list (for updater etc.). */
export function compileRules(rules: FormatRule[]): (value: unknown) => string {
  let fn = fnCache.get(rules);
  if (fn) {
    return fn;
  }
  fn = (value) => applyRules(rules, value);
  fnCache.set(rules, fn);
  return fn;
}

// One spec per pattern: the rule arrays keep their identity, so the
// compile caches above hold across re-derivation (a card number's pattern
// is re-picked on every keystroke).
const patternCache = new Map<string, FormatSpec>();

/**
 * A spec from a `#` pattern (`#### #### ####`, `## / ##`): parse keeps the
 * digits, up to one per `#`; format places the literal text between the
 * `#` runs once the digits reach it. The literals must not contain `$`.
 */
export function patternFormat(pattern: string): FormatSpec {
  const cached = patternCache.get(pattern);
  if (cached) {
    return cached;
  }
  const inserts: Array<[at: number, text: string]> = [];
  let slots = 0;
  let literal = '';
  for (const char of pattern) {
    if (char !== '#') {
      literal += char;
      continue;
    }
    if (literal) {
      inserts.push([slots, literal]);
      literal = '';
    }
    slots += 1;
  }
  const spec: FormatSpec = {
    parse: [
      ['\\D', 'g', ''],
      [`^(.{${slots}}).*$`, '', '$1'],
    ],
    // Last literal first: inserting it leaves the earlier positions intact.
    format: inserts
      .reverse()
      .map(([at, text]): FormatRule => [`^(.{${at}})(.+)$`, '', `$1${text}$2`]),
  };
  patternCache.set(pattern, spec);
  return spec;
}

/** Wire form for the native `format` attribute: short keys, stable order. */
export function serializeSpec(spec: FormatSpec): string {
  return JSON.stringify({ p: spec.parse, f: spec.format });
}

const FORBIDDEN_PATTERN = /\(\?<|\\[1-9]|\\p\{|\\k</i; /* lookbehind/named groups, backrefs, \p{…} */
const FORBIDDEN_REPLACEMENT = /\$(?![1-9])/; /* $&, $', $`, bare/literal $ */

/**
 * Guard for the JS↔native parity subset; anatomies call it under their dev
 * flag. Returns a description of the first violation, or null when the rules
 * are clean. (Result-style — sync functions must not throw.)
 */
export function validateRules(rules: FormatRule[]): string | null {
  for (const [pattern, flags, replacement] of rules) {
    if (flags !== '' && flags !== 'g') {
      return `flags must be '' or 'g', got '${flags}' in /${pattern}/`;
    }
    if (FORBIDDEN_PATTERN.test(pattern)) {
      return `pattern /${pattern}/ uses syntax outside the JS↔native subset`;
    }
    if (FORBIDDEN_REPLACEMENT.test(replacement)) {
      return `replacement '${replacement}' may only reference $1–$9`;
    }
    try {
      RegExp(pattern, flags);
    } catch {
      return `pattern /${pattern}/ does not compile`;
    }
  }
  return null;
}
