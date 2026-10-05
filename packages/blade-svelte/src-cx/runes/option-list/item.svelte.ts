import { onDestroy } from 'svelte';
import type { Attachment } from 'svelte/attachments';
import type { ChoiceEntry } from '../base/choice-list.svelte';
import { registerEntry } from '../base/ordered-entries.svelte';
import type { OptionListContext, OptionRowSlot, OptionState } from './context';

export interface OptionItemOptions<T> {
  /** The option this item picks: what the list's value holds. */
  value: () => T;
  isDisabled: () => boolean;
  /** What typeahead matches; the row's text when absent. */
  text?: () => string | undefined;
}

export interface OptionItem<T, Shared> {
  /** The list around the item; the item is inert without one. */
  readonly list: OptionListContext<T, Shared> | undefined;
  readonly state: OptionState;
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
 * One option of an OptionList. Call during component initialisation; the
 * component passes `getOptionList()` and `getOptionRow()`. Inside a plain
 * list the item registers, and the list reads it back in document order —
 * so headings, notes and buttons may sit between items. Inside a virtual
 * list the row slot hands it its option and place instead: the list owns
 * its options as data.
 */
export function createOptionItem<T, Shared>(
  list: OptionListContext<T, Shared> | undefined,
  slot: OptionRowSlot<T> | undefined,
  options: OptionItemOptions<T>,
): OptionItem<T, Shared> {
  // A virtual list's row slot places the item: it registers nowhere.
  const { entry, attach, unregister } = registerEntry<ChoiceEntry<T>>(slot ? undefined : list, {
    value: () => options.value(),
    isDisabled: () => options.isDisabled(),
    text: () => options.text?.(),
  });
  onDestroy(unregister);

  const index = $derived(slot ? slot.index : list?.indexOf(entry) ?? 0);
  const option = $derived(slot ? slot.option : options.value());
  const listed = $derived(
    list?.stateOf(option, index) ?? {
      index,
      isSelected: false,
      isDisabled: false,
    },
  );
  // In a virtual list the data decides what the keyboard skips; the item's
  // own flag can only grey its row.
  const state: OptionState = $derived({
    ...listed,
    isDisabled: listed.isDisabled || options.isDisabled(),
  });
  const isTabStop = $derived(slot ? slot.isTabStop : Boolean(list?.isTabStop(index)));

  return {
    list,
    get state() {
      return state;
    },
    get isActive() {
      return Boolean(list?.isActive(index));
    },
    get isTabStop() {
      return isTabStop;
    },
    toggle(event) {
      return list ? list.toggle(option, index, event) : state.isSelected;
    },
    handleFocus() {
      list?.handleFocusIn();
      list?.setActive(index);
    },
    attach,
  };
}
