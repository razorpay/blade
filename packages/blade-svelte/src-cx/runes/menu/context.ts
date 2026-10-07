import { defineContext } from '../context';
import type { PopupListHost } from '../popup-list/item.svelte';
import type { PopupEntry } from '../popup-list/popup-list.svelte';

/** One MenuItem, as the menu knows it: a popup-list row whose pick acts. */
export type MenuEntry = PopupEntry;

/**
 * What a Menu offers the MenuItems inside it. `Shared` is the library's own
 * payload from menu to item — checkout hands its class parts and the menu's
 * `onSelect` — and the rune only passes it through.
 */
export interface MenuContext<Shared> extends PopupListHost<MenuEntry> {
  readonly shared: Shared;
}

const MENU = defineContext<unknown>('blade-menu');

export function provideMenu<Shared>(menu: MenuContext<Shared>): void {
  MENU.set(menu);
}

export function getMenu<Shared>(): MenuContext<Shared> | undefined {
  return MENU.get() as MenuContext<Shared> | undefined;
}
