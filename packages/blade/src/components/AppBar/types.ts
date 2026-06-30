import type React from 'react';
import type { TooltipProps } from '~components/Tooltip';
import type { BoxProps } from '~components/Box';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { DataAnalyticsAttribute, TestID } from '~utils/types';

type AppBarProps = {
  /**
   * The contents of the AppBar — typically `AppBarLeading` and `AppBarActions`.
   */
  children: React.ReactNode;

  /**
   * Renders a back IconButton at the left-most edge of the AppBar.
   * Pass an object with the click handler and accessibility label.
   * When omitted, no back button is rendered (WYSIWYG — no separate `showBackButton` flag).
   *
   * @default undefined
   */
  backButton?: {
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    accessibilityLabel: string;
    /**
     * Forwards props to a Tooltip wrapping the back button.
     */
    tooltip?: Pick<TooltipProps, 'content' | 'placement'>;
  };

  /**
   * Visual emphasis of the AppBar surface.
   * - `'neutral'` (default): transparent surface, light foreground (matches Figma — the
   *   AppBar has no background of its own and sits directly over the page).
   * - `'subtle'`: surface that adapts to the page background for embedded/light contexts.
   *
   * @default 'neutral'
   */
  variant?: 'neutral' | 'subtle';

  /**
   * When `true`, the AppBar sticks to the top of its scroll container.
   *
   * @default true
   */
  isSticky?: boolean;

  /**
   * Accessibility label for the AppBar `banner`/`header` landmark.
   *
   * @default undefined
   */
  accessibilityLabel?: string;
} & Pick<
  BoxProps,
  'paddingX' | 'paddingY' | 'backgroundColor' | 'position' | 'top' | 'zIndex' | 'width'
> &
  TestID &
  DataAnalyticsAttribute &
  StyledPropsBlade;

type AppBarLeadingProps = {
  /**
   * Page/merchant title. Pairs with `logo` for logo+title layout.
   *
   * @default undefined
   */
  title?: string;

  /**
   * Brand mark — wordmark, icon logo, avatar, etc.
   *
   * @default undefined
   */
  logo?: React.ReactNode;

  /**
   * Razorpay Trusted Business badge form.
   * - `'full'`: shield + pill below the title/logo row
   * - `'icon'`: shield only, inline with `title` (beside `logo` when no title)
   *
   * @default undefined
   */
  rtbBadge?: 'full' | 'icon';
} & TestID &
  DataAnalyticsAttribute;

type AppBarActionsProps = {
  /**
   * Trailing action content. Accepts a group of `IconButton`s (Figma `trailing=icon`)
   * or a custom illustration/visual element (Figma `trailing=illustration`).
   */
  children: React.ReactNode;
} & TestID &
  DataAnalyticsAttribute;

export type { AppBarProps, AppBarLeadingProps, AppBarActionsProps };
