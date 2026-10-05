import { onDestroy } from 'svelte';
import type { Attachment } from 'svelte/attachments';
import type { MenuContext, MenuEntry } from './context';

export interface MenuItemOptions {
  isDisabled: () => boolean;
  /** What typeahead matches; the item's text when absent. */
  text: () => string | undefined;
  /** The item was chosen. */
  onSelect: () => void;
}

export interface MenuItem<Shared> {
  /** The menu around the item; the item is inert without one. */
  readonly menu: MenuContext<Shared> | undefined;
  handleClick(): void;
  handlePointerMove(): void;
  /** On the item: how the menu orders and focuses it. */
  readonly attach: Attachment<HTMLElement>;
}

/**
 * One item of a Menu. Call during component initialisation; the component
 * passes `getMenu()`. It registers while the menu is open — the items only
 * mount then — and the menu reads it back in document order.
 */
export function createMenuItem<Shared>(
  menu: MenuContext<Shared> | undefined,
  options: MenuItemOptions,
): MenuItem<Shared> {
  let node: HTMLElement | undefined;
  const entry: MenuEntry = {
    isDisabled: () => options.isDisabled(),
    text: () => options.text() ?? node?.textContent?.trim() ?? '',
    select: () => options.onSelect(),
    getElement: () => node,
  };
  if (menu) {
    onDestroy(menu.register(entry));
  }
  return {
    menu,
    handleClick() {
      menu?.select(entry);
    },
    handlePointerMove() {
      menu?.hover(entry);
    },
    attach(element) {
      node = element;
      menu?.reorder();
      return () => {
        node = undefined;
      };
    },
  };
}
