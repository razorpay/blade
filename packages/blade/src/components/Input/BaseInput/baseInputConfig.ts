import { size, spacing } from '~tokens/global';

const BASEINPUT_BOTTOM_LINE_HEIGHT: number = size['1'];
export const BASEINPUT_MAX_ROWS = 4;

export const TAG_HEIGHT = size['20'];
export const TAG_GAP = spacing['3'];

/**
 * 36px
 */
export const BASEINPUT_DEFAULT_HEIGHT: number = size['36'];

/**
 * 37px (36px height + 1px bottom line height)
 */
export const BASEINPUT_WRAPPER_MIN_HEIGHT = BASEINPUT_DEFAULT_HEIGHT + BASEINPUT_BOTTOM_LINE_HEIGHT;

/**
 * 145px (36px height * 4 rows + 1px bottom line height)
 */
export const BASEINPUT_WRAPPER_MAX_HEIGHT =
  size['36'] * BASEINPUT_MAX_ROWS + BASEINPUT_BOTTOM_LINE_HEIGHT; // we don't want exact number but rough number to be able to animate correctly in height.
