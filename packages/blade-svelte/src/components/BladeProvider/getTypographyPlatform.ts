import type { Breakpoints, TypographyPlatforms } from '@razorpay/blade-core/tokens';
import { isBrowser } from '@razorpay/blade-core/utils';

/**
 * Match device type for typography platform selection.
 * Mirrors React blade `useBreakpoint` desktop/mobile split at `breakpoints.m`.
 */
export const getTypographyPlatform = (
  breakpoints: Breakpoints,
  width: number = isBrowser() ? window.innerWidth : breakpoints.m,
): TypographyPlatforms => {
  return width < breakpoints.m ? 'onMobile' : 'onDesktop';
};
