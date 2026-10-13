import { defineContext } from '../context';
import type { ChoiceEntry } from '../base/choice-list.svelte';
import type { EntryHost } from '../base/ordered-entries.svelte';

/**
 * What a RadioGroup offers the Radios inside it. `Shared` is the library's
 * own payload from group to radio — checkout hands the radio's class parts,
 * another skin might hand a size — and the rune only passes it through.
 */
export interface RadioGroupContext<Shared> extends EntryHost<ChoiceEntry<string>> {
  /** Radios share it: that is what makes them exclusive. */
  readonly name: string;
  readonly isDisabled: boolean;
  readonly isInvalid: boolean;
  readonly shared: Shared;
  isSelected(value: string): boolean;
  /** A user pick. Returns whether it held. */
  select(value: string, event: Event): boolean;
}

const RADIO_GROUP = defineContext<unknown>('blade-radio-group');

export function provideRadioGroup<Shared>(group: RadioGroupContext<Shared>): void {
  RADIO_GROUP.set(group);
}

export function getRadioGroup<Shared>(): RadioGroupContext<Shared> | undefined {
  return RADIO_GROUP.get() as RadioGroupContext<Shared> | undefined;
}
