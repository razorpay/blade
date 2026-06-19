import type { Snippet } from 'svelte';
import type { StyledPropsBlade } from '@razorpay/blade-core/utils';
import type { TooltipPlacement } from '../Tooltip/types';

/**
 * Visual emphasis of the AppBar surface.
 */
export type AppBarVariant = 'neutral' | 'subtle';

/**
 * Configuration for the back affordance rendered at the left edge of the AppBar.
 */
export type AppBarBackButton = {
  /**
   * Click handler for the back button.
   */
  onClick: (event: MouseEvent) => void;
  /**
   * Accessibility label for the back button (required).
   */
  accessibilityLabel: string;
  /**
   * Forwards `content`/`placement` to a Tooltip wrapping the back button.
   *
   * @default undefined
   */
  tooltip?: {
    content: string;
    placement?: TooltipPlacement;
  };
};

export type AppBarProps = {
  /**
   * The contents of the AppBar — typically `AppBarLeading` and `AppBarActions`.
   */
  children: Snippet;

  /**
   * Renders a back button at the left-most edge of the AppBar. Pass an object
   * with the click handler and accessibility label. When omitted, no back button
   * is rendered (WYSIWYG — no separate `showBackButton` flag).
   *
   * @default undefined
   */
  backButton?: AppBarBackButton;

  /**
   * Visual emphasis of the AppBar surface.
   * - `'neutral'`: static-black surface, light (static-white) foreground.
   * - `'subtle'`: gray surface that adapts to an embedded/light page context.
   *
   * @default 'neutral'
   */
  variant?: AppBarVariant;

  /**
   * When `true`, the AppBar sticks to the top of its scroll container
   * (`position: sticky; top: 0`).
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

  /**
   * Overrides the surface background color. When set, takes precedence over the
   * `variant` background.
   *
   * @default undefined
   */
  backgroundColor?: string;

  /**
   * Sets the `width` of the AppBar.
   *
   * @default '100%'
   */
  width?: string;

  /**
   * Test ID for the element.
   *
   * @default undefined
   */
  testID?: string;

  /**
   * Analytics data attributes.
   */
  [key: `data-analytics-${string}`]: string;
} & StyledPropsBlade;

export type AppBarLeadingProps = {
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
   * Brand logo slot (image/SVG). Maps to Figma `type=logo`. Presence of `logo`
   * (vs `title`) infers the visual type — there is no `type` prop.
   *
   * @default undefined
   */
  logo?: Snippet;

  /**
   * Leading thumbnail/icon shown before the title (Figma `type=text` icon-wrapper).
   *
   * @default undefined
   */
  prefix?: Snippet;

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
  titleSuffix?: Snippet;

  /**
   * Test ID for the element.
   *
   * @default undefined
   */
  testID?: string;

  /**
   * Analytics data attributes.
   */
  [key: `data-analytics-${string}`]: string;
};

export type AppBarActionsProps = {
  /**
   * Trailing action content. Accepts a group of icon-only `Button`s
   * (Figma `trailing=icon`) or a custom illustration/visual element
   * (Figma `trailing=illustration`).
   */
  children: Snippet;

  /**
   * Test ID for the element.
   *
   * @default undefined
   */
  testID?: string;

  /**
   * Analytics data attributes.
   */
  [key: `data-analytics-${string}`]: string;
};
