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
   * - `'neutral'` (default): static-black surface, light foreground (matches Figma dark header).
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
   * Page/merchant title. Rendered as the leading text when no `logo` is passed.
   * Maps to Figma `type=text` and `type=logo-text`.
   *
   * @default undefined
   */
  title?: string;

  /**
   * Secondary text rendered under the title.
   *
   * @default undefined
   */
  subtitle?: string;

  /**
   * Brand logo slot (image/SVG). Maps to Figma `type=logo`.
   * Presence of `logo` (vs `title`) infers the visual type — there is no `type` prop.
   *
   * @default undefined
   */
  logo?: React.ReactNode;

  /**
   * Leading thumbnail/icon shown before the title (Figma `type=text` icon-wrapper / illustration).
   *
   * @default undefined
   */
  prefix?: React.ReactNode;

  /**
   * When `true`, renders the "Razorpay Trusted Business" (RTB) badge next to the
   * logo/title. Replaces Figma's `showRTB` boolean (WYSIWYG — derived from this flag).
   *
   * @default false
   */
  isTrustedBusiness?: boolean;

  /**
   * Slot rendered immediately after the title (e.g. a `Badge`, `Counter`).
   *
   * @default undefined
   */
  titleSuffix?: React.ReactNode;
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
