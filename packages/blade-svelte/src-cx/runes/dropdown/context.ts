import type { Attachment } from 'svelte/attachments';
import { defineContext } from '../context';
import type { PopupListHost } from '../popup-list/item.svelte';
import type { PopupEntry } from '../popup-list/popup-list.svelte';

/** One ActionListItem inside a Dropdown, as the dropdown knows it: a popup-list row holding a value. */
export interface DropdownEntry<T = unknown> extends PopupEntry {
  value(): T;
  /** A link row: picking it follows the link and holds no value. */
  isLink?(): boolean;
}

/**
 * What a Dropdown offers its ActionListItems and its parts (the header's
 * search, the select trigger). `Shared` is the library's own payload, passed
 * through.
 */
export interface DropdownContext<T, Shared> extends PopupListHost<DropdownEntry<T>> {
  readonly shared: Shared;
  readonly isMultiple: boolean;
  isSelected(value: T): boolean;
  /** Whether a row's text passes the search; true without one. */
  matches(text: string): boolean;
  /** The search: what the header's input writes. */
  readonly query: string;
  setQuery(query: string): void;
  /** The listbox's id: what a search combobox controls. */
  readonly listId: string;
  /** The active row's id: the search names it too. */
  readonly activeId: string | undefined;
  /** On a search input: it takes focus from the list while the dropdown is open. */
  readonly focusOwner: Attachment<HTMLElement>;
  /** The select field (no trigger of its own): its rows are values only, never actions. */
  readonly isSelectField: boolean;
  /** Closes the list (a link row was followed); Escape hands focus back to the trigger. */
  close(source?: 'escape' | 'outside'): void;
}

const DROPDOWN = defineContext<unknown>('blade-dropdown');

export function provideDropdown<T, Shared>(dropdown: DropdownContext<T, Shared>): void {
  DROPDOWN.set(dropdown);
}

export function getDropdown<T, Shared>(): DropdownContext<T, Shared> | undefined {
  return DROPDOWN.get() as DropdownContext<T, Shared> | undefined;
}
