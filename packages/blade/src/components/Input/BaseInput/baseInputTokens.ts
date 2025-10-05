import type { BaseInputProps } from './BaseInput';
import { size, spacing } from '~tokens/global';

export const BASEINPUT_MAX_ROWS = 4;

export const TAG_HEIGHT = size['20'];
export const TAG_GAP = spacing['3'];

/**
 * 36px
 */
export const baseInputHeight: Record<
  NonNullable<BaseInputProps['size']>,
  typeof size[keyof typeof size]
> = {
  xsmall: size['26'],
  medium: size['36'],
  large: size['48'],
};

/**
 * medium - 144px (36px height * 4 rows)
 * large - 192px (48px height * 4 rows)
 */
// we don't want exact number but rough number to be able to animate correctly in height.
export const baseInputWrapperMaxHeight = {
  xsmall: baseInputHeight.xsmall * BASEINPUT_MAX_ROWS,
  medium: baseInputHeight.medium * BASEINPUT_MAX_ROWS,
  large: baseInputHeight.large * BASEINPUT_MAX_ROWS,
} as const;

export const baseInputBorderColor = {
  default: 'interactive.border.gray.default',
  hovered: 'interactive.border.gray.highlighted',
  focused: 'interactive.border.primary.default',
  disabled: 'interactive.border.gray.disabled',
  error: 'interactive.border.negative.default',
  success: 'interactive.border.positive.default',
} as const;

export const baseInputBackgroundColor = {
  default: 'surface.background.gray.intense',
  hovered: 'surface.background.gray.moderate',
  focused: 'surface.background.gray.moderate',
  disabled: 'surface.background.gray.subtle',
  error: 'surface.background.gray.intense',
  success: 'surface.background.gray.intense',
} as const;

export const baseInputBorderlessBackgroundColor = {
  default: 'transparent',
  hovered: 'surface.background.gray.moderate',
  focused: 'surface.background.gray.moderate',
  disabled: 'surface.background.gray.intense',
  error: 'feedback.background.negative.subtle',
  success: 'feedback.background.positive.subtle',
} as const;

export const baseInputBorderWidth = {
  default: 'thin',
  hovered: 'thin',
  disabled: 'thin',
  focused: 'thick',
  error: 'thick',
  success: 'thick',
} as const;

export const baseInputBorderBackgroundMotion = {
  enter: { duration: 'xgentle', easing: 'emphasized' },
  exit: { duration: 'gentle', easing: 'standard' },
} as const;

export const baseInputPaddingTokens = {
  top: {
    xsmall: 2,
    medium: 3,
    large: 4,
  },
  bottom: {
    xsmall: 2,
    medium: 3,
    large: 4,
  },
  left: {
    xsmall: 3,
    medium: 4,
    large: 4,
  },
  right: {
    xsmall: 3,
    medium: 4,
    large: 4,
  },
} as const;

/* the magic number 192 is basically max-width of label 
i.e 176 and then right margin 
i.e 16 which is the spacing between label and input field */
export const formHintLeftLabelMarginLeft = {
  xsmall: 136,
  medium: 136,
  large: 192,
} as const;

export const baseInputCounterInputPaddingTokens = {
  top: {
    xsmall: 2,
    medium: 2,
    large: 2,
  },
  bottom: {
    xsmall: 2,
    medium: 2,
    large: 2,
  },
  left: {
    xsmall: 2,
    medium: 2,
    large: 2,
  },
  right: {
    xsmall: 2,
    medium: 2,
    large: 2,
  },
} as const;
