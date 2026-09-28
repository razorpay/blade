import { getContext, setContext } from 'svelte';
import type { OrderedEntry } from '../base/ordered-entries.svelte';

/** One MenuItem, as the menu knows it. */
export interface MenuEntry extends OrderedEntry {
  isDisabled(): boolean;
  /** What typeahead matches. */
  text(): string;
  /** The item was chosen: it acts. The menu closes around it. */
  select(): void;
}

/**
 * What a Menu offers the MenuItems inside it. `Shared` is the library's own
 * payload from menu to item — checkout hands its class parts and the menu's
 * `onSelect` — and the rune only passes it through.
 */
export interface MenuContext<Shared> {
  readonly shared: Shared;
  /** Adds an item; returns its unregister. */
  register(entry: MenuEntry): () => void;
  /** An item mounted or moved: re-read document order. */
  reorder(): void;
  /** A click on an item: it acts, and the menu closes. Disabled items refuse. */
  select(entry: MenuEntry): void;
  /** The pointer is over an item: it becomes the active one unless disabled. */
  hover(entry: MenuEntry): void;
}

const MENU = Symbol('blade-menu');

export function provideMenu<Shared>(menu: MenuContext<Shared>): void {
  setContext(MENU, menu);
}

export function getMenu<Shared>(): MenuContext<Shared> | undefined {
  return getContext<MenuContext<Shared> | undefined>(MENU);
}
