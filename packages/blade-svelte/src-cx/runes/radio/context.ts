import { getContext, setContext } from 'svelte';

/**
 * What a RadioGroup offers the Radios inside it. `Shared` is the library's
 * own payload from group to radio — checkout hands the radio's class parts,
 * another skin might hand a size — and the rune only passes it through.
 */
export interface RadioGroupContext<Shared> {
  /** Radios share it: that is what makes them exclusive. */
  readonly name: string;
  readonly isDisabled: boolean;
  readonly isInvalid: boolean;
  readonly shared: Shared;
  isSelected(value: string): boolean;
  /** A user pick. Returns whether it held. */
  select(value: string, event: Event): boolean;
  /** Lets the group focus a radio when the form reveals it. Returns the undo. */
  register(
    value: string,
    getElement: () => HTMLElement | undefined
  ): () => void;
}

const RADIO_GROUP = Symbol('blade-radio-group');

export function provideRadioGroup<Shared>(
  group: RadioGroupContext<Shared>
): void {
  setContext(RADIO_GROUP, group);
}

export function getRadioGroup<Shared>(): RadioGroupContext<Shared> | undefined {
  return getContext<RadioGroupContext<Shared> | undefined>(RADIO_GROUP);
}
