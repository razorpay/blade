import { defineContext } from '../context';
import type { ChoiceEntry } from '../base/choice-list.svelte';
import type { EntryHost } from '../base/ordered-entries.svelte';

/** What an option learns about itself. */
export interface OptionState {
  index: number;
  isSelected: boolean;
  isDisabled: boolean;
}

/**
 * What an OptionList offers the OptionItems inside it. `Shared` is the
 * library's own payload from list to item — checkout hands its class parts
 * and the test id — and the rune only passes it through.
 */
export interface OptionListContext<T, Shared>
  extends EntryHost<ChoiceEntry<T>> {
  readonly shared: Shared;
  /** Native radios of one group, or checkboxes. */
  readonly kind: 'radio' | 'checkbox';
  /** Radios share it: the prop, else the id. */
  readonly name: string;
  readonly isInvalid: boolean;
  stateOf(option: T, index: number): OptionState;
  /** The keyboard is on this option, and is what moved there: draw it, take focus. */
  isActive(index: number): boolean;
  /** The list's one tab stop among the registered items. */
  isTabStop(index: number): boolean;
  /** A user pick. Returns whether the option is picked afterwards. */
  toggle(option: T, index: number, event: Event): boolean;
  /** Focus landed on an option (Tab, a click): the keyboard continues from it. */
  setActive(index: number): void;
  /** The list's keys, on each option's control: other children keep theirs. */
  handleKeyDown(event: KeyboardEvent): void;
  handleFocusIn(): void;
  handleFocusOut(): void;
}

/**
 * One row of a virtual list, which owns its options as data: the item
 * inside the row takes its option and place from here instead of
 * registering. `isTabStop` is decided per mounted slice.
 */
export interface OptionRowSlot<T> {
  readonly option: T;
  readonly index: number;
  readonly isTabStop: boolean;
}

const OPTION_LIST = defineContext<unknown>('blade-option-list');
const OPTION_ROW = defineContext<unknown>('blade-option-row');

export function provideOptionList<T, Shared>(
  list: OptionListContext<T, Shared>
): void {
  OPTION_LIST.set(list);
}

export function getOptionList<T, Shared>():
  | OptionListContext<T, Shared>
  | undefined {
  return OPTION_LIST.get() as OptionListContext<T, Shared> | undefined;
}

/** Called by the virtual list's row, around the item it renders. */
export function provideOptionRow<T>(slot: OptionRowSlot<T>): void {
  OPTION_ROW.set(slot);
}

export function getOptionRow<T>(): OptionRowSlot<T> | undefined {
  return OPTION_ROW.get() as OptionRowSlot<T> | undefined;
}
