import type React from 'react';
import type { DataAnalyticsAttribute, TestID } from '~utils/types';

type TreeViewProps = {
  /**
   * Children of TreeView. Only `TreeViewItem` and `TreeViewLoadMore` are allowed
   */
  children: React.ReactNode;
  /**
   * Selection type of the tree.
   *
   * Standalone only. Inside Dropdown, it is inherited from Dropdown's `selectionType`;
   * passing a conflicting prop logs a dev warning and Dropdown's value wins.
   *
   * @default 'single'
   */
  selectionType?: 'single' | 'multiple';
  /**
   * Controlled selected leaf values.
   *
   * Standalone only. Inside Dropdown, use `value` on the trigger (SelectInput / FilterChipSelectInput) instead.
   */
  value?: string[];
  /**
   * Default selected leaf values (uncontrolled).
   *
   * Standalone only. Inside Dropdown, use `defaultValue` on the trigger instead.
   */
  defaultValue?: string[];
  /**
   * Selection change handler.
   *
   * Standalone only. Inside Dropdown, use `onChange` on the trigger instead.
   *
   * - `values`: selected leaf values (a branch's own value never appears here in multiple selection)
   * - `selectedGroups`: values of the topmost fully-selected branches
   */
  onChange?: (event: { name?: string; values: string[]; selectedGroups: string[] }) => void;
  /**
   * Name of the tree, passed in the `onChange` payload
   */
  name?: string;
} & TestID &
  DataAnalyticsAttribute;

type TreeViewItemProps = {
  /**
   * Title of the item
   */
  title: string;
  /**
   * Value of the item. Required and must be unique across the whole tree
   */
  value: string;
  /**
   * Description shown below the title
   */
  description?: string;
  /**
   * Leading element - icon, asset, or avatar.
   *
   * In multiple selection, it renders AFTER the checkbox (it is never replaced by it)
   */
  leading?: React.ReactNode;
  /**
   * Trailing element - Counter, Badge, or Text
   */
  trailing?: React.ReactNode;
  /**
   * Disables the item and its whole subtree - unselectable, not expandable, skipped by keyboard traversal
   */
  isDisabled?: boolean;
  /**
   * When `false` on a branch item, the branch itself cannot be selected - clicking the row
   * (or pressing Enter/Space) toggles expansion instead, and no checkbox / selected state
   * is rendered for it. Use this when only leaf items should be selectable.
   *
   * Only supported on branch items - leaf items are always selectable
   *
   * @default true
   */
  isSelectable?: boolean;
  /**
   * Nested `TreeViewItem` / `TreeViewLoadMore` children. Nesting defines depth
   */
  children?: React.ReactNode;
  /**
   * Default expansion state (uncontrolled)
   *
   * @default false
   */
  defaultIsExpanded?: boolean;
  /**
   * Controlled expansion state
   */
  isExpanded?: boolean;
  /**
   * Expansion change handler
   */
  onExpandChange?: (event: { isExpanded: boolean }) => void;
  /**
   * Forces the branch affordance (chevron) before children exist. Use for on-demand (async) children
   */
  hasChildren?: boolean;
  /**
   * Renders a Spinner in the chevron slot while children are being fetched
   */
  isLoading?: boolean;
  /**
   * Per-item click handler
   */
  onClick?: (event: { name: string; value: string }) => void;
} & TestID &
  DataAnalyticsAttribute;

type TreeViewLoadMoreProps = {
  /**
   * Label of the load more row
   *
   * @default 'Show more'
   */
  children?: string;
  /**
   * Click handler that loads more items
   */
  onClick: () => void;
  /**
   * Renders a Spinner, switches the label to "Loading..." and makes the row inert while more items are being fetched
   */
  isLoading?: boolean;
} & TestID &
  DataAnalyticsAttribute;

/**
 * Internal normalized representation of a tree row (TreeViewItem or TreeViewLoadMore)
 */
type TreeViewNodeType = {
  kind: 'item' | 'loadMore';
  title: string;
  /**
   * Item's `value`. For loadMore rows this is a synthetic internal value
   */
  value: string;
  parentValue: string | null;
  /**
   * 1-based depth, maps to `aria-level`
   */
  level: number;
  /**
   * 1-based position within its siblings, maps to `aria-posinset`
   */
  posInSet: number;
  /**
   * Number of siblings at this level (including this node), maps to `aria-setsize`
   */
  setSize: number;
  /**
   * Effective disabled state (own `isDisabled` or inherited from a disabled ancestor)
   */
  isDisabled: boolean;
  /**
   * true when the node has rendered children or `hasChildren` is set
   */
  isBranch: boolean;
  /**
   * false when a branch opted out of selection via `isSelectable={false}` (row click /
   * Enter / Space toggle expansion instead). Always true for leaves; false for loadMore rows
   */
  isSelectable: boolean;
  /**
   * true when the node has actually rendered (loaded) children
   */
  hasRenderedChildren: boolean;
  /**
   * `defaultIsExpanded` prop captured from the item
   */
  defaultIsExpanded: boolean;
  /**
   * `isExpanded` prop captured from the item (undefined when expansion is uncontrolled)
   */
  controlledIsExpanded?: boolean;
  /**
   * `onExpandChange` prop captured from the item
   */
  onExpandChange?: (event: { isExpanded: boolean }) => void;
  /**
   * `isLoading` prop captured from the item / loadMore row
   */
  isLoading: boolean;
  /**
   * Values of direct children (items and loadMore rows), in document order
   */
  childValues: string[];
  /**
   * Values of all enabled, loaded, selectable leaf descendants (excludes disabled subtrees).
   * Empty for leaves and for unloaded branches
   */
  selectableLeafValues: string[];
  /**
   * Index in the flat registration list (Dropdown mode `options`). -1 for rows inside disabled subtrees
   */
  optionIndex: number;
};

type BranchSelectionStateType = 'none' | 'some' | 'all';

type TreeViewDisplayOverrideType = {
  label: string;
  count: number;
};

export type {
  TreeViewProps,
  TreeViewItemProps,
  TreeViewLoadMoreProps,
  TreeViewNodeType,
  BranchSelectionStateType,
  TreeViewDisplayOverrideType,
};
