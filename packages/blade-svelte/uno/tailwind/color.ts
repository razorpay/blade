/**
 * Tailwind v3's colour model (src/util/color.js, withAlphaVariable.js): a
 * colour it can read is written as `rgb(r g b / <alpha>)`, so an opacity
 * class (`bg-opacity-50`) or modifier (`/50`) can set its alpha; one it
 * cannot read (a `var()`, `currentColor`) is written as is.
 */
import { colorNames } from './color-names';

export interface ParsedColor {
  mode: string;
  color: string[];
  alpha?: string;
}

const HEX = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i;
const SHORT_HEX = /^#([a-f\d])([a-f\d])([a-f\d])([a-f\d])?$/i;
const VALUE = /(?:\d+|\d*\.\d+)%?/;
const SEP = /(?:\s*,\s*|\s+)/;
const ALPHA_SEP = /\s*[,/]\s*/;
const CUSTOM_PROPERTY = /var\(--(?:[^ )]*?)(?:,(?:[^ )]*?|var\(--[^ )]*?\)))?\)/;
const CHANNEL = `(${VALUE.source}|${CUSTOM_PROPERTY.source})`;
const RGB = new RegExp(
  `^(rgba?)\\(\\s*${CHANNEL}(?:${SEP.source}${CHANNEL})?(?:${SEP.source}${CHANNEL})?(?:${ALPHA_SEP.source}${CHANNEL})?\\s*\\)$`,
);
const HSL = new RegExp(
  `^(hsla?)\\(\\s*((?:${VALUE.source})(?:deg|rad|grad|turn)?|${CUSTOM_PROPERTY.source})(?:${SEP.source}${CHANNEL})?(?:${SEP.source}${CHANNEL})?(?:${ALPHA_SEP.source}${CHANNEL})?\\s*\\)$`,
);

export function parseColor(input: unknown, { loose = false } = {}): ParsedColor | null {
  if (typeof input !== 'string') return null;
  const value = input.trim();
  if (value === 'transparent') return { mode: 'rgb', color: ['0', '0', '0'], alpha: '0' };
  if (value in colorNames) {
    return { mode: 'rgb', color: colorNames[value].map(String) };
  }
  const hex = value
    .replace(SHORT_HEX, (_, r, g, b, a) => ['#', r, r, g, g, b, b, a ? a + a : ''].join(''))
    .match(HEX);
  if (hex) {
    return {
      mode: 'rgb',
      color: [hex[1], hex[2], hex[3]].map((channel) => String(parseInt(channel, 16))),
      alpha: hex[4] ? String(parseInt(hex[4], 16) / 255) : undefined,
    };
  }
  const match = value.match(RGB) ?? value.match(HSL);
  if (!match) return null;
  const color = [match[2], match[3], match[4]].filter(Boolean).map(String);
  // rgba(var(--my-color), 0.1)
  if (color.length === 2 && color[0].startsWith('var(')) {
    return { mode: match[1], color: [color[0]], alpha: color[1] };
  }
  if (!loose && color.length !== 3) return null;
  if (color.length < 3 && !color.some((part) => /^var\(.*?\)$/.test(part))) return null;
  return { mode: match[1], color, alpha: match[5]?.toString() };
}

export function formatColor({ mode, color, alpha }: ParsedColor): string {
  const hasAlpha = alpha !== undefined;
  if (mode === 'rgba' || mode === 'hsla') {
    return `${mode}(${color.join(', ')}${hasAlpha ? `, ${alpha}` : ''})`;
  }
  return `${mode}(${color.join(' ')}${hasAlpha ? ` / ${alpha}` : ''})`;
}

/** A theme colour: a string, or `<alpha-value>` to fill. */
export type Color = string;

const hasAlphaSlot = (color: Color): boolean => color.includes('<alpha-value>');

/** The colour at a fixed alpha (`/50`), or `fallback` if it cannot take one. */
export function withAlphaValue(color: Color, alpha: string, fallback?: string): string | undefined {
  if (hasAlphaSlot(color)) return color.replace('<alpha-value>', alpha);
  const parsed = parseColor(color, { loose: true });
  if (!parsed) return fallback;
  return formatColor({ ...parsed, alpha });
}

/**
 * The colour bound to an opacity variable (`--tw-bg-opacity`): the variable
 * at 1, the property reading it. A colour with an alpha of its own, or one
 * that cannot be read, is set as is.
 */
export function withAlphaVariable(
  color: Color,
  properties: string | string[],
  variable: string,
): Record<string, string> {
  const props = ([] as string[]).concat(properties);
  if (hasAlphaSlot(color)) {
    return {
      [variable]: '1',
      ...Object.fromEntries(
        props.map((p) => [p, color.replace('<alpha-value>', `var(${variable})`)]),
      ),
    };
  }
  const parsed = parseColor(color);
  if (!parsed || parsed.alpha !== undefined) {
    return Object.fromEntries(props.map((p) => [p, color]));
  }
  return {
    [variable]: '1',
    ...Object.fromEntries(
      props.map((p) => [p, formatColor({ ...parsed, alpha: `var(${variable})` })]),
    ),
  };
}

/** A theme colour where no opacity applies: `<alpha-value>` at 1. */
export const toColorValue = (color: Color): string =>
  hasAlphaSlot(color) ? color.replace('<alpha-value>', '1') : color;
