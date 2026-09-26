import type { Attachment } from 'svelte/attachments';
import { syncChecked } from '../dom/checked';
import { focusWhen } from '../dom/focus';

export interface OptionRowOptions {
  isSelected: () => boolean;
  /** The keyboard is on this row: take focus. */
  isActive: () => boolean;
  /** A user pick. Returns whether the option is picked afterwards. */
  onToggle: (event: Event) => boolean;
}

export interface OptionRow {
  handleClick(event: MouseEvent): void;
  /**
   * On the control: follows the value when it changes from the outside or
   * another row takes the pick (a user pick is already on the control), and
   * takes focus when the keyboard moves here, which also scrolls it into view.
   */
  readonly attach: Attachment<HTMLInputElement>;
}

/** One web row of an OptionList: a native input per option owns keys and semantics. */
export function createOptionRow(options: OptionRowOptions): OptionRow {
  const write = syncChecked(options.isSelected);
  const follow = focusWhen(options.isActive);
  return {
    // `click`, not `change`: picking the picked radio again changes nothing on
    // the platform, yet it is how a deselectable choice is cleared.
    handleClick(event) {
      const target = event.target as HTMLInputElement;
      const shown = options.onToggle(event);
      if (target.checked !== shown) {
        target.checked = shown;
      }
    },
    attach(node) {
      const undo = write(node);
      follow(node);
      return undo;
    },
  };
}
