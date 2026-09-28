import { getContext, setContext } from 'svelte';
import type { DropdownContextValue } from './types';

const DROPDOWN_CONTEXT_KEY = Symbol('dropdown-context');

/**
 * Reactive Dropdown context (getter pattern, mirrors `tooltipContext` /
 * `bottomSheetContext`). `setContext(KEY, () => value)` keeps getter fields on
 * the context object live across the boundary.
 */
export function setDropdownContext(getter: () => DropdownContextValue): void {
  setContext(DROPDOWN_CONTEXT_KEY, getter);
}

/**
 * Read the Dropdown context. Returns `undefined` when there is no `Dropdown`
 * ancestor — consumers (notably `ActionList`/`ActionListItem`) must treat this
 * as a no-op so standalone + BottomSheet usage stays unchanged.
 */
export function getDropdownContext(): DropdownContextValue | undefined {
  const getter = getContext<(() => DropdownContextValue) | undefined>(DROPDOWN_CONTEXT_KEY);
  return getter?.();
}
