import type { Breakpoint } from './getBreakpointQueries';

export type DeviceType = 'mobile' | 'desktop';

const mobileBreakpoints: Breakpoint[] = ['base', 'xs', 's'];

/**
 * Tablet (`s`) is categorised as mobile, matching React Blade's `useBreakpoint`.
 * `undefined` (SSR / no match) resolves to desktop.
 */
export const getDeviceType = (breakpoint: Breakpoint | undefined): DeviceType => {
  return breakpoint && mobileBreakpoints.includes(breakpoint) ? 'mobile' : 'desktop';
};
