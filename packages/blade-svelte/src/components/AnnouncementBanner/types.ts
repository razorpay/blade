import type { Snippet } from 'svelte';
import type { AnnouncementBannerSlot, StyleOverride } from '@razorpay/blade-core/styles';
import type { StyledPropsBlade, DataAnalyticsAttribute } from '@razorpay/blade-core/utils';
import type { IconComponent } from '../Icons';

export type AnnouncementBannerAlignment = 'center' | 'left';

export interface AnnouncementBannerProps extends StyledPropsBlade, DataAnalyticsAttribute {
  /**
   * The banner message. Pass a string, or inline content such as `Link`.
   * Keep it short — the banner is single-line.
   */
  children: Snippet | string;

  /**
   * Horizontal alignment of the banner content.
   * @default 'center'
   */
  alignment?: AnnouncementBannerAlignment;

  /**
   * Leading icon shown before the message. Omit to render the banner without an icon.
   */
  icon?: IconComponent;

  /**
   * Accessible label for the banner region, announced by screen readers.
   * @default 'Announcement'
   */
  accessibilityLabel?: string;

  /**
   * Test ID for the element.
   */
  testID?: string;

  /**
   * Per-slot classname overrides. Merged under provider `componentConfig.AnnouncementBanner.styleOverride`;
   * instance values win on conflicts.
   */
  styleOverride?: StyleOverride<AnnouncementBannerSlot>;
}
