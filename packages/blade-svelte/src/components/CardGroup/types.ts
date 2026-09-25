import type { Snippet } from 'svelte';
import type { StyledPropsBlade } from '@razorpay/blade-core/utils';

type AnalyticsAttribute = {
  /** Analytics data attributes. */
  [key: `data-analytics-${string}`]: string;
};

export type CardGroupProps = {
  /**
   * Rows of the group — compose `CardGroupItem` and `CardGroupCollapsibleItem`.
   */
  children: Snippet;

  /**
   * Accessible label for the group, announced by screen readers.
   */
  accessibilityLabel?: string;

  /**
   * Test ID for the root element.
   */
  testID?: string;
} & AnalyticsAttribute &
  StyledPropsBlade;

export type CardGroupItemProps = {
  /**
   * Row content — the free slot between the leading and trailing slots.
   */
  children?: Snippet | string;

  /**
   * Leading slot, rendered before the content (e.g. an icon or avatar).
   */
  leading?: Snippet;

  /**
   * Trailing slot, rendered after the content and before the chevron
   * (e.g. a badge or amount).
   */
  trailing?: Snippet;

  /**
   * Renders the row as a navigating link. A row either navigates (`href`) or
   * selects (`onClick` / `isSelected`) — never both. Ignored when the row acts
   * as a collapsible trigger.
   *
   * @default undefined
   */
  href?: string;

  /**
   * Link target, used only with `href`.
   *
   * @default undefined
   */
  target?: string;

  /**
   * Link rel, used only with `href`.
   *
   * @default undefined
   */
  rel?: string;

  /**
   * Click handler for a selecting row. Ignored when `href` is set or when the
   * row acts as a collapsible trigger.
   *
   * @default undefined
   */
  onClick?: (event: MouseEvent) => void;

  /**
   * Marks a selecting row as selected. Selection is consumer-driven; the group
   * does not own selection state.
   *
   * @default false
   */
  isSelected?: boolean;

  /**
   * Disables the row.
   *
   * @default false
   */
  isDisabled?: boolean;

  /**
   * Accessible label for the row.
   */
  accessibilityLabel?: string;

  /**
   * Test ID for the row.
   */
  testID?: string;
} & AnalyticsAttribute &
  StyledPropsBlade;

export type CardGroupCollapsibleItemProps = {
  /**
   * Compose a `CardGroupItem` (the disclosure trigger) followed by a
   * `CardGroupCollapsibleItemBody` (the revealed content).
   */
  children: Snippet;

  /**
   * Expands the row (controlled).
   *
   * @default undefined
   */
  isExpanded?: boolean;

  /**
   * Expands the row by default (uncontrolled).
   *
   * @default false
   */
  defaultIsExpanded?: boolean;

  /**
   * Callback for a change in the row's expanded state.
   *
   * @default undefined
   */
  onExpandChange?: (args: { isExpanded: boolean }) => void;

  /**
   * Test ID for the row.
   */
  testID?: string;
} & AnalyticsAttribute &
  StyledPropsBlade;

export type CardGroupCollapsibleItemBodyProps = {
  /**
   * Revealed content — a free slot that may hold anything, including a nested
   * `CardGroup`.
   */
  children: Snippet | string;

  /**
   * Test ID for the body element.
   */
  testID?: string;
} & AnalyticsAttribute;
