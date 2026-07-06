import type { Snippet } from 'svelte';
import type { StyledPropsBlade } from '@razorpay/blade-core/utils';
import type { TrustedMarkerType } from '@razorpay/blade-core/styles';
import type { TooltipPlacement } from '../Tooltip/types';

/**
 * Visual emphasis of the AppBar surface.
 */
export type AppBarVariant = 'neutral' | 'subtle';

export type AppBarProps = {
  /**
   * The contents of the AppBar — typically `AppBarLeading` and `AppBarActions`.
   */
  children: Snippet;

  /**
   * When `true`, renders a back button at the left-most edge of the AppBar.
   *
   * @default false
   */
  showBackButton?: boolean;

  /**
   * Click handler for the back button. Required when `showBackButton` is `true`.
   *
   * @default undefined
   */
  onBackButtonClick?: (event: MouseEvent) => void;

  /**
   * Accessibility label for the back button.
   *
   * @default 'Go back'
   */
  backButtonAccessibilityLabel?: string;

  /**
   * Forwards `content`/`placement` to a Tooltip wrapping the back button.
   *
   * @default undefined
   */
  backButtonTooltip?: {
    content: string;
    placement?: TooltipPlacement;
  };

  /**
   * Visual emphasis of the AppBar surface.
   * - `'neutral'`: transparent surface, light (static-white) foreground — the AppBar has
   *   no background of its own and sits directly over the page (matches Figma).
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
   * Overrides the surface background color using a Blade surface token.
   * When set, takes precedence over the `variant` background.
   * Use dot-notation token paths, e.g. `"surface.background.gray.intense"`.
   *
   * @default undefined
   */
  backgroundColor?:
    | 'surface.background.gray.intense'
    | 'surface.background.gray.moderate'
    | 'surface.background.gray.subtle'
    | 'surface.background.primary.intense'
    | 'surface.background.primary.subtle';

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
  logo?: Snippet;

  /**
   * Razorpay Trusted Business badge form.
   * - `'full'`: shield + pill below the title/logo row
   * - `'icon'`: shield only, inline with `title` (beside `logo` when no title)
   *
   * @default undefined
   */
  rtbBadge?: TrustedMarkerType;

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
   * Trailing action content. Accepts a group of `IconButton`s
   * (Figma `trailing=icon`) or a custom illustration/visual element
   * (Figma `trailing=illustration`).
   *
   * **Note:** Unlike the React version which wraps children in a dark `BladeProvider`,
   * the Svelte version uses ambient theme colors. When `AppBar` variant is `'neutral'`
   * (dark surface), use `emphasis="moderate"` on `IconButton` so icons resolve to the
   * correct static-white color.
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
