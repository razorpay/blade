import { defineContext } from '../context';
import type { ChoiceEntry } from '../base/choice-list.svelte';
import type { EntryHost } from '../base/ordered-entries.svelte';

/** What identifies an item: its `value`, or its position among the items. */
export type CardGroupValue = string | number;

/**
 * One CardGroupItem, as the card group knows it: a choice of the headless
 * choice list, whose element is the header button.
 */
export type CardGroupEntry = ChoiceEntry<CardGroupValue>;

/**
 * What a CardGroup offers the CardGroupItems inside it. `Shared` is the
 * library's own payload from card group to item — checkout hands its class
 * parts and size — and the rune only passes it through.
 */
export interface CardGroupContext<Shared> extends EntryHost<CardGroupEntry> {
  readonly isDisabled: boolean;
  readonly shared: Shared;
  isExpanded(value: CardGroupValue): boolean;
  /** A user press on an expandable item: opens it, or closes it when open. */
  toggle(value: CardGroupValue, event?: Event): void;
  /** Arrows, Home and End from this item's header to another enabled one. */
  moveFocus(entry: CardGroupEntry, key: string): boolean;
}

const CARD_GROUP = defineContext<unknown>('blade-card-group');

export function provideCardGroup<Shared>(cardGroup: CardGroupContext<Shared>): void {
  CARD_GROUP.set(cardGroup);
}

export function getCardGroup<Shared>(): CardGroupContext<Shared> | undefined {
  return CARD_GROUP.get() as CardGroupContext<Shared> | undefined;
}
