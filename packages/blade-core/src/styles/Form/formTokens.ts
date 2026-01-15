/**
 * Form Design Tokens
 * Matches packages/blade/src/components/Form/formTokens.ts
 */

/**
 * Label text sizes based on position and input size
 */
export const labelTextSize = {
  top: {
    xsmall: 'small',
    small: 'small',
    medium: 'small',
    large: 'medium',
  },
  left: {
    xsmall: 'small',
    small: 'small',
    medium: 'medium',
    large: 'large',
  },
} as const;

/**
 * Optional indicator text size
 */
export const labelOptionalIndicatorTextSize = {
  xsmall: 'small',
  small: 'small',
  medium: 'small',
  large: 'medium',
} as const;

/**
 * Hint text sizes
 */
export const hintTextSize = {
  xsmall: 'small',
  small: 'small',
  medium: 'small',
  large: 'medium',
} as const;

/**
 * Hint icon sizes
 */
export const hintIconSize = {
  xsmall: 'small',
  small: 'small',
  medium: 'small',
  large: 'medium',
} as const;

/**
 * Hint margin top
 */
export const hintMarginTop = {
  xsmall: 'spacing.2',
  small: 'spacing.2',
  medium: 'spacing.2',
  large: 'spacing.3',
} as const;

/**
 * Label margin bottom
 */
export const labelMarginBottom = {
  xsmall: 'spacing.2',
  small: 'spacing.2',
  medium: 'spacing.2',
  large: 'spacing.3',
} as const;

/**
 * Label width for left-positioned labels
 */
export const labelWidth = {
  xsmall: 120,
  small: 120,
  medium: 120,
  large: 176,
} as const;

/**
 * Label right margin for left-positioned labels
 */
export const labelLeftMarginRight = {
  xsmall: 'spacing.3',
  small: 'spacing.3',
  medium: 'spacing.4',
  large: 'spacing.5',
} as const;

export type FormSize = 'xsmall' | 'small' | 'medium' | 'large';
export type LabelPosition = 'top' | 'left';
export type NecessityIndicator = 'required' | 'optional' | 'none';
export type ValidationState = 'none' | 'error' | 'success';

