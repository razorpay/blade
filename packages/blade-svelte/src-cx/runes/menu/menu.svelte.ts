import { createPopupListModel } from '../popup-list/model.svelte';
import type { PopupListModel, PopupListModelOptions } from '../popup-list/model.svelte';
import { createPopupList } from '../popup-list/popup-list.svelte';
import type { PopupList } from '../popup-list/popup-list.svelte';
import type { MenuContext, MenuEntry } from './context';

export interface MenuModelOptions<T> extends Omit<PopupListModelOptions<T>, 'onPick' | 'closesOnPick'> {
  onSelect?: (item: T) => void;
  /** Default true. */
  closeOnSelect?: boolean;
}

/** A menu's choices are momentary (choose = act): there is no selection to hold. */
export interface MenuModel<T> extends PopupListModel<T> {
  /** A click on an item: it emits `onSelect`, then the menu closes. Disabled items refuse. */
  select(item: T): void;
}

/** The popup-list model with a menu's words: every pick acts and closes. */
export function createMenuModel<T>(options: MenuModelOptions<T>): MenuModel<T> {
  const closeOnSelect = options.closeOnSelect ?? true;
  const model = createPopupListModel<T>({
    ...options,
    onPick: options.onSelect,
    closesOnPick: () => closeOnSelect,
  });
  return { ...model, select: model.pick };
}

export interface MenuOptions<Shared> {
  /** The menu's element id: where the items render. */
  id: string;
  /** The host's open state, when it owns it (a `bind:isOpen`). */
  isOpen?: () => boolean | undefined;
  /** The menu opened or closed itself: the bindable write. */
  onValue?: (isOpen: boolean) => void;
  onOpenChange?: (isOpen: boolean) => void;
  /** Handed to every item as is. */
  shared: () => Shared;
}

export interface Menu<Shared> extends MenuContext<Shared>, PopupList<MenuEntry> {}

/**
 * A menu: the popup list (`createPopupList`) whose rows act — every pick
 * closes it and hands focus back to the trigger. Call during component
 * initialisation; the component provides the result to its MenuItems
 * (`provideMenu`).
 */
export function createMenu<Shared>(options: MenuOptions<Shared>): Menu<Shared> {
  const list = createPopupList<MenuEntry>({
    id: options.id,
    haspopup: 'menu',
    isOpen: options.isOpen,
    onValue: options.onValue,
    onOpenChange: options.onOpenChange,
  });
  return Object.defineProperty(list, 'shared', { get: options.shared }) as Menu<Shared>;
}
