import { onDestroy } from 'svelte';
import type { Attachment } from 'svelte/attachments';
import type { ChoiceEntry } from '../base/choice-list.svelte';
import { registerEntry } from '../base/ordered-entries.svelte';
import type { CardGroupContext, CardGroupItemState } from './context';

export interface CardGroupItemOptions<T> {
  /** The option this item picks: what the list's value holds. */
  value: () => T;
  isDisabled: () => boolean;
  /** What typeahead matches; the row's text when absent. */
  text?: () => string | undefined;
}

export interface CardGroupItem<T, Shared> {
  /** The list around the item; the item is inert without one. */
  readonly list: CardGroupContext<T, Shared> | undefined;
  readonly state: CardGroupItemState;
  /** The keyboard is on this row: draw it, and take focus. */
  readonly isActive: boolean;
  readonly isTabStop: boolean;
  /** A user pick. Returns whether the option is picked afterwards. */
  toggle(event: Event): boolean;
  /** Focus landed on the row (Tab, a click): the keyboard continues from it. */
  handleFocus(): void;
  /** On the row: how the list orders and focuses the item. */
  readonly attach: Attachment<HTMLElement>;
}

/**
 * One option of a CardGroup. Call during component initialisation; the
 * component passes `getCardGroup()`. Inside a list of registered items it
 * registers, and the list reads it back in document order — so headings,
 * notes and buttons may sit between items. Inside a list that holds its
 * items as data it finds its place among them by its value, and marks its
 * row mounted while it is.
 */
export function createCardGroupItem<T, Shared>(
  list: CardGroupContext<T, Shared> | undefined,
  options: CardGroupItemOptions<T>,
): CardGroupItem<T, Shared> {
  const isData = Boolean(list?.isData);
  const registered = registerEntry<ChoiceEntry<T>>(isData ? undefined : list, {
    value: () => options.value(),
    isDisabled: () => options.isDisabled(),
    text: () => options.text?.(),
  });
  onDestroy(registered.unregister);

  const option = $derived(options.value());
  const index = $derived(
    isData ? list?.indexOfOption(option) ?? -1 : list?.indexOf(registered.entry) ?? 0,
  );
  $effect(() => {
    if (isData && list && index >= 0) {
      return list.mountRow(index, () => registered.node);
    }
    return undefined;
  });
  const listed = $derived(
    list?.stateOf(option, index) ?? {
      index,
      isSelected: false,
      isDisabled: false,
    },
  );
  // In a list of data the data decides what the keyboard skips; the item's
  // own flag can only grey its row.
  const state: CardGroupItemState = $derived({
    ...listed,
    isDisabled: listed.isDisabled || options.isDisabled(),
  });

  return {
    list,
    get state() {
      return state;
    },
    get isActive() {
      return Boolean(list?.isActive(index));
    },
    get isTabStop() {
      return Boolean(list?.isTabStop(index));
    },
    toggle(event) {
      return list ? list.toggle(option, index, event) : state.isSelected;
    },
    handleFocus() {
      list?.handleFocusIn();
      list?.setActive(index);
    },
    attach: registered.attach,
  };
}
