import type { Snippet } from 'svelte';
import type { StyledPropsBlade } from '@razorpay/blade-core/utils';
import type { IconComponent } from '../Icons';

export type AnnouncementBannerTheme = 'dark' | 'light';
export type AnnouncementBannerAlignment = 'center' | 'left';

export interface AnnouncementBannerProps extends StyledPropsBlade {
  /**
   * The banner message. Pass a string, or inline content such as `Link`.
   * Keep it short — the banner is single-line.
   */
  children: Snippet | string;

  /**
   * Colour treatment of the banner.
   * `dark` renders a translucent dark background with light text,
   * `light` renders a subtle gray background with dark text.
   * @default 'dark'
   */
  theme?: AnnouncementBannerTheme;

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

  /** Analytics data attributes. */
  [key: `data-analytics-${string}`]: string;
}
