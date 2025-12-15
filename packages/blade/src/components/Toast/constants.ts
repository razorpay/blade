import { size } from '~tokens/global';

export const TOAST_MAX_WIDTH = size['360'];
// higher than modal
export const TOAST_Z_INDEX = 2001;

// Space between the toasts
export const GUTTER = 12;
// Space between the collapsed toast's peek
export const PEEK_GUTTER = 12;
// Gap between the toast container and the page body
export const CONTAINER_GUTTER_MOBILE = 16;
export const CONTAINER_GUTTER_DESKTOP = 24;
// How much to scale down the peeking toasts
export const SCALE_FACTOR = 0.05;
// While collapsed, how many toasts to show
export const MAX_TOASTS = 1;
// Minimum toasts to show on mobile and desktop
export const MIN_TOAST_MOBILE = 1;
export const MIN_TOAST_DESKTOP = 3;
// While collapsed, how many toasts should be peeking
export const PEEKS = 3;
