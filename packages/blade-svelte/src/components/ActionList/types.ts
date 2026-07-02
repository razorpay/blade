import type { Snippet } from 'svelte';
import type { StyledPropsBlade, DataAnalyticsAttribute } from '@razorpay/blade-core/utils';
import type { IconComponent } from '../Icons';
import type { AvatarProps } from '../Avatar/types';
import type { BadgeProps } from '../Badge/types';

/** Selection mode of the list — `single` (default) or `multiple`. */
export type ActionListSelectionType = 'single' | 'multiple';

/** Payload passed to `ActionList`'s `onAction` when a row is activated. */
export type ActionListItemSelectPayload = { value: string };

/** Payload passed to `ActionListItem`'s `onClick` (web-only). */
export type ActionListItemClickPayload = {
  /** The item's `value`. */
  value: string;
  /** The item's selected state at click time. */
  isSelected?: boolean;
  /** Native click event. */
  event: MouseEvent;
};

interface ActionListBaseProps extends StyledPropsBlade, DataAnalyticsAttribute {
  /**
   * Accepts `ActionListItem` / `ActionListSection` children.
   */
  children: Snippet;
  /**
   * Fired when a row is activated, once per toggle, with the item's `value`.
   *
   * The consumer owns selection state: in `single` mode update `selectedValue`
   * (and typically close the surrounding BottomSheet); in `multiple` mode
   * toggle the `value` in/out of your `string[]`. This callback does not
   * auto-manage the array.
   */
  onAction?: (payload: ActionListItemSelectPayload) => void;
  /**
   * Test ID for the container element.
   */
  testID?: string;
}

interface ActionListSingleProps extends ActionListBaseProps {
  /**
   * Selection mode: one item selected at a time.
   *
   * @default 'single'
   */
  selectionType?: 'single';
  /**
   * Currently selected item value (controlled). Pass the `value` of the
   * selected `ActionListItem`. Drives `aria-selected` on rows.
   */
  selectedValue?: string;
}

interface ActionListMultipleProps extends ActionListBaseProps {
  /**
   * Selection mode: many items selectable. Each row renders a (visual,
   * `aria-hidden`) checkbox indicator in place of its `leading` content.
   * `aria-multiselectable` is set on the container.
   */
  selectionType: 'multiple';
  /**
   * Currently selected item values (controlled). Pass an array of `value`s
   * for all selected `ActionListItem`s. Drives `aria-selected` on rows.
   */
  selectedValue?: string[];
}

/** Props for the `ActionList` container — `selectionType` discriminates `selectedValue`. */
export type ActionListProps = ActionListSingleProps | ActionListMultipleProps;

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
   * Identity of the item used for selection and returned via `onAction` /
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
   * Content on the left of the item. Holds `ActionListItemIcon`,
   * `ActionListItemAsset`, or `ActionListItemAvatar`.
   *
   * Overridden by the checkbox indicator when the list is `selectionType="multiple"`.
   */
  leading?: Snippet;
  /**
   * Content on the right of the item. Holds `ActionListItemText` or an icon.
   */
  trailing?: Snippet;
  /**
   * Content rendered immediately next to the title (same row). Holds
   * `ActionListItemBadge` or `ActionListItemBadgeGroup`.
   */
  titleSuffix?: Snippet;
  /**
   * Click handler (web-only). `value` is the item's string identifier,
   * `isSelected` is the current selected state.
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
  children: Snippet;
}

/**
 * Props for `ActionListItemIcon` — a leading/trailing icon whose color follows
 * the row's disabled/negative state (mirrors React `useBaseMenuItem`).
 */
export interface ActionListItemIconProps {
  /**
   * Icon component to render (e.g. `HomeIcon`). Rendered at `size="medium"`;
   * color is derived from the row context.
   */
  icon: IconComponent;
}

/**
 * Props for `ActionListItemAvatar` — a leading avatar. Wraps `Avatar` and forces
 * `size="xsmall"`; every other `Avatar` prop except `size` is accepted.
 */
export type ActionListItemAvatarProps = Omit<AvatarProps, 'size'>;

/**
 * Props for `ActionListItemBadge` — wraps `Badge` (forced `size="medium"` with a
 * `spacing.3` left margin). Accepts all `Badge` props except `size`.
 */
export type ActionListItemBadgeProps = Omit<BadgeProps, 'size'>;

/**
 * Props for `ActionListItemBadgeGroup` — a flex-row container for one or more
 * `ActionListItemBadge`, intended for the `titleSuffix` slot.
 */
export interface ActionListItemBadgeGroupProps {
  /**
   * `ActionListItemBadge` children laid out in a row.
   */
  children: Snippet;
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
  selectedValue?: string | string[];
  isInBottomSheet: boolean;
  onAction?: (payload: ActionListItemSelectPayload) => void;
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
