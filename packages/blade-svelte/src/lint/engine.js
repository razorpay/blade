// The class lint's engine: synchronous, so oxlint's and ESLint's rules can
// call it. What a class sets comes from `index.json`, generated from Blade's
// UnoCSS config (`src/test/lint-index.test.ts` writes it and fails on drift);
// a class the index does not know is an app's own, and is left alone.
import { readFileSync } from 'node:fs';

let cached;

/** The class index: what each Blade class sets. */
export function loadIndex() {
  cached ??= JSON.parse(readFileSync(new URL('./index.json', import.meta.url), 'utf8'));
  return cached;
}

/**
 * Splits a class into its variants (`d:hover:`), the utility (`p-blade-5`)
 * and whether it is important (`!p-0`, `p-0!`). Colons inside brackets
 * belong to the utility: `[&:active]:scale-95`, `[--x:1px]`.
 */
export function splitClass(token) {
  const parts = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < token.length; i += 1) {
    const char = token[i];
    if (char === '[' || char === '(') depth += 1;
    else if (char === ']' || char === ')') depth -= 1;
    else if (char === ':' && depth === 0) {
      parts.push(token.slice(start, i));
      start = i + 1;
    }
  }
  let utility = token.slice(start);
  let important = false;
  if (utility.startsWith('!')) {
    important = true;
    utility = utility.slice(1);
  }
  if (utility.endsWith('!')) {
    important = true;
    utility = utility.slice(0, -1);
  }
  return { variants: parts.join(':'), utility, important };
}

const ARBITRARY_PROPERTY = /^\[(--[\w-]+|[a-z-]+):.+\]$/;
const ARBITRARY_VALUE = /^-?([a-z][a-z-]*?)-\[.+\]$/;

/**
 * What a utility sets, as keys: its CSS property (`padding-inline`), or for
 * `display` its value too (`display:none`), or the custom properties a
 * composing utility writes (`--blade-scale-x`). Undefined for a class the
 * index does not know (an app's own).
 */
export function keysOf(utility, index = loadIndex()) {
  const known = index.utilities[utility];
  if (known !== undefined) return known.split(',');
  const property = ARBITRARY_PROPERTY.exec(utility);
  if (property) return [property[1]];
  const value = ARBITRARY_VALUE.exec(utility);
  if (value && index.arbitrary[value[1]]) return index.arbitrary[value[1]].split(',');
  return undefined;
}

/** A key without its value: `display:none` and `display:flex` are both `display`. */
const property = (key) => key.split(':')[0];

/**
 * Pairs of classes in one class list that set the same property under the
 * same variants. Without a merge (`cx` joins), both apply and the
 * stylesheet's order decides which wins, not the list's. A pair where one
 * side is important (`!`) is an intended override and passes.
 */
export function conflictsIn(tokens, index = loadIndex()) {
  const seen = new Map();
  const conflicts = [];
  for (const token of new Set(tokens)) {
    const { variants, utility, important } = splitClass(token);
    const keys = keysOf(utility, index);
    if (!keys) continue;
    for (const key of keys) {
      // Keyed by importance too: an important class must not hide a
      // conflict between two plain ones after it (`!p-1 p-2 p-3`).
      const slot = `${variants}|${property(key)}|${important}`;
      const earlier = seen.get(slot);
      if (earlier) {
        conflicts.push({ first: earlier, second: token, property: property(key) });
      } else {
        seen.set(slot, token);
      }
    }
  }
  return conflicts;
}

/**
 * A class that only Blade's vocabulary could mean, so an unknown one is a
 * typo: a `-blade-` scale, or a colour token's three words after its prefix
 * (`bg-surface-gray-subtle`). An app's own palette (`bg-surface-50`) is not.
 */
export function isBladeShaped(utility, index = loadIndex()) {
  if (/-blade-/.test(utility)) return true;
  const match = /^-?([a-z]+)-([a-z]+)-[a-z]+-[a-z]/.exec(utility);
  return Boolean(
    match && index.colorPrefixes.includes(match[1]) && index.colorCategories.includes(match[2]),
  );
}

/** Whether a class is one Blade's config defines (or `blade.css` does). */
export function isKnown(utility, index = loadIndex()) {
  return keysOf(utility, index) !== undefined || index.bladeCss.includes(utility);
}

const SPACING_PREFIX = /^(-?)(p[xytrbl]?|m[xytrbl]?|m[se]|gap(?:-[xy])?|inset(?:-[xy])?|top|right|bottom|left|w|h|min-w|min-h|max-w|max-h)-\[(-?\d+(?:\.\d+)?px)\]$/;

/** `p-[16px]` → `p-blade-5`: an arbitrary length that is a Blade spacing token. */
export function tokenFor(utility, index = loadIndex()) {
  const match = SPACING_PREFIX.exec(utility);
  if (!match) return undefined;
  const [, negative, prefix, length] = match;
  const step = index.spacing[length.replace(/^-/, '')];
  if (step === undefined || length === '0px') return undefined;
  const suggestion = `${negative}${prefix}-blade-${step}`;
  return index.utilities[suggestion.replace(/^-/, '')] !== undefined ? suggestion : undefined;
}

/**
 * What a Blade component's `class` may set: where it sits, not how it looks
 * (its props draw that). Margin, size, its part in a flex or grid parent,
 * position, `display: none`, visibility — and a token repointed with a
 * custom property (`[--interactive-background-primary-default:…]`), which is
 * what Blade's `styleOverride` slots allowed. Blade's own composing
 * variables (`--blade-*`) are not tokens.
 */
const PLACEMENT = /^(margin(-.+)?|width|height|min-width|min-height|max-width|max-height|inline-size|block-size|flex|flex-grow|flex-shrink|flex-basis|align-self|justify-self|place-self|order|grid-column(-.+)?|grid-row(-.+)?|grid-area|position|inset(-.+)?|top|right|bottom|left|z-index|visibility|display:none)$/;

/**
 * What a component's `class` also sets by design: typography its alignment,
 * Skeleton its radius (a placeholder takes the shape it stands in for).
 */
export const COMPONENT_KEYS = {
  Text: ['text-align'],
  Heading: ['text-align'],
  Display: ['text-align'],
  Code: ['text-align'],
  Amount: ['text-align'],
  Skeleton: ['border-radius'],
};

/**
 * The keys of a class passed to a Blade component that restyle it, or an
 * empty list when it only places it. `allow` takes class globs (`rounded-*`).
 */
export function restyles(token, component, allow = [], index = loadIndex()) {
  const { utility } = splitClass(token);
  if (allow.some((glob) => globMatch(glob, utility))) return [];
  const keys = keysOf(utility, index);
  if (!keys) return [];
  return keys.filter(
    (key) =>
      !PLACEMENT.test(key) &&
      !(key.startsWith('--') && !key.startsWith('--blade-')) &&
      !COMPONENT_KEYS[component]?.includes(key),
  );
}

function globMatch(glob, value) {
  const pattern = new RegExp(
    `^${glob.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*')}$`,
  );
  return pattern.test(value);
}
