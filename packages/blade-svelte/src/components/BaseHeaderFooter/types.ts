import type { Snippet } from 'svelte';
import type { DataAnalyticsAttribute } from '@razorpay/blade-core/utils';

/**
 * Web-only Svelte port of React `BaseHeaderProps`. Only the slice consumed by
 * `DropdownHeader` is modeled; RN branches, prop-restriction, and background
 * image are dropped.
 */
export type BaseHeaderProps = {
  /** Header title text. */
  title?: string;
  /** Secondary text below the title. */
  subtitle?: string;
  /** Leading slot (left of the title). */
  leading?: Snippet;
  /** Trailing slot (right side, before the close button). */
  trailing?: Snippet;
  /** Slot rendered adjacent to the title text. */
  titleSuffix?: Snippet;
  /**
   * Show the divider under the header.
   * @default true
   */
  showDivider?: boolean;
  /**
   * Show the back button.
   * @default false
   */
  showBackButton?: boolean;
  /**
   * Show the close button.
   * @default true
   */
  showCloseButton?: boolean;
  /** Called when the back button is clicked. */
  onBackButtonClick?: () => void;
  /** Called when the close button is clicked. */
  onCloseButtonClick?: () => void;
  /**
   * Disabled visual state.
   * @default false
   */
  isDisabled?: boolean;
  /** Meta component name used for `data-blade-component`. */
  metaComponentName?: string;
  /** Test ID for the header element. */
  testID?: string;
  /** Inner children (e.g. AutoComplete in header). */
  children?: Snippet;
} & DataAnalyticsAttribute;

/**
 * Web-only Svelte port of React `BaseFooterProps`.
 */
export type BaseFooterProps = {
  /** Footer content. */
  children?: Snippet;
  /**
   * Show the divider above the footer.
   * @default true
   */
  showDivider?: boolean;
  /** Meta component name used for `data-blade-component`. */
  metaComponentName?: string;
  /** Test ID for the footer element. */
  testID?: string;
} & DataAnalyticsAttribute;
