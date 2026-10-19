import { defineContext } from '../context';
import type { ChoiceEntry } from '../base/choice-list.svelte';
import type { EntryHost } from '../base/ordered-entries.svelte';

/** What an option learns about itself. */
export interface CardGroupItemState {
  index: number;
  isSelected: boolean;
  isDisabled: boolean;
}

/**
 * What a CardGroup offers the CardGroupItems inside it. `Shared` is the
 * library's own payload from list to item — checkout hands its class parts
 * and the test id — and the rune only passes it through.
 */
export interface CardGroupContext<T, Shared> extends EntryHost<ChoiceEntry<T>> {
  readonly shared: Shared;
  /** Native radios of one group, or checkboxes. */
  readonly kind: 'radio' | 'checkbox';
  /** Radios share it: the prop, else the id. */
  readonly name: string;
  readonly isInvalid: boolean;
  stateOf(option: T, index: number): CardGroupItemState;
  /** The keyboard is on this option, and is what moved there: draw it, take focus. */
  isActive(index: number): boolean;
  /** The list's one tab stop among the registered items. */
  isTabStop(index: number): boolean;
  /** A user pick. Returns whether the option is picked afterwards. */
  toggle(option: T, index: number, event: Event): boolean;
  /** Focus landed on an option (Tab, a click): the keyboard continues from it. */
  setActive(index: number): void;
  /**
   * The list holds its options as data (`items`): an item finds its place
   * among them instead of registering, so anything — a heading, a section,
   * a virtual window — may sit around and between the items.
   */
  readonly isData: boolean;
  /** Data only: the option's place among the items; -1 when it is not one. */
  indexOfOption(option: T): number;
  /**
   * Data only: an item's row is mounted at `index` (a virtual window mounts
   * a slice); the tab stop is picked among the mounted rows. Returns the
   * unmount.
   */
  mountRow(index: number, element: () => HTMLElement | undefined): () => void;
  /** The list's keys, on each option's control: other children keep theirs. */
  handleKeyDown(event: KeyboardEvent): void;
  handleFocusIn(): void;
  handleFocusOut(): void;
}

const CARD_GROUP = defineContext<unknown>('blade-card-group');

export function provideCardGroup<T, Shared>(list: CardGroupContext<T, Shared>): void {
  CARD_GROUP.set(list);
}

export function getCardGroup<T, Shared>(): CardGroupContext<T, Shared> | undefined {
  return CARD_GROUP.get() as CardGroupContext<T, Shared> | undefined;
}
