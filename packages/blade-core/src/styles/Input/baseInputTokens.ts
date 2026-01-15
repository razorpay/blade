/**
 * BaseInput Design Tokens
 * Matches packages/blade/src/components/Input/BaseInput/baseInputTokens.ts
 */

export const BASEINPUT_MAX_ROWS = 4;

export const TAG_HEIGHT = 20;
export const TAG_GAP = 8; // spacing.3

/**
 * Input heights for different sizes
 */
export const baseInputHeight = {
  xsmall: 26,
  small: 30,
  medium: 36,
  large: 48,
} as const;

/**
 * Max height for inputs with multiple rows/tags
 */
export const baseInputWrapperMaxHeight = {
  xsmall: baseInputHeight.xsmall * BASEINPUT_MAX_ROWS,
  small: baseInputHeight.small * BASEINPUT_MAX_ROWS,
  medium: baseInputHeight.medium * BASEINPUT_MAX_ROWS,
  large: baseInputHeight.large * BASEINPUT_MAX_ROWS,
} as const;

/**
 * Border colors for different states
 */
export const baseInputBorderColor = {
  default: 'interactive.border.gray.default',
  hover: 'interactive.border.gray.highlighted',
  focus: 'interactive.border.primary.default',
  disabled: 'interactive.border.gray.disabled',
  error: 'interactive.border.negative.default',
  success: 'interactive.border.positive.default',
} as const;

/**
 * Background colors for different states
 */
export const baseInputBackgroundColor = {
  default: 'surface.background.gray.intense',
  hover: 'surface.background.gray.moderate',
  focus: 'surface.background.gray.moderate',
  disabled: 'surface.background.gray.subtle',
  error: 'surface.background.gray.intense',
  success: 'surface.background.gray.intense',
} as const;

/**
 * Border width tokens for different states
 */
export const baseInputBorderWidth = {
  default: 'thin',
  hover: 'thin',
  disabled: 'thin',
  focus: 'thick',
  error: 'thick',
  success: 'thick',
} as const;

/**
 * Padding tokens for input content
 */
export const baseInputPaddingTokens = {
  top: {
    xsmall: 2,
    small: 2,
    medium: 3,
    large: 4,
  },
  bottom: {
    xsmall: 2,
    small: 2,
    medium: 3,
    large: 4,
  },
  left: {
    xsmall: 3,
    small: 3,
    medium: 4,
    large: 4,
  },
  right: {
    xsmall: 3,
    small: 3,
    medium: 4,
    large: 4,
  },
} as const;

/**
 * Icon sizes for different input sizes
 */
export const baseInputIconSize = {
  xsmall: 'small',
  small: 'small',
  medium: 'medium',
  large: 'large',
} as const;

/**
 * Text sizes for prefix/suffix
 */
export const baseInputTextSize = {
  xsmall: 'small',
  small: 'small',
  medium: 'medium',
  large: 'large',
} as const;

/**
 * Motion tokens for border/background transitions
 */
export const baseInputBorderBackgroundMotion = {
  enter: { duration: 'xgentle', easing: 'emphasized' },
  exit: { duration: 'gentle', easing: 'standard' },
} as const;

/**
 * Left label margin for hint alignment
 */
export const formHintLeftLabelMarginLeft = {
  xsmall: 136,
  small: 136,
  medium: 136,
  large: 192,
} as const;

export type BaseInputSize = keyof typeof baseInputHeight;
export type BaseInputState = 'default' | 'hover' | 'focus' | 'disabled' | 'error' | 'success';

