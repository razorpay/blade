import type { TypographyPlatforms } from '@razorpay/blade-core/tokens';
import type { DeviceType } from '@razorpay/blade-core/utils';

/**
 * Typography follows the same mobile/desktop split as `getBreakpoint()`,
 * so both flip together on a single breakpoint crossing.
 */
export const getTypographyPlatform = (deviceType: DeviceType): TypographyPlatforms => {
  return deviceType === 'mobile' ? 'onMobile' : 'onDesktop';
};
