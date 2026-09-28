import { tick } from 'svelte';
import type { Attachment } from 'svelte/attachments';
import { focusableWithin } from '../dom/focus';
import { discloseList, type DisclosedList } from '../base/disclosed-list';
import type { DisclosureOptions } from '../base/disclosure';
import {
  createOptionListCore,
  type OptionListCore,
  type OptionListCoreOptions,
} from '../base/option-list';
import { createOrderedEntries } from '../base/ordered-entries.svelte';
import { createNodeRef } from '../dom/node.svelte';
import type { MenuContext, MenuEntry } from './context';

export interface MenuModelOptions<T> extends Omit<
  OptionListCoreOptions<T>,
  'value' | 'defaultValue' | 'onChange' | 'strictOption'
> {
  onSelect?: (item: T) => void;
  /** Default true. */
  closeOnSelect?: boolean;
  disclosure?: DisclosureOptions;
}

/**
 * A menu's choices are momentary (choose = act), so the option-list
 * selection surface (`selected`, `isSelected`, `optionState`, …) is not
 * exposed: it would always read empty. `select` stays as the click entry
 * point; it emits `onSelect` and closes.
 */
export interface MenuModel<T>
  extends
    Omit<
      OptionListCore<T>,
      'selected' | 'selectedIndex' | 'isSelected' | 'optionState' | 'handleKey'
    >,
    DisclosedList {}

/**
 * An option list whose selection is momentary, behind a disclosure. Closed:
 * ArrowDown/ArrowUp/Enter/Space open it; open: the list keys.
 */
export function createMenuModel<T>(options: MenuModelOptions<T>): MenuModel<T> {
  const closeOnSelect = options.closeOnSelect ?? true;
  // Assigned below; a choice only ever lands after construction.
  let disclosed: DisclosedList;
  const list = createOptionListCore<T>({
    ...options,
    // Always controlled to "nothing selected", so every choice emits.
    value: () => null,
    onChange: (item) => {
      if (item !== null) {
        options.onSelect?.(item);
        if (closeOnSelect) {
          disclosed.disclosure.close('trigger');
        }
      }
    },
  });
  disclosed = discloseList(list, options.disclosure);

  return { ...list, ...disclosed };
}

export interface MenuOptions<Shared> {
  /** The menu's element id: where the items render. */
  id: string;
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
  const root = createNodeRef<HTMLElement>();
  const entries = createOrderedEntries<MenuEntry>();

  const model = createMenuModel<MenuEntry>({
    items: () => entries.ordered,
    isDisabled: (entry) => entry.isDisabled(),
    loop: true,
    typeahead: (entry) => entry.text(),
    onSelect: (entry) => entry.select(),
    disclosure: { onOpenChange: (open) => options.onOpenChange?.(open) },
  });

  const isOpen = $derived(model.isOpen());
  const activeIndex = $derived(model.activeIndex());

  const trigger = () => {
    const node = root.current;
    return node && (focusableWithin(node)[0] ?? node);
  };

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

  function handleKey(event: KeyboardEvent) {
    const wasOpen = model.isOpen();
    const action = model.handleKey(event.key, {
      alt: event.altKey,
      ctrl: event.ctrlKey,
      meta: event.metaKey,
    });
    if (action) {
      event.preventDefault();
      event.stopPropagation();
    }
    // Opened from the keyboard: it lands on the first item (the last, for
    // ArrowUp) — once the items have mounted and registered.
    if (!wasOpen && model.isOpen() && model.activeIndex() < 0) {
      const to = event.key === 'ArrowUp' ? 'last' : 'first';
      tick()
        .then(() => {
          if (model.isOpen() && model.activeIndex() < 0) {
            model.move(to);
          }
        })
        .catch(() => undefined);
    }
    if (wasOpen && !model.isOpen()) {
      trigger()?.focus({ preventScroll: true });
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
      return root.current;
    },
    root(node) {
      const undo = root.attach(node);
      const control = focusableWithin(node)[0] ?? node;
      control.setAttribute('aria-haspopup', 'menu');
      control.setAttribute('aria-expanded', String(isOpen));
      return undo;
    },
    register: (entry) => entries.register(entry),
    reorder: () => entries.reorder(),
    handleKey,
    handleRootKeyDown(event) {
      // Closed: arrows, Enter and Space on the trigger open it.
      if (!isOpen && event.target === trigger()) {
        handleKey(event);
      }
    },
    handleTriggerClick(event) {
      if ((event.target as Element).closest(`[id="${options.id}"]`)) {
        return;
      }
      model.toggle();
      // A pointer-opened menu starts on its first item too — once the items
      // have mounted and registered.
      if (model.isOpen()) {
        tick()
          .then(() => {
            if (model.isOpen() && model.activeIndex() < 0) {
              model.move('first');
            }
          })
          .catch(() => undefined);
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
        trigger()?.focus({ preventScroll: true });
      }
    },
  };
}
