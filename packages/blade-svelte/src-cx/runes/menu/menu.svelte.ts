import { tick } from 'svelte';
import type { Attachment } from 'svelte/attachments';
import { discloseList, type DisclosedList } from '../base/disclosed-list';
import type { DisclosureOptions } from '../base/disclosure';
import {
  createNavigableList,
  dispatchListKey,
  type NavigableListModel,
  type NavigableListOptions,
} from '../base/navigable-list.svelte';
import { createOrderedEntries } from '../base/ordered-entries.svelte';
import { createTrigger } from '../dom/trigger.svelte';
import type { MenuContext, MenuEntry } from './context';

export interface MenuModelOptions<T> extends NavigableListOptions<T> {
  onSelect?: (item: T) => void;
  /** Default true. */
  closeOnSelect?: boolean;
  disclosure?: DisclosureOptions;
}

/**
 * A menu's choices are momentary (choose = act): there is no selection to
 * hold, only the active item the keyboard is on.
 */
export interface MenuModel<T> extends NavigableListModel<T>, DisclosedList {
  /** A click on an item: it emits `onSelect`, then the menu closes. Disabled items refuse. */
  select(item: T): void;
}

/**
 * A navigable list whose choices are momentary, behind a disclosure.
 * Closed: ArrowDown/ArrowUp/Enter/Space open it; open: the list keys.
 */
export function createMenuModel<T>(options: MenuModelOptions<T>): MenuModel<T> {
  const closeOnSelect = options.closeOnSelect ?? true;
  const list = createNavigableList<T>(options);

  function select(item: T): void {
    const index = options.items().indexOf(item);
    if (index >= 0 && options.isDisabled?.(item, index)) {
      return;
    }
    // Activate first: the close below clears the active item, and
    // activating after it would resurrect it.
    list.setActive(index);
    options.onSelect?.(item);
    if (closeOnSelect) {
      disclosed.disclosure.close('trigger');
    }
  }

  const disclosed = discloseList(
    {
      ...list,
      handleKey: (key, mods) =>
        dispatchListKey(list, key, mods, () => {
          const active = list.active();
          if (active !== undefined) {
            select(active);
          }
        }),
    },
    options.disclosure
  );

  return { ...list, ...disclosed, select };
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

export interface Menu<Shared> extends MenuContext<Shared> {
  readonly isOpen: boolean;
  readonly activeIndex: number;
  /** The trigger's wrapper, once mounted: what the menu hangs from. */
  readonly anchor: HTMLElement | undefined;
  /** On the root: stamps the trigger's aria state, which is the caller's control. */
  readonly root: Attachment<HTMLElement>;
  /** Keys on the trigger while closed, and on the menu while open. */
  handleKey(event: KeyboardEvent): void;
  /** Keys anywhere in the root: only the closed trigger's reach the menu. */
  handleRootKeyDown(event: KeyboardEvent): void;
  handleTriggerClick(event: MouseEvent): void;
  /**
   * Closes the menu. Escape hands focus back to the trigger; a press
   * outside leaves it where the press put it.
   */
  close(source?: 'escape' | 'outside'): void;
}

/**
 * A menu's disclosure, roving focus and keyboard over the model above. Its
 * items are the MenuItems that register inside the open menu, read back in
 * document order, so headings and dividers may sit between them. Call
 * during component initialisation; the component provides the result to its
 * MenuItems (`provideMenu`).
 */
export function createMenu<Shared>(options: MenuOptions<Shared>): Menu<Shared> {
  const entries = createOrderedEntries<MenuEntry>();

  const model = createMenuModel<MenuEntry>({
    items: () => entries.ordered,
    isDisabled: (entry) => entry.isDisabled(),
    loop: true,
    typeahead: (entry) => entry.text(),
    onSelect: (entry) => entry.select(),
    disclosure: {
      open: options.isOpen,
      onOpenChange: (open) => {
        options.onValue?.(open);
        options.onOpenChange?.(open);
      },
    },
  });

  const isOpen = $derived(model.isOpen());
  const activeIndex = $derived(model.activeIndex());
  const trigger = createTrigger({
    controls: options.id,
    isExpanded: () => isOpen,
    haspopup: 'menu',
  });

  // Roving focus: the active item is the focused one.
  $effect(() => {
    const index = activeIndex;
    if (isOpen && index >= 0) {
      tick()
        .then(() => {
          entries.ordered[index]?.getElement()?.focus({ preventScroll: true });
        })
        .catch(() => undefined);
    }
  });

  // Just opened: it lands on the first item (the last, for ArrowUp) — once
  // the items have mounted and registered.
  function landOnceOpen(to: 'first' | 'last') {
    tick()
      .then(() => {
        if (model.isOpen() && model.activeIndex() < 0) {
          model.move(to);
        }
      })
      .catch(() => undefined);
  }

  const returnFocus = () => trigger.control()?.focus({ preventScroll: true });

  function handleKey(event: KeyboardEvent) {
    const wasOpen = model.isOpen();
    const action = model.handleKey(event.key, {
      alt: event.altKey,
      ctrl: event.ctrlKey,
      meta: event.metaKey,
    });
    if (action) {
      event.preventDefault();
      // Handled here: the layers' Escape must not close what lies beneath.
      event.stopPropagation();
    }
    if (!wasOpen && model.isOpen() && model.activeIndex() < 0) {
      landOnceOpen(event.key === 'ArrowUp' ? 'last' : 'first');
    }
    // Escape, a choice or Tab closed it from the keyboard: back to the trigger.
    if (wasOpen && !model.isOpen()) {
      returnFocus();
    }
  }

  return {
    get shared() {
      return options.shared();
    },
    get isOpen() {
      return isOpen;
    },
    get activeIndex() {
      return activeIndex;
    },
    get anchor() {
      return trigger.anchor;
    },
    root: trigger.attach,
    register: (entry) => entries.register(entry),
    reorder: () => entries.reorder(),
    handleKey,
    handleRootKeyDown(event) {
      // Closed: arrows, Enter and Space on the trigger open it.
      if (!isOpen && event.target === trigger.control()) {
        handleKey(event);
      }
    },
    handleTriggerClick(event) {
      if (trigger.isInside(event)) {
        return;
      }
      model.toggle();
      // A pointer-opened menu starts on its first item too.
      if (model.isOpen()) {
        landOnceOpen('first');
      }
    },
    select: (entry) => model.select(entry),
    hover(entry) {
      if (!entry.isDisabled()) {
        model.setActive(entries.indexOf(entry));
      }
    },
    close(source) {
      model.close();
      if (source === 'escape') {
        returnFocus();
      }
    },
  };
}
