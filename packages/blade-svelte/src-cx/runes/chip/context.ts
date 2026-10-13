import { defineContext } from '../context';
import type { ChoiceEntry } from '../base/choice-list.svelte';
import type { EntryHost } from '../base/ordered-entries.svelte';

/**
 * What a ChipGroup offers the Chips inside it. `Shared` is the library's own
 * payload from group to chip — checkout hands its size and colour — and the
 * rune only passes it through.
 */
export interface ChipGroupContext<Shared> extends EntryHost<ChoiceEntry<string>> {
  readonly shared: Shared;
  /** Native radios of one group (`single`), or checkboxes (`multiple`). */
  readonly kind: 'radio' | 'checkbox';
  /** The inputs share it: the prop, else the id. */
  readonly name: string;
  readonly isDisabled: boolean;
  readonly isRequired: boolean;
  readonly isInvalid: boolean;
  isSelected(value: string): boolean;
  /** A user pick. Returns whether the chip is picked afterwards. */
  toggle(value: string, index: number, event: Event): boolean;
}

const CHIP_GROUP = defineContext<unknown>('blade-chip-group');

export function provideChipGroup<Shared>(group: ChipGroupContext<Shared>): void {
  CHIP_GROUP.set(group);
}

export function getChipGroup<Shared>(): ChipGroupContext<Shared> | undefined {
  return CHIP_GROUP.get() as ChipGroupContext<Shared> | undefined;
}
