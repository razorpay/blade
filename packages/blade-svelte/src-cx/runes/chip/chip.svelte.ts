import { onDestroy } from 'svelte';
import type { Attachment } from 'svelte/attachments';
import type { ChoiceEntry } from '../base/choice-list.svelte';
import { registerEntry } from '../base/ordered-entries.svelte';
import { syncChecked } from '../dom/checked';
import type { ChipGroupContext } from './context';

export interface ChipOptions {
  /** What the chip stands for in the group's value. */
  value: () => string;
  isDisabled: () => boolean;
}

export interface Chip<Shared> {
  /** The group around the chip; the chip is inert without one. */
  readonly group: ChipGroupContext<Shared> | undefined;
  readonly isChecked: boolean;
  readonly isDisabled: boolean;
  /** Held down (pointer, or Space): Blade shrinks the chip while pressed. */
  readonly isPressed: boolean;
  handleChange(event: Event): void;
  handlePressIn(): void;
  handlePressOut(): void;
  handleKeyDown(event: KeyboardEvent): void;
  handleKeyUp(event: KeyboardEvent): void;
  /** On the input: orders the chip in its group. */
  readonly attach: Attachment<HTMLInputElement>;
  /**
   * On the input: follows the value when it changes from the outside or a
   * sibling radio takes the pick (a user pick is already on the control).
   */
  readonly sync: Attachment<HTMLInputElement>;
}

/**
 * One chip of a ChipGroup. Call during component initialisation; the
 * component passes `getChipGroup()`. It registers, and the group reads it
 * back in document order.
 */
export function createChip<Shared>(
  group: ChipGroupContext<Shared> | undefined,
  options: ChipOptions,
): Chip<Shared> {
  const { entry, attach, unregister } = registerEntry<ChoiceEntry<string>, HTMLInputElement>(
    group,
    {
      value: () => options.value(),
      isDisabled: () => options.isDisabled(),
    },
  );
  onDestroy(unregister);

  const isChecked = $derived(Boolean(group?.isSelected(options.value())));
  const isDisabled = $derived(options.isDisabled() || Boolean(group?.isDisabled));
  let isPressed = $state(false);
  const write = syncChecked(() => isChecked);

  const press = (next: boolean): void => {
    if (!isDisabled) {
      isPressed = next;
    }
  };

  return {
    group,
    get isChecked() {
      return isChecked;
    },
    get isDisabled() {
      return isDisabled;
    },
    get isPressed() {
      return isPressed;
    },
    handleChange(event) {
      const target = event.target as HTMLInputElement;
      const shown =
        !isDisabled && group
          ? group.toggle(options.value(), group.indexOf(entry), event)
          : isChecked;
      if (target.checked !== shown) {
        target.checked = shown;
      }
    },
    handlePressIn: () => press(true),
    handlePressOut: () => press(false),
    handleKeyDown(event) {
      if (event.key === ' ') {
        press(true);
      }
    },
    handleKeyUp(event) {
      if (event.key === ' ') {
        press(false);
      }
    },
    attach,
    sync: write,
  };
}
