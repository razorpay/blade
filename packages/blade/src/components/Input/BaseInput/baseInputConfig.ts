import type { BaseInputProps } from './BaseInput';
import { size, spacing } from '~tokens/global';

const BASEINPUT_BOTTOM_LINE_HEIGHT: number = size['1'];
export const BASEINPUT_MAX_ROWS = 4;

export const TAG_HEIGHT = size['20'];
export const TAG_GAP = spacing['3'];

/**
 * 36px
 */
export const baseInputHeight: Record<NonNullable<BaseInputProps['size']>, number> = {
  medium: size['36'],
  large: size['48'],
} as const;

/**
 * 37px (36px height + 1px bottom line height)
 */
export const baseInputWrapperMinHeight = {
  medium: baseInputHeight.medium + BASEINPUT_BOTTOM_LINE_HEIGHT,
  large: baseInputHeight.large + BASEINPUT_BOTTOM_LINE_HEIGHT,
};

/**
 * 145px (36px height * 4 rows + 1px bottom line height)
 */
export const BASEINPUT_WRAPPER_MAX_HEIGHT =
  size['36'] * BASEINPUT_MAX_ROWS + BASEINPUT_BOTTOM_LINE_HEIGHT; // we don't want exact number but rough number to be able to animate correctly in height.

export const baseInputWrapperMaxHeight = {
  medium: baseInputHeight.medium * BASEINPUT_MAX_ROWS + BASEINPUT_BOTTOM_LINE_HEIGHT,
  large: baseInputHeight.large * BASEINPUT_MAX_ROWS + BASEINPUT_BOTTOM_LINE_HEIGHT,
} as const;
