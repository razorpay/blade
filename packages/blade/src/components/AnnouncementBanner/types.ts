import type { ReactNode } from 'react';
import type { IconComponent } from '~components/Icons';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { TestID, DataAnalyticsAttribute } from '~utils/types';

export type AnnouncementBannerAlignment = 'center' | 'left';

export type AnnouncementBannerProps = {
  /**
   * The banner message. Pass a string, or inline content such as `Link`.
   * Keep it short — the banner is single-line.
   */
  children: ReactNode;

  /**
   * Horizontal alignment of the banner content.
   *
   * @default center
   */
  alignment?: AnnouncementBannerAlignment;

  /**
   * Leading icon shown before the message. Rendered only when `showIcon` is true.
   *
   * @default -
   */
  icon?: IconComponent;

  /**
   * Whether to show the leading icon.
   *
   * @default true
   */
  showIcon?: boolean;

  /**
   * Accessible label for the banner region, announced by screen readers.
   *
   * @default "Announcement"
   */
  accessibilityLabel?: string;
} & TestID &
  StyledPropsBlade &
  DataAnalyticsAttribute;

/**
 * Internal styled-component props.
 *
 * The colour treatment follows the app's `colorScheme` (resolved via
 * `useTheme`) rather than a prop, so it is passed down as `isDark`.
 */
export type StyledAnnouncementBannerProps = {
  isDark: boolean;
  alignment: AnnouncementBannerAlignment;
} & StyledPropsBlade;
