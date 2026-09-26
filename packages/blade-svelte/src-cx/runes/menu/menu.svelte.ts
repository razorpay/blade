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
import { createNodeRef } from '../dom/node.svelte';

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

export interface MenuOptions<T> {
  /** The menu's element id: where the items render. */
  id: string;
  items: () => readonly T[];
  /** The item's text: what typeahead matches. */
  itemLabel: (item: T) => string;
  isItemDisabled: (item: T) => boolean;
  /** A choice is an act: the menu closes and reports it. */
  onSelect: (item: T) => void;
  onOpenChange?: (isOpen: boolean) => void;
}

export interface Menu<T> {
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
  select(item: T): void;
  setActive(index: number): void;
  /** The pointer is over an item: it becomes the active one unless disabled. */
  hoverItem(index: number): void;
  close(): void;
}

/**
 * A menu's disclosure, roving focus and keyboard over the model above.
 * Call during component initialisation.
 */
export function createMenu<T>(options: MenuOptions<T>): Menu<T> {
  const root = createNodeRef<HTMLElement>();

  const model = createMenuModel<T>({
    items: options.items,
    isDisabled: options.isItemDisabled,
    loop: true,
    typeahead: options.itemLabel,
    onSelect: (item) => options.onSelect(item),
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
          document
            .querySelector<HTMLElement>(
              `[id="${options.id}"] [data-index="${index}"]`
            )
            ?.focus({ preventScroll: true });
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
    if (wasOpen && !model.isOpen()) {
      trigger()?.focus({ preventScroll: true });
    }
  }

  return {
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
      // A pointer-opened menu starts on its first item too.
      if (model.isOpen()) {
        model.move('first');
      }
    },
    select: (item) => model.select(item),
    setActive: (index) => model.setActive(index),
    hoverItem(index) {
      if (!options.isItemDisabled(options.items()[index])) {
        model.setActive(index);
      }
    },
    close: () => model.close(),
  };
}
