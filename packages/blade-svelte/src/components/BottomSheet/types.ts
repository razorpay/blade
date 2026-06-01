import type { Snippet } from 'svelte';
import type { StyledPropsBlade } from '@razorpay/blade-core/utils';
import type { BottomSheetBodyPadding, BottomSheetBodyOverflow } from '@razorpay/blade-core/styles';

/**
 * Snap points expressed as fractions of the viewport height (between 0 and 1).
 * `[lower, middle, upper]` — e.g. `[0.35, 0.5, 0.85]`.
 */
export type SnapPoints = [number, number, number];

export interface BottomSheetProps extends StyledPropsBlade {
  /**
   * Children of the BottomSheet — typically a `BottomSheetHeader`,
   * `BottomSheetBody`, and/or `BottomSheetFooter` rendered in that order.
   */
  children: Snippet;

  /**
   * SnapPoints in which the bottom sheet will rest on. Each value is a
   * fraction of the viewport height; e.g. `0.5` means 50% of the screen.
   *
   * @default [0.35, 0.5, 0.85]
   */
  snapPoints?: SnapPoints;

  /**
   * Called when the bottom sheet is closed via swipe down or backdrop tap.
   */
  onDismiss?: () => void;

  /**
   * Whether the bottom sheet can be dismissed by tapping the backdrop or
   * swiping down. When `false` the close button is hidden and the sheet must
   * be closed programmatically by the caller (typically via a footer button).
   *
   * @default true
   */
  isDismissible?: boolean;

  /**
   * Toggles bottom sheet open state.
   *
   * @default false
   */
  isOpen?: boolean;

  /**
   * Element that should receive keyboard focus when the sheet opens. By
   * default focus is moved to the close button. Pass an `HTMLElement`
   * obtained via `bind:this`.
   *
   * @default null
   */
  initialFocusElement?: HTMLElement | null;

  /**
   * Sets the z-index of the bottom sheet. When stacking multiple sheets keep
   * `zIndex` identical across all of them — the stacking context is computed
   * internally.
   *
   * @default 100
   */
  zIndex?: number;

  /** Test ID applied to the surface element. */
  testID?: string;

  /** Analytics data attributes. */
  [key: `data-analytics-${string}`]: string;
}

export interface BottomSheetHeaderProps extends StyledPropsBlade {
  /** Header title text. */
  title?: string;

  /** Header subtitle text rendered below the title. */
  subtitle?: string;

  /**
   * Leading slot rendered before the title (e.g. an icon).
   * Pass a Svelte snippet.
   */
  leading?: Snippet;

  /**
   * Trailing slot rendered after the title (e.g. a `Badge`, `Text`, `Button`,
   * or `Link`). Pass a Svelte snippet.
   */
  trailing?: Snippet;

  /**
   * Adornment rendered alongside the title (e.g. a `Counter`).
   * Pass a Svelte snippet.
   */
  titleSuffix?: Snippet;

  /**
   * Show a back button on the left side of the header. Wires up
   * `onBackButtonClick` when present.
   *
   * @default false
   */
  showBackButton?: boolean;

  /** Called when the back button is clicked. */
  onBackButtonClick?: () => void;

  /**
   * Reserved for future AutoComplete-in-header integration. Accepts a Svelte
   * snippet and renders it after the header content. The full integration
   * depends on Dropdown/AutoComplete which are not yet migrated.
   */
  children?: Snippet;

  /** Test ID applied to the header element. */
  testID?: string;

  /** Analytics data attributes. */
  [key: `data-analytics-${string}`]: string;
}

export interface BottomSheetBodyProps extends StyledPropsBlade {
  /** Body content. */
  children: Snippet;

  /**
   * Equal padding applied on all sides of the body content. Only `spacing.0`
   * and `spacing.5` are allowed deliberately.
   *
   * @default 'spacing.5'
   */
  padding?: BottomSheetBodyPadding;

  /**
   * Native CSS `overflow` value applied to the body scroll container.
   *
   * @default 'auto'
   */
  overflow?: BottomSheetBodyOverflow;

  /**
   * Set to `true` when the body contains an `ActionList` (or similar
   * full-bleed list). The body padding will collapse to `spacing.3` to match
   * React's `React.Children.forEach` ActionList detection. Svelte cannot
   * introspect snippets, so this is exposed as an explicit prop.
   *
   * @default false
   */
  hasActionList?: boolean;

  /** Test ID applied to the body element. */
  testID?: string;

  /** Analytics data attributes. */
  [key: `data-analytics-${string}`]: string;
}

export interface BottomSheetFooterProps extends StyledPropsBlade {
  /** Footer content — typically `Button`s or other CTAs. */
  children: Snippet;

  /** Test ID applied to the footer element. */
  testID?: string;

  /** Analytics data attributes. */
  [key: `data-analytics-${string}`]: string;
}
