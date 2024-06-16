import { size } from '~tokens/global';

// we have to set some max-width for width animations to work correctly while tags are disappearing
// https://stackoverflow.com/a/38643863
export const TAG_MAX_WIDTH_START: `${number}%` = '100%';
export const TAG_MAX_WIDTH_END: `${number}%` = '0%';
export const TAG_MAX_HEIGHT_END: number = size['0'];
export const TAG_OPACITY_START = 1;
export const TAG_OPACITY_END = 0;
