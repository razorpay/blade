import { tokenToCSSVariable } from '../tokenToCSSVariable';
import type { Border, Elevation } from '~tokens/global';
import type { Typography } from '~tokens/global/typography';
import type { Colors as ThemeColors } from '~tokens/theme';

/**
 * Resolved (mode-flattened) theme slice used to emit CSS custom properties.
 * Matches the runtime `Theme` shape consumed by BladeProvider.
 */
export type ThemeCssVariableSource = {
  colors: ThemeColors;
  elevation: Elevation;
  border: Border;
  typography?: Typography;
};

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/**
 * CSS theme generator drops the redundant `on` prefix on leaf keys like
 * `onSubtle` / `onIntense` when nested under `onSea` / `onCloud`.
 * e.g. surface.text.onSea.onSubtle → --surface-text-on-sea-subtle
 */
const normalizePathSegment = (segment: string, parentSegment?: string): string => {
  if (
    parentSegment &&
    /^on[A-Z]/.test(parentSegment) &&
    (segment === 'onSubtle' || segment === 'onIntense')
  ) {
    return segment === 'onSubtle' ? 'subtle' : 'intense';
  }
  return segment;
};

const flattenTokenTree = (value: unknown, path: string[], result: Record<string, string>): void => {
  if (typeof value === 'string' || typeof value === 'number') {
    const cssVar = tokenToCSSVariable(path.join('.'));
    result[cssVar] = String(value);
    return;
  }

  if (!isPlainObject(value)) {
    return;
  }

  const parentSegment = path[path.length - 1];
  for (const [key, child] of Object.entries(value)) {
    const normalizedKey = normalizePathSegment(key, parentSegment);
    flattenTokenTree(child, [...path, normalizedKey], result);
  }
};

const borderValueToCss = (value: number | string): string => {
  if (typeof value === 'string') {
    return value;
  }
  return `${value}px`;
};

const typographyValueToCss = (
  group: 'fontSize' | 'lineHeight' | 'fontWeight',
  value: number,
): string => {
  if (group === 'fontWeight') {
    return String(value);
  }
  return `${value}px`;
};

/**
 * Resolved platform typography → CSS vars matching `theme.css` (`--font-size-*`, etc.).
 */
export const typographyToCssVariables = (typography: Typography): Record<string, string> => {
  const cssVariables: Record<string, string> = {};

  for (const [key, value] of Object.entries(typography.fonts.family)) {
    cssVariables[tokenToCSSVariable(`fontFamily.${key}`)] = value;
  }

  for (const [key, value] of Object.entries(typography.fonts.size)) {
    cssVariables[tokenToCSSVariable(`fontSize.${key}`)] = typographyValueToCss('fontSize', value);
  }

  for (const [key, value] of Object.entries(typography.fonts.weight)) {
    cssVariables[tokenToCSSVariable(`fontWeight.${key}`)] = typographyValueToCss(
      'fontWeight',
      value,
    );
  }

  for (const [key, value] of Object.entries(typography.lineHeights)) {
    cssVariables[tokenToCSSVariable(`lineHeight.${key}`)] = typographyValueToCss(
      'lineHeight',
      value,
    );
  }

  for (const [key, value] of Object.entries(typography.letterSpacings)) {
    cssVariables[tokenToCSSVariable(`letterSpacing.${key}`)] = `${value}%`;
  }

  return cssVariables;
};

/**
 * Convert a resolved theme slice into CSS custom property declarations.
 * Keys match `@razorpay/blade-core/tokens/theme.css` (e.g. `--surface-background-gray-subtle`).
 */
export const themeToCssVariables = (theme: ThemeCssVariableSource): Record<string, string> => {
  const cssVariables: Record<string, string> = {};

  flattenTokenTree(theme.colors, [], cssVariables);
  flattenTokenTree(theme.elevation, ['elevation'], cssVariables);

  for (const [key, value] of Object.entries(theme.border.radius)) {
    cssVariables[tokenToCSSVariable(`border.radius.${key}`)] = borderValueToCss(value);
  }

  for (const [key, value] of Object.entries(theme.border.width)) {
    cssVariables[tokenToCSSVariable(`border.width.${key}`)] = borderValueToCss(value);
  }

  if (theme.typography) {
    Object.assign(cssVariables, typographyToCssVariables(theme.typography));
  }

  return cssVariables;
};

/**
 * Serialize CSS variable map to an inline style string for DOM `style` attributes.
 */
export const cssVariablesToInlineStyle = (cssVariables: Record<string, string>): string => {
  return Object.entries(cssVariables)
    .map(([name, value]) => `${name}:${value}`)
    .join(';');
};
