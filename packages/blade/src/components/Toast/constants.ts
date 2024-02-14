import { size } from '~tokens/global';

export const TOAST_MAX_WIDTH = size['360'];
// higher than modal
export const TOAST_Z_INDEX = 2000;

// Space between the toasts
export const GUTTER = 12;
// Space between the collapsed toast's peek
export const PEEK_GUTTER = 12;
// How much to scale down the peeking toasts
export const SCALE_FACTOR = 0.05;
// While collapsed, how many toasts to show
export const MAX_TOASTS = 1;
// While collapsed, how many toasts should be peeking
export const PEEKS = 3;
