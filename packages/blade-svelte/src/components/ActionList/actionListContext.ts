import { getContext, setContext } from 'svelte';
import type { ActionListContextValue, ActionListItemContextValue } from './types';

const ACTION_LIST_CONTEXT_KEY = Symbol('action-list-context');

/**
 * Reactive context provided by `ActionList` and read by each `ActionListItem`.
 * Mirrors the slice of React's `useDropdown` that ActionList actually needs:
 * `selectionType` (single-select only in this scope), the controlled
 * `selectedValue`, the `onItemSelect` callback (consumer closes the sheet), and
 * `isInBottomSheet` (resolved from `getBottomSheetContext()` or the prop).
 *
 * Uses the getter pattern (`setContext(KEY, () => value)`) so `selectedValue`
 * stays reactive across the boundary.
 */
export function setActionListContext(getter: () => ActionListContextValue): void {
  setContext(ACTION_LIST_CONTEXT_KEY, getter);
}

export function getActionListContext(): ActionListContextValue | undefined {
  const getter = getContext<(() => ActionListContextValue) | undefined>(ACTION_LIST_CONTEXT_KEY);
  return getter?.();
}

const ACTION_LIST_ITEM_CONTEXT_KEY = Symbol('action-list-item-context');

/**
 * Tiny row-local context carrying `isDisabled`/`intent` from `ActionListItem`
 * down to `ActionListItemText` (mirrors React's `useBaseMenuItem()` read). Kept
 * separate from `ActionListContext` so text/asset don't re-plumb the full menu
 * context.
 */
export function setActionListItemContext(getter: () => ActionListItemContextValue): void {
  setContext(ACTION_LIST_ITEM_CONTEXT_KEY, getter);
}

export function getActionListItemContext(): ActionListItemContextValue | undefined {
  const getter = getContext<(() => ActionListItemContextValue) | undefined>(
    ACTION_LIST_ITEM_CONTEXT_KEY,
  );
  return getter?.();
}
