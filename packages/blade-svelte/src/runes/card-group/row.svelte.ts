import type { Attachment } from 'svelte/attachments';
import { syncChecked } from '../dom/checked';
import { focusWhen } from '../dom/focus';

export interface CardGroupRowOptions {
  isSelected: () => boolean;
  /** The keyboard is on this row: take focus. */
  isActive: () => boolean;
  /** A user pick. Returns whether the option is picked afterwards. */
  onToggle: (event: Event) => boolean;
  /** Focus left the row for somewhere outside it. */
  onBlur: () => void;
}

export interface CardGroupRow {
  handleClick(event: MouseEvent): void;
  /**
   * On the control's `focusout`. Focus moving to another element is a blur
   * (the next row's focus takes it back). Focus going nowhere is a blur only
   * while the row stays in the page: a row that leaves it (a virtual window
   * scrolled it out on a keyboard jump) hands focus to the row that mounts
   * in its place, so the list keeps its focus.
   */
  handleFocusOut(event: FocusEvent): void;
  /**
   * On the control: follows the value when it changes from the outside or
   * another row takes the pick (a user pick is already on the control), and
   * takes focus when the keyboard moves here, which also scrolls it into view.
   */
  readonly attach: Attachment<HTMLInputElement>;
}

/** One row of a CardGroup: a native input per option owns keys and semantics. */
export function createCardGroupRow(options: CardGroupRowOptions): CardGroupRow {
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
    handleFocusOut(event) {
      if (event.relatedTarget) {
        options.onBlur();
        return;
      }
      // The browser blurs a focused node it is removing while it is still
      // attached: wait until the removal is done to tell the two apart.
      const node = event.currentTarget as HTMLElement;
      queueMicrotask(() => {
        if (node.isConnected) {
          options.onBlur();
        }
      });
    },
    attach(node) {
      const undo = write(node);
      follow(node);
      return undo;
    },
  };
}
