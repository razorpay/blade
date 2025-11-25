import {
  getTokenCSSVariable,
  makeTypographySize,
  makeLetterSpacing,
} from '@razorpay/blade-core/utils';
import { cva } from 'class-variance-authority';
import type {
  StyledBaseTextProps,
  FontSizeVariant,
  LineHeightVariant,
  FontWeightVariant,
  FontFamilyVariant,
} from './types';

// Typography token values from CSS variables (in pixels for calculations)
// TODO: These should ideally come from theme structure, but since we're using CSS variables,
// we need these mappings for calculations. Consider moving to theme tokens or CSS variable values.
const TYPOGRAPHY_TOKENS = {
  fontSize: {
    25: 10,
    50: 11,
    75: 12,
    100: 14,
    200: 16,
    300: 18,
    400: 20,
    500: 24,
    600: 32,
    700: 40,
    800: 48,
    900: 56,
    1000: 64,
    1100: 72,
  },
  lineHeight: {
    0: 0,
    25: 14,
    50: 16,
    75: 18,
    100: 20,
    200: 24,
    300: 24,
    400: 26,
    500: 32,
    600: 38,
    700: 46,
    800: 56,
    900: 64,
    1000: 70,
    1100: 78,
  },
  letterSpacing: {
    50: -1,
    100: 0,
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const;

/**
 * Get CSS variable value reference for color tokens
 * Example: 'surface.text.gray.normal' -> 'var(--surface-text-gray-normal)'
 * Handles 'currentColor' special case
 */
export function getColorCSSVariable(color: string): string {
  if (color === 'currentColor') {
    return 'currentColor';
  }
  return getTokenCSSVariable(color);
}

/**
 * Get font family CSS variable
 */
export function getFontFamilyCSSVariable(fontFamily: string | number | symbol = 'text'): string {
  return `var(--font-family-${String(fontFamily)})`;
}

/**
 * Get font size CSS variable or calculated rem value
 */
export function getFontSizeCSSVariable(fontSize: string | number | symbol = 200): string {
  const fontSizeNum = typeof fontSize === 'number' ? fontSize : Number(fontSize);
  const sizeInPx =
    TYPOGRAPHY_TOKENS.fontSize[fontSizeNum as keyof typeof TYPOGRAPHY_TOKENS.fontSize];
  if (sizeInPx === undefined) {
    // Fallback to direct rem calculation if token not found
    return makeTypographySize(fontSizeNum);
  }
  return makeTypographySize(sizeInPx);
}

/**
 * Get font weight CSS variable
 */
export function getFontWeightCSSVariable(fontWeight: string | number | symbol = 'regular'): string {
  return `var(--font-weight-${String(fontWeight)})`;
}

/**
 * Get line height CSS variable or calculated rem value
 */
export function getLineHeightCSSVariable(lineHeight: string | number | symbol = 100): string {
  const lineHeightNum = typeof lineHeight === 'number' ? lineHeight : Number(lineHeight);
  const heightInPx =
    TYPOGRAPHY_TOKENS.lineHeight[lineHeightNum as keyof typeof TYPOGRAPHY_TOKENS.lineHeight];
  if (heightInPx === undefined) {
    // Fallback to direct rem calculation if token not found
    return makeTypographySize(lineHeightNum);
  }
  return makeTypographySize(heightInPx);
}

/**
 * Get letter spacing CSS variable or calculated px value
 */
export function getLetterSpacingCSSVariable(
  letterSpacing: string | number | symbol = 100,
  fontSize: string | number | symbol = 200,
): string {
  const letterSpacingNum =
    typeof letterSpacing === 'number' ? letterSpacing : Number(letterSpacing);
  const fontSizeNum = typeof fontSize === 'number' ? fontSize : Number(fontSize);
  const spacingPercent =
    TYPOGRAPHY_TOKENS.letterSpacing[
      letterSpacingNum as keyof typeof TYPOGRAPHY_TOKENS.letterSpacing
    ];
  const fontSizeInPx =
    TYPOGRAPHY_TOKENS.fontSize[fontSizeNum as keyof typeof TYPOGRAPHY_TOKENS.fontSize] ||
    fontSizeNum;

  if (spacingPercent === undefined) {
    // Fallback calculation
    return makeLetterSpacing(0, fontSizeInPx);
  }

  // Calculate px from percentage
  return makeLetterSpacing(spacingPercent, fontSizeInPx);
}

/**
 * CVA definition for BaseText variant classes
 * These use CSS variables for theme tokens, providing better performance than inline styles
 */
export const baseTextClass = cva('base-text', {
  variants: {
    fontSize: {
      25: 'base-text--font-size-25',
      50: 'base-text--font-size-50',
      75: 'base-text--font-size-75',
      100: 'base-text--font-size-100',
      200: 'base-text--font-size-200',
      300: 'base-text--font-size-300',
      400: 'base-text--font-size-400',
      500: 'base-text--font-size-500',
      600: 'base-text--font-size-600',
      700: 'base-text--font-size-700',
      800: 'base-text--font-size-800',
      900: 'base-text--font-size-900',
      1000: 'base-text--font-size-1000',
      1100: 'base-text--font-size-1100',
    },
    lineHeight: {
      0: 'base-text--line-height-0',
      25: 'base-text--line-height-25',
      50: 'base-text--line-height-50',
      75: 'base-text--line-height-75',
      100: 'base-text--line-height-100',
      200: 'base-text--line-height-200',
      300: 'base-text--line-height-300',
      400: 'base-text--line-height-400',
      500: 'base-text--line-height-500',
      600: 'base-text--line-height-600',
      700: 'base-text--line-height-700',
      800: 'base-text--line-height-800',
      900: 'base-text--line-height-900',
      1000: 'base-text--line-height-1000',
      1100: 'base-text--line-height-1100',
    },
    fontWeight: {
      regular: 'base-text--font-weight-regular',
      medium: 'base-text--font-weight-medium',
      semibold: 'base-text--font-weight-semibold',
      bold: 'base-text--font-weight-bold',
    },
    fontFamily: {
      text: 'base-text--font-family-text',
    },
    fontStyle: {
      normal: 'base-text--font-style-normal',
      italic: 'base-text--font-style-italic',
    },
    textDecorationLine: {
      none: 'base-text--text-decoration-none',
      underline: 'base-text--text-decoration-underline',
      'line-through': 'base-text--text-decoration-line-through',
    },
    textAlign: {
      left: 'base-text--text-align-left',
      center: 'base-text--text-align-center',
      right: 'base-text--text-align-right',
      justify: 'base-text--text-align-justify',
    },
    textTransform: {
      none: 'base-text--text-transform-none',
      capitalize: 'base-text--text-transform-capitalize',
      uppercase: 'base-text--text-transform-uppercase',
      lowercase: 'base-text--text-transform-lowercase',
      'full-width': 'base-text--text-transform-full-width',
      'full-size-kana': 'base-text--text-transform-full-size-kana',
    },
    wordBreak: {
      normal: 'base-text--word-break-normal',
      'break-all': 'base-text--word-break-break-all',
      'keep-all': 'base-text--word-break-keep-all',
      'break-word': 'base-text--word-break-break-word',
    },
  },
  defaultVariants: {
    fontSize: 200,
    lineHeight: 100,
    fontWeight: 'regular',
    fontFamily: 'text',
    fontStyle: 'normal',
    textDecorationLine: 'none',
  },
});

/**
 * Generate class names for BaseText variants
 * Uses classes for discrete theme token values (fontSize, lineHeight, fontWeight, etc.)
 */
export function getBaseTextClassNames(
  props: Pick<
    StyledBaseTextProps,
    | 'fontSize'
    | 'lineHeight'
    | 'fontWeight'
    | 'fontFamily'
    | 'fontStyle'
    | 'textDecorationLine'
    | 'textAlign'
    | 'textTransform'
    | 'wordBreak'
  >,
): string {
  // Convert fontSize and lineHeight to numbers if they're strings/symbols
  const fontSizeNum =
    typeof props.fontSize === 'number'
      ? props.fontSize
      : typeof props.fontSize === 'string'
      ? Number(props.fontSize)
      : undefined;
  const lineHeightNum =
    typeof props.lineHeight === 'number'
      ? props.lineHeight
      : typeof props.lineHeight === 'string'
      ? Number(props.lineHeight)
      : undefined;

  // Convert fontWeight and fontFamily to strings
  const fontWeightStr =
    typeof props.fontWeight === 'string' ? props.fontWeight : String(props.fontWeight);
  const fontFamilyStr =
    typeof props.fontFamily === 'string' ? props.fontFamily : String(props.fontFamily);

  return baseTextClass({
    fontSize: fontSizeNum as FontSizeVariant,
    lineHeight: lineHeightNum as LineHeightVariant,
    fontWeight: fontWeightStr as FontWeightVariant,
    fontFamily: (fontFamilyStr === 'text' ? 'text' : undefined) as FontFamilyVariant,
    fontStyle: props.fontStyle,
    textDecorationLine: props.textDecorationLine,
    textAlign: props.textAlign,
    textTransform: props.textTransform,
    wordBreak: props.wordBreak,
  });
}

/**
 * Generate inline styles for BaseText dynamic/calculated values
 * These are used for:
 * - Color (many possible token paths, uses CSS variables)
 * - Letter spacing (calculated based on fontSize)
 * - Opacity (any number, not discrete)
 * - Number of lines (any number, requires multiple CSS properties)
 * - Text decoration color (depends on color prop)
 */
export function getBaseTextStyles(props: StyledBaseTextProps): string {
  const {
    color = 'surface.text.gray.normal',
    textDecorationLine = 'none',
    numberOfLines,
    letterSpacing = 100,
    fontSize = 200,
    opacity,
  } = props;

  const styles: string[] = [];

  styles.push(`color: ${getColorCSSVariable(color)}`);

  if (textDecorationLine !== 'none') {
    styles.push(`text-decoration-color: ${getColorCSSVariable(color)}`);
  }

  styles.push(`letter-spacing: ${getLetterSpacingCSSVariable(letterSpacing, fontSize)}`);

  if (opacity !== undefined) {
    styles.push(`opacity: ${opacity}`);
  }

  if (numberOfLines !== undefined) {
    styles.push('overflow: hidden');
    styles.push('display: -webkit-box');
    styles.push(`-webkit-line-clamp: ${numberOfLines}`);
    styles.push('-webkit-box-orient: vertical');
    styles.push('overflow-wrap: break-word');
  }

  return styles.join('; ');
}
