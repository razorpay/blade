import { getContext, setContext } from 'svelte';
import type { ChoiceEntry } from '../base/choice-list.svelte';

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
export interface OptionListContext<T, Shared> {
  readonly shared: Shared;
  /** Native radios of one group, or checkboxes. */
  readonly kind: 'radio' | 'checkbox';
  /** Radios share it: the prop, else the id. */
  readonly name: string;
  readonly isInvalid: boolean;
  /** Adds an item; returns its unregister. A virtual list registers none. */
  register(entry: ChoiceEntry<T>): () => void;
  /** An item mounted or moved: re-read document order. */
  reorder(): void;
  /** The item's position in document order; tracked. */
  indexOf(entry: ChoiceEntry<T>): number;
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

const OPTION_LIST = Symbol('blade-option-list');
const OPTION_ROW = Symbol('blade-option-row');

export function provideOptionList<T, Shared>(
  list: OptionListContext<T, Shared>
): void {
  setContext(OPTION_LIST, list);
}

export function getOptionList<T, Shared>():
  | OptionListContext<T, Shared>
  | undefined {
  return getContext(OPTION_LIST);
}

/** Called by the virtual list's row, around the item it renders. */
export function provideOptionRow<T>(slot: OptionRowSlot<T>): void {
  setContext(OPTION_ROW, slot);
}

export function getOptionRow<T>(): OptionRowSlot<T> | undefined {
  return getContext(OPTION_ROW);
}
