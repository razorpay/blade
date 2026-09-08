import type { Snippet } from 'svelte';
import type { StyledPropsBlade } from '@razorpay/blade-core/utils';
import type { ModalSize, ModalBodyPadding } from '@razorpay/blade-core/styles';

export interface ModalProps extends StyledPropsBlade {
  /**
   * Children of the Modal — typically a `ModalHeader`, `ModalBody`, and/or
   * `ModalFooter` rendered in that order.
   */
  children: Snippet;

  /**
   * Sets the modal to open or close.
   *
   * @default false
   */
  isOpen?: boolean;

  /**
   * Callback fired when the user clicks the close button, clicks the backdrop,
   * or presses the escape key.
   */
  onDismiss?: () => void;

  /**
   * Whether the modal can be dismissed by clicking outside or pressing the
   * escape key. When `false` the close button is hidden and the modal must be
   * closed programmatically (typically via a footer button).
   *
   * @default true
   */
  isDismissible?: boolean;

  /**
   * Element that should receive keyboard focus when the modal opens. By default
   * focus moves to the close button. Svelte callers pass the element obtained
   * via `bind:this`.
   *
   * @default null
   */
  initialFocusRef?: HTMLElement | null;

  /**
   * Size of the modal.
   *
   * @default 'small'
   */
  size?: ModalSize;

  /**
   * Accessibility label for the modal dialog.
   */
  accessibilityLabel?: string;

  /**
   * Sets the z-index of the modal.
   *
   * @default 1000
   */
  zIndex?: number;

  /** Test ID applied to the surface element. */
  testID?: string;

  /** Analytics data attributes. */
  [key: `data-analytics-${string}`]: string;
}

export interface ModalHeaderProps extends StyledPropsBlade {
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

  /** Test ID applied to the header element. */
  testID?: string;

  /** Analytics data attributes. */
  [key: `data-analytics-${string}`]: string;
}

export interface ModalBodyProps extends StyledPropsBlade {
  /** Body content. */
  children: Snippet;

  /**
   * Equal padding applied on all sides of the body content. Only `spacing.0`
   * and `spacing.6` are allowed deliberately.
   *
   * @default 'spacing.6'
   */
  padding?: ModalBodyPadding;

  /**
   * Explicit height for the body scroll container (e.g. `'100%'`). Accepts any
   * CSS length string.
   */
  height?: string;

  /** Test ID applied to the body element. */
  testID?: string;

  /** Analytics data attributes. */
  [key: `data-analytics-${string}`]: string;
}

export interface ModalFooterProps extends StyledPropsBlade {
  /** Footer content — typically `Button`s or other CTAs. */
  children: Snippet;

  /** Test ID applied to the footer element. */
  testID?: string;

  /** Analytics data attributes. */
  [key: `data-analytics-${string}`]: string;
}
