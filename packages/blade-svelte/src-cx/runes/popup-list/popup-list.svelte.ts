import { tick } from 'svelte';
import type { Attachment } from 'svelte/attachments';
import type { MoveAction } from '../base/navigable-list.svelte';
import { createOrderedEntries } from '../base/ordered-entries.svelte';
import type { EntryHost, OrderedEntry } from '../base/ordered-entries.svelte';
import { createTrigger } from '../dom/trigger.svelte';
import { createPopupListModel } from './model.svelte';

/** One row of a popup list, as the list knows it: a MenuItem, a DropdownItem. */
export interface PopupEntry extends OrderedEntry {
  /** The row's element id: what `aria-activedescendant` names. */
  readonly id: string;
  isDisabled(): boolean;
  /** Filtered out (a search): the keys skip it and it isn't drawn. */
  isHidden?(): boolean;
  /** What typeahead (and a search) matches. */
  text(): string;
  /** The row was picked: it acts, or its value is held. */
  pick(): void;
}

/** How the active row became active: the keyboard draws a ring, the pointer a fill only. */
export type ActiveBy = 'keyboard' | 'pointer';

export interface PopupListOptions<E extends PopupEntry> {
  /** What the trigger's `aria-controls` names: the panel, or the listbox inside it. */
  id: string;
  /** The panel's element id, when `id` is a list inside it. */
  panelId?: string;
  /** What the trigger opens. */
  haspopup: 'menu' | 'listbox';
  /** The host's open state, when it owns it (a `bind:isOpen`). */
  isOpen?: () => boolean | undefined;
  /** The list opened or closed itself: the bindable write. */
  onValue?: (isOpen: boolean) => void;
  onOpenChange?: (isOpen: boolean) => void;
  /** Whether picking this row closes the list. Default: always. */
  closesOnPick?: (entry: E) => boolean;
  /** After a row's own pick: what the list does with it (a dropdown holds its value). */
  onPick?: (entry: E) => void;
  /** Opening lands here instead of the first row (a dropdown's pick); -1 for the first. */
  landOn?: (entries: readonly E[]) => number;
}

export interface PopupList<E extends PopupEntry> extends EntryHost<E> {
  readonly isOpen: boolean;
  /** The active row's index among the shown rows; -1 for none. */
  readonly activeIndex: number;
  /** The active row's id, for `aria-activedescendant` on the focus owner. */
  readonly activeId: string | undefined;
  /** The rows not filtered out, in document order. */
  readonly shown: readonly E[];
  /** Every row, filtered out or not, in document order. */
  readonly registered: readonly E[];
  /** The trigger's wrapper, once mounted: what the panel hangs from. */
  readonly anchor: HTMLElement | undefined;
  /** On the root: stamps the trigger's aria state, which is the caller's control. */
  readonly root: Attachment<HTMLElement>;
  /**
   * On the element that holds focus while the list is open: the list
   * element, or a search input inside the panel (which then wins). It is
   * focused on open and carries `aria-activedescendant`.
   */
  readonly focusOwner: Attachment<HTMLElement>;
  /** `keyboard` or `pointer` while `entry` is the active row, else undefined. */
  activeBy(entry: E): ActiveBy | undefined;
  /** Keys on the focus owner while open (and on the trigger while closed). */
  handleKey(event: KeyboardEvent): void;
  /** Keys anywhere in the root: only the closed trigger's reach the list. */
  handleRootKeyDown(event: KeyboardEvent): void;
  handleTriggerClick(event: MouseEvent): void;
  /** A click on a row. */
  pick(entry: E): void;
  /** Moves the active row (a search landing on its first match). */
  move(action: MoveAction): void;
  /** The pointer is over a row: it becomes the active one unless disabled. */
  hover(entry: E): void;
  /**
   * Closes the list. Escape hands focus back to the trigger; a press
   * outside leaves it where the press put it.
   */
  close(source?: 'escape' | 'outside'): void;
}

// In a text field (a search) the field keeps its editing keys: Home/End
// move the caret, Space and letters type.
const FIELD_KEYS = new Set(['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Enter', 'Escape', 'Tab']);

const isTextField = (target: EventTarget | null): boolean =>
  target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement;

/**
 * The core Menu and Dropdown share: a list of rows behind a trigger, in a
 * floating panel. Real focus stays on one element (the list, or a search
 * input) and names the active row through `aria-activedescendant`, so a
 * search keeps its caret and rows needn't be focusable. Rows register in
 * document order; arrows, Home/End and typeahead move over the shown,
 * enabled ones; Enter, Space and a click pick. Whether a pick closes the
 * list is the owner's: a menu always, a multiple-choice dropdown never.
 * Call during component initialisation.
 */
export function createPopupList<E extends PopupEntry>(options: PopupListOptions<E>): PopupList<E> {
  const entries = createOrderedEntries<E>();
  const shown = $derived(entries.ordered.filter((entry) => !entry.isHidden?.()));
  let activeBy = $state<ActiveBy>('keyboard');

  const model = createPopupListModel<E>({
    items: () => shown,
    isDisabled: (entry) => entry.isDisabled(),
    loop: true,
    typeahead: (entry) => entry.text(),
    onPick: (entry) => {
      entry.pick();
      options.onPick?.(entry);
    },
    closesOnPick: options.closesOnPick,
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
    popup: options.panelId,
    isExpanded: () => isOpen,
    haspopup: options.haspopup,
  });

  // The focus owner: the list, unless a search input claimed it.
  let list: HTMLElement | undefined;
  let field: HTMLElement | undefined;
  const focusOwner = (): HTMLElement | undefined => field ?? list;

  // A filter that hides the active row leaves nothing active.
  $effect(() => {
    if (activeIndex >= shown.length) {
      model.clearActive();
    }
  });

  // Just opened: it lands on the owner's row (a dropdown's pick), else the
  // first (the last, for ArrowUp) — once the rows have mounted and registered.
  function landOnceOpen(to: 'first' | 'last'): void {
    tick()
      .then(() => {
        if (!model.isOpen() || model.activeIndex() >= 0) {
          return;
        }
        const index = to === 'first' ? options.landOn?.(shown) ?? -1 : -1;
        if (index >= 0) {
          model.setActive(index);
        } else {
          model.move(to);
        }
      })
      .catch(() => undefined);
  }

  const returnFocus = (): void => trigger.control()?.focus({ preventScroll: true });

  function closeAndReturn(wasOpen: boolean): void {
    // Escape, a pick or Tab closed it from inside: back to the trigger.
    if (wasOpen && !model.isOpen()) {
      returnFocus();
    }
  }

  function handleKey(event: KeyboardEvent): void {
    if (isOpen && isTextField(event.target) && !FIELD_KEYS.has(event.key)) {
      return;
    }
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
      activeBy = 'keyboard';
    }
    if (!wasOpen && model.isOpen()) {
      // The keyboard opened it at an end; a pick wins over the first row.
      if (event.key !== 'ArrowUp') {
        model.clearActive();
      }
      landOnceOpen(event.key === 'ArrowUp' ? 'last' : 'first');
    }
    closeAndReturn(wasOpen);
  }

  function focusOnOpen(): void {
    queueMicrotask(() => focusOwner()?.focus({ preventScroll: true }));
  }

  return {
    get isOpen() {
      return isOpen;
    },
    get activeIndex() {
      return activeIndex;
    },
    get activeId() {
      return shown[activeIndex]?.id;
    },
    get shown() {
      return shown;
    },
    get registered() {
      return entries.ordered;
    },
    get anchor() {
      return trigger.anchor;
    },
    root: trigger.attach,
    focusOwner(node) {
      if (isTextField(node)) {
        field = node;
      } else {
        list = node;
      }
      focusOnOpen();
      return () => {
        if (field === node) {
          field = undefined;
        }
        if (list === node) {
          list = undefined;
        }
      };
    },
    register: (entry) => entries.register(entry),
    reorder: () => entries.reorder(),
    indexOf: (entry) => shown.indexOf(entry),
    activeBy(entry) {
      return isOpen && activeIndex >= 0 && shown[activeIndex] === entry ? activeBy : undefined;
    },
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
      // A pointer-opened list starts on its pick, else its first row, too.
      if (model.isOpen()) {
        activeBy = 'pointer';
        landOnceOpen('first');
      }
    },
    move(action) {
      activeBy = 'keyboard';
      model.move(action);
    },
    pick(entry) {
      const wasOpen = model.isOpen();
      model.pick(entry);
      closeAndReturn(wasOpen);
    },
    hover(entry) {
      if (!entry.isDisabled()) {
        activeBy = 'pointer';
        model.setActive(shown.indexOf(entry));
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
