/**
 * How Tailwind v3 reads a value in brackets (src/util/dataTypes.js): `_` is
 * a space, `--x` is `var(--x)`, math in `calc()` gets its spaces, and its
 * type — colour, length, image… — decides which utility takes it
 * (`text-[14px]` is a size, `text-[#fff]` a colour). Ported so classes
 * written for Tailwind mean the same here.
 */
import { parseColor } from './color';

/** Splits on `separator` outside brackets and parentheses. */
export function splitAtTopLevelOnly(input: string, separator: string): string[] {
  const stack: string[] = [];
  const parts: string[] = [];
  let lastPos = 0;
  let isEscaped = false;
  for (let index = 0; index < input.length; index++) {
    const char = input[index];
    if (stack.length === 0 && char === separator[0] && !isEscaped) {
      if (separator.length === 1 || input.slice(index, index + separator.length) === separator) {
        parts.push(input.slice(lastPos, index));
        lastPos = index + separator.length;
      }
    }
    if (isEscaped) isEscaped = false;
    else if (char === '\\') isEscaped = true;
    if (char === '(' || char === '[' || char === '{') stack.push(char);
    else if (
      (char === ')' && stack[stack.length - 1] === '(') ||
      (char === ']' && stack[stack.length - 1] === '[') ||
      (char === '}' && stack[stack.length - 1] === '{')
    ) {
      stack.pop();
    }
  }
  parts.push(input.slice(lastPos));
  return parts;
}

const PREVENT_FORMATTING_KEYWORDS = [
  'min-content',
  'max-content',
  'fit-content',
  'safe-area-inset-top',
  'safe-area-inset-right',
  'safe-area-inset-bottom',
  'safe-area-inset-left',
  'titlebar-area-x',
  'titlebar-area-y',
  'titlebar-area-width',
  'titlebar-area-height',
  'keyboard-inset-top',
  'keyboard-inset-right',
  'keyboard-inset-bottom',
  'keyboard-inset-left',
  'keyboard-inset-width',
  'keyboard-inset-height',
  'radial-gradient',
  'linear-gradient',
  'conic-gradient',
  'repeating-radial-gradient',
  'repeating-linear-gradient',
  'repeating-conic-gradient',
];

/** Spaces around `+ - * /` in math functions, where they are operators. */
function normalizeMathOperatorSpacing(value: string): string {
  return value.replace(/(calc|min|max|clamp)\(.+\)/g, (match) => {
    let result = '';
    const lastChar = (): string => {
      const trimmed = result.trimEnd();
      return trimmed[trimmed.length - 1];
    };
    for (let i = 0; i < match.length; i++) {
      const peek = (word: string): boolean =>
        word.split('').every((char, j) => match[i + j] === char);
      const consumeUntil = (chars: string[]): string => {
        let minIndex = Infinity;
        for (const char of chars) {
          const index = match.indexOf(char, i);
          if (index !== -1 && index < minIndex) minIndex = index;
        }
        const consumed = match.slice(i, minIndex);
        i += consumed.length - 1;
        return consumed;
      };
      const char = match[i];
      if (peek('var')) {
        result += consumeUntil([')', ',']);
      } else if (PREVENT_FORMATTING_KEYWORDS.some(peek)) {
        const keyword = PREVENT_FORMATTING_KEYWORDS.find(peek)!;
        result += keyword;
        i += keyword.length - 1;
      } else if (peek('theme')) {
        result += consumeUntil([')']);
      } else if (peek('[')) {
        result += consumeUntil([']']);
      } else if (
        ['+', '-', '*', '/'].includes(char) &&
        !['(', '+', '-', '*', '/', ','].includes(lastChar())
      ) {
        result += ` ${char} `;
      } else {
        result += char;
      }
    }
    return result.replace(/\s+/g, ' ');
  });
}

/** A bracketed value as CSS. */
export function normalize(value: string, isRoot = true): string {
  if (value.startsWith('--')) return `var(${value})`;
  if (value.includes('url(')) {
    return value
      .split(/(url\(.*?\))/g)
      .filter(Boolean)
      .map((part) => (/^url\(.*?\)$/.test(part) ? part : normalize(part, false)))
      .join('');
  }
  let result = value
    .replace(/([^\\])_+/g, (full, before: string) => before + ' '.repeat(full.length - 1))
    .replace(/^_/g, ' ')
    .replace(/\\_/g, '_');
  if (isRoot) result = result.trim();
  return normalizeMathOperatorSpacing(result);
}

const isCSSFunction = (value: string): boolean =>
  ['min', 'max', 'clamp', 'calc'].some((fn) => new RegExp(`^${fn}\\(.*\\)`).test(value));

export const url = (value: string): boolean => value.startsWith('url(');

export const number = (value: string): boolean => !isNaN(Number(value)) || isCSSFunction(value);

export const percentage = (value: string): boolean =>
  (value.endsWith('%') && number(value.slice(0, -1))) || isCSSFunction(value);

const LENGTH_UNITS =
  'cm|mm|Q|in|pc|pt|px|em|ex|ch|rem|lh|rlh|vw|vh|vmin|vmax|vb|vi|svw|svh|lvw|lvh|dvw|dvh|cqw|cqh|cqi|cqb|cqmin|cqmax';
const LENGTH = new RegExp(`^[+-]?[0-9]*\\.?[0-9]+(?:[eE][+-]?[0-9]+)?(?:${LENGTH_UNITS})$`);

export const length = (value: string): boolean =>
  value === '0' || LENGTH.test(value) || isCSSFunction(value);

export const lineWidth = (value: string): boolean => ['thin', 'medium', 'thick'].includes(value);

export interface BoxShadow {
  raw: string;
  keyword?: string;
  x?: string;
  y?: string;
  blur?: string;
  spread?: string;
  color?: string;
  unknown?: string[];
  valid: boolean;
}

const SHADOW_KEYWORDS = new Set(['inset', 'inherit', 'initial', 'revert', 'unset']);

export function parseBoxShadowValue(input: string): BoxShadow[] {
  return splitAtTopLevelOnly(input, ',').map((shadow) => {
    const value = shadow.trim();
    const result: BoxShadow = { raw: value, valid: false };
    const seen = new Set<string>();
    for (const part of value.split(/ +(?![^(]*\))/g)) {
      if (!seen.has('KEYWORD') && SHADOW_KEYWORDS.has(part)) {
        result.keyword = part;
        seen.add('KEYWORD');
      } else if (/^-?(\d+|\.\d+)(.*?)$/.test(part)) {
        for (const slot of ['x', 'y', 'blur', 'spread'] as const) {
          if (!seen.has(slot)) {
            result[slot] = part;
            seen.add(slot);
            break;
          }
        }
      } else if (!result.color) {
        result.color = part;
      } else {
        (result.unknown ??= []).push(part);
      }
    }
    result.valid = result.x !== undefined && result.y !== undefined;
    return result;
  });
}

export const formatBoxShadowValue = (shadows: BoxShadow[]): string =>
  shadows
    .map((shadow) =>
      shadow.valid
        ? [shadow.keyword, shadow.x, shadow.y, shadow.blur, shadow.spread, shadow.color]
            .filter(Boolean)
            .join(' ')
        : shadow.raw,
    )
    .join(', ');

export const shadow = (value: string): boolean =>
  parseBoxShadowValue(normalize(value)).every((parsed) => parsed.valid);

export function color(value: string): boolean {
  let colors = 0;
  const valid = splitAtTopLevelOnly(value, '_').every((part) => {
    const normalized = normalize(part);
    if (normalized.startsWith('var(')) return true;
    if (parseColor(normalized, { loose: true }) !== null) {
      colors++;
      return true;
    }
    return false;
  });
  return valid && colors > 0;
}

const GRADIENTS = [
  'conic-gradient',
  'linear-gradient',
  'radial-gradient',
  'repeating-conic-gradient',
  'repeating-linear-gradient',
  'repeating-radial-gradient',
];

export const gradient = (value: string): boolean => {
  const normalized = normalize(value);
  return GRADIENTS.some((type) => normalized.startsWith(`${type}(`));
};

export function image(value: string): boolean {
  let images = 0;
  const valid = splitAtTopLevelOnly(value, ',').every((part) => {
    const normalized = normalize(part);
    if (normalized.startsWith('var(')) return true;
    if (
      url(normalized) ||
      gradient(normalized) ||
      ['element(', 'image(', 'cross-fade(', 'image-set('].some((fn) => normalized.startsWith(fn))
    ) {
      images++;
      return true;
    }
    return false;
  });
  return valid && images > 0;
}

export function position(value: string): boolean {
  let positions = 0;
  const valid = splitAtTopLevelOnly(value, '_').every((part) => {
    const normalized = normalize(part);
    if (normalized.startsWith('var(')) return true;
    if (
      ['center', 'top', 'right', 'bottom', 'left'].includes(normalized) ||
      length(normalized) ||
      percentage(normalized)
    ) {
      positions++;
      return true;
    }
    return false;
  });
  return valid && positions > 0;
}

export function familyName(value: string): boolean {
  let fonts = 0;
  const valid = splitAtTopLevelOnly(value, ',').every((part) => {
    const normalized = normalize(part);
    if (normalized.startsWith('var(')) return true;
    if (normalized.includes(' ') && !/(['"])([^"']+)\1/.test(normalized)) return false;
    if (/^\d/.test(normalized)) return false;
    fonts++;
    return true;
  });
  return valid && fonts > 0;
}

export const genericName = (value: string): boolean =>
  [
    'serif',
    'sans-serif',
    'monospace',
    'cursive',
    'fantasy',
    'system-ui',
    'ui-serif',
    'ui-sans-serif',
    'ui-monospace',
    'ui-rounded',
    'math',
    'emoji',
    'fangsong',
  ].includes(value);

export const absoluteSize = (value: string): boolean =>
  ['xx-small', 'x-small', 'small', 'medium', 'large', 'x-large', 'xxx-large'].includes(value);

export const relativeSize = (value: string): boolean => ['larger', 'smaller'].includes(value);

/** background-size: `[ <length-percentage> | auto ]{1,2} | cover | contain`, comma-separated */
export const backgroundSize = (value: string): boolean =>
  splitAtTopLevelOnly(value, ',').every((part) => {
    const sizes = splitAtTopLevelOnly(part, '_').filter(Boolean);
    if (sizes.length === 1 && ['cover', 'contain'].includes(sizes[0])) return true;
    if (sizes.length !== 1 && sizes.length !== 2) return false;
    return sizes.every((size) => length(size) || percentage(size) || size === 'auto');
  });

/** `-` before a value, as Tailwind negates: `-4px`, `calc(var(--x) * -1)`; undefined if it cannot. */
export function negateValue(input: string | number): string | undefined {
  const value = String(input);
  if (value === '0') return '0';
  if (/^[+-]?(\d+|\d*\.\d+)(e[+-]?\d+)?(%|\w+)?$/.test(value)) {
    return value.replace(/^[+-]?/, (sign) => (sign === '-' ? '' : '-'));
  }
  if (['var', 'calc', 'min', 'max', 'clamp'].some((fn) => value.includes(`${fn}(`))) {
    return `calc(${value} * -1)`;
  }
  return undefined;
}
