import type { Snippet } from 'svelte';
import type { StyledPropsBlade, DataAnalyticsAttribute } from '@razorpay/blade-core/utils';

/** Selection mode. Only single-select is supported in this scope. */
export type ActionListSelectionType = 'single';

/** Payload passed to `ActionList`'s `onItemSelect` when a row is activated. */
export type ActionListItemSelectPayload = { value: string };

/** Payload passed to `ActionListItem`'s `onClick` (web-only). */
export type ActionListItemClickPayload = {
  /** The item's `value`. */
  name: string;
  /** The item's selected state at click time. */
  value?: boolean;
  /** Native click event. */
  event: MouseEvent;
};

export interface ActionListProps extends StyledPropsBlade {
  /**
   * Accepts `ActionListItem` / `ActionListSection` children.
   */
  children: Snippet;
  /**
   * Selection mode of the list. Only `single` is supported.
   *
   * @default 'single'
   */
  selectionType?: ActionListSelectionType;
  /**
   * Currently selected item `value` (controlled). Drives `aria-selected` on rows.
   */
  selectedValue?: string;
  /**
   * Fired when a row is activated. The consumer typically updates
   * `selectedValue` and closes the surrounding BottomSheet.
   */
  onItemSelect?: (payload: ActionListItemSelectPayload) => void;
  /**
   * Whether the list is rendered inside a BottomSheet. When `true`, the outer
   * box (border/shadow/padding) is dropped so BottomSheetBody owns scrolling.
   *
   * Resolved from `getBottomSheetContext()` when omitted, falling back to
   * `false`.
   */
  isInBottomSheet?: boolean;
  /**
   * Test ID for the container element.
   */
  testID?: string;
}

export interface ActionListItemProps extends DataAnalyticsAttribute {
  /**
   * Primary label of the item.
   */
  title: string;
  /**
   * Secondary description rendered under the title.
   */
  description?: string;
  /**
   * Identity of the item used for selection and returned via `onItemSelect` /
   * form submissions.
   */
  value: string;
  /**
   * Link to open when the item is clicked. Renders the row as an `<a>`.
   */
  href?: string;
  /**
   * HTML `target` of the link (only relevant with `href`).
   */
  target?: string;
  /**
   * Content on the left of the item. Holds `ActionListItemAsset` or an icon.
   */
  leading?: Snippet;
  /**
   * Content on the right of the item. Holds `ActionListItemText` or an icon.
   */
  trailing?: Snippet;
  /**
   * Click handler (web-only). `name` is the item `value`, `value` is the
   * current selected state.
   */
  onClick?: (payload: ActionListItemClickPayload) => void;
  /**
   * If `true`, the item is disabled — click is guarded and `aria-disabled` set.
   *
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Explicitly marks the item selected. When omitted, selection is derived from
   * the ActionList `selectedValue === value`.
   */
  isSelected?: boolean;
  /**
   * Negative intent — renders negative title text and hover background.
   */
  intent?: 'negative';
  /**
   * Test ID for the row element.
   */
  testID?: string;
}

export interface ActionListItemAssetProps {
  /**
   * Source of the image.
   */
  src: string;
  /**
   * Alt text for the image.
   */
  alt: string;
}

export interface ActionListItemTextProps {
  /**
   * Caption text. Color follows the row's disabled state.
   */
  children: Snippet | string;
}

export interface ActionListSectionProps extends DataAnalyticsAttribute {
  /**
   * Section title, announced as the group label.
   */
  title: string;
  /**
   * `ActionListItem` children belonging to this section.
   */
  children: Snippet;
  /**
   * Test ID for the section element.
   */
  testID?: string;
}

/**
 * Reactive context shared from `ActionList` to its `ActionListItem` children.
 */
export type ActionListContextValue = {
  selectionType: ActionListSelectionType;
  selectedValue?: string;
  isInBottomSheet: boolean;
  onItemSelect?: (payload: ActionListItemSelectPayload) => void;
  /** No-op-safe hook reserved for future focus/index needs. */
  registerItem?: (value: string) => void;
};

/**
 * Row-local context passed from `ActionListItem` to `ActionListItemText`.
 */
export type ActionListItemContextValue = {
  isDisabled: boolean;
  intent?: 'negative';
};
