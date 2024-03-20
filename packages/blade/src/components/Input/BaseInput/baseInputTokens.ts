import type { BaseInputProps } from './BaseInput';
import { size, spacing } from '~tokens/global';

const BASEINPUT_BOTTOM_LINE_HEIGHT: number = size['1'];
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
  medium: size['36'],
  large: size['48'],
};

/**
 * 37px (36px height + 1px bottom line height)
 */
export const baseInputWrapperMinHeight = {
  medium: (baseInputHeight.medium as number) + BASEINPUT_BOTTOM_LINE_HEIGHT,
  large: (baseInputHeight.large as number) + BASEINPUT_BOTTOM_LINE_HEIGHT,
};

// TODO: Replace the usage of this with `baseInputWrapperMinHeight[size]` when working on SelectInput
export const BASEINPUT_WRAPPER_MIN_HEIGHT =
  (baseInputHeight.medium as number) + BASEINPUT_BOTTOM_LINE_HEIGHT;

/**
 * 145px (36px height * 4 rows + 1px bottom line height)
 */
export const BASEINPUT_WRAPPER_MAX_HEIGHT =
  size['36'] * BASEINPUT_MAX_ROWS + BASEINPUT_BOTTOM_LINE_HEIGHT; // we don't want exact number but rough number to be able to animate correctly in height.

export const baseInputWrapperMaxHeight = {
  medium: baseInputHeight.medium * BASEINPUT_MAX_ROWS + BASEINPUT_BOTTOM_LINE_HEIGHT,
  large: baseInputHeight.large * BASEINPUT_MAX_ROWS + BASEINPUT_BOTTOM_LINE_HEIGHT,
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
  disabled: 'surface.background.gray.intense',
  error: 'surface.background.gray.intense',
  success: 'surface.background.gray.intense',
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
  enter: { duration: 'xgentle', easing: 'standard.revealing' },
  exit: { duration: 'gentle', easing: 'standard.effective' },
} as const;

export const baseInputPaddingTokens = {
  top: {
    medium: 3,
    large: 4,
  },
  bottom: {
    medium: 3,
    large: 4,
  },
  left: {
    medium: 4,
    large: 4,
  },
  right: {
    medium: 4,
    large: 4,
  },
} as const;

/* the magic number 192 is basically max-width of label 
i.e 176 and then right margin 
i.e 16 which is the spacing between label and input field */
export const formHintLeftLabelMarginLeft = {
  medium: 136,
  large: 192,
} as const;
