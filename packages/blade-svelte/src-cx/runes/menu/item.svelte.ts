import { createPopupItem } from '../popup-list/item.svelte';
import type { PopupItem, PopupItemOptions } from '../popup-list/item.svelte';
import type { MenuContext, MenuEntry } from './context';

export type MenuItemOptions = PopupItemOptions;

export interface MenuItem<Shared> extends PopupItem<MenuEntry> {
  /** The menu around the item; the item is inert without one. */
  readonly menu: MenuContext<Shared> | undefined;
}

/**
 * One item of a Menu: a popup-list row (`createPopupItem`). Call during
 * component initialisation; the component passes `getMenu()`.
 */
export function createMenuItem<Shared>(
  menu: MenuContext<Shared> | undefined,
  options: MenuItemOptions,
): MenuItem<Shared> {
  const item = createPopupItem<MenuEntry>(menu, options);
  return Object.assign(item, { menu });
}
