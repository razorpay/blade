import { onDestroy } from 'svelte';
import type { Attachment } from 'svelte/attachments';
import { syncChecked } from '../dom/checked';
import type { RadioGroupContext } from './context';

export interface RadioOptions {
  /** What the group's `value` becomes when this radio is picked. Fixed at mount. */
  value: () => string;
  isDisabled: () => boolean;
}

export interface Radio<Shared> {
  /** The group's; undefined outside one, where the radio is inert. */
  readonly name: string | undefined;
  readonly isSelected: boolean;
  /** Its own, or the group's. */
  readonly isDisabled: boolean;
  readonly pick: 'picked' | 'unpicked';
  readonly tone: 'default' | 'invalid';
  readonly shared: Shared | undefined;
  handleChange(event: Event): void;
  /**
   * On the input: writes `checked` back when a pick was refused or the value
   * changed from the outside, and is how the group finds the element.
   */
  readonly sync: Attachment<HTMLInputElement>;
}

/**
 * One radio in a group. Call during component initialisation; a component
 * that carries the group by context passes `getRadioGroup()`.
 */
export function createRadio<Shared>(
  group: RadioGroupContext<Shared> | undefined,
  options: RadioOptions
): Radio<Shared> {
  let node: HTMLInputElement | undefined;
  if (group) {
    onDestroy(group.register(options.value(), () => node));
  }

  const isSelected = $derived(Boolean(group?.isSelected(options.value())));
  const isDisabled = $derived(
    options.isDisabled() || Boolean(group?.isDisabled)
  );
  const write = syncChecked(() => isSelected);

  return {
    get name() {
      return group?.name;
    },
    get isSelected() {
      return isSelected;
    },
    get isDisabled() {
      return isDisabled;
    },
    get pick() {
      return isSelected ? 'picked' : 'unpicked';
    },
    get tone() {
      return group?.isInvalid ? 'invalid' : 'default';
    },
    get shared() {
      return group?.shared;
    },
    handleChange(event) {
      const target = event.target as HTMLInputElement;
      const held =
        !isDisabled && Boolean(group?.select(options.value(), event));
      if (!held) {
        target.checked = isSelected;
      }
    },
    sync(element) {
      node = element;
      const undo = write(element);
      return () => {
        undo?.();
        node = undefined;
      };
    },
  };
}
