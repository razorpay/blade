import type { Attachment } from 'svelte/attachments';
import { focusableWithin } from '../dom/focus';
import { createNodeRef } from '../dom/node.svelte';

export interface PopoverOptions {
  /** The panel's element id: what the trigger controls. */
  id: string;
  isOpen: () => boolean;
  /** The bindable write. */
  onValue: (isOpen: boolean) => void;
  onOpenChange?: (isOpen: boolean) => void;
  isDisabled: () => boolean;
}

export interface Popover {
  /** The trigger's wrapper, once mounted: what the panel hangs from. */
  readonly anchor: HTMLElement | undefined;
  /** On the root: stamps the trigger's aria state, which is the caller's control. */
  readonly root: Attachment<HTMLElement>;
  handleClick(event: MouseEvent): void;
  close(): void;
}

/** A popover's open state and the trigger's aria wiring. Call during component initialisation. */
export function createPopover(options: PopoverOptions): Popover {
  const root = createNodeRef<HTMLElement>();

  function set(next: boolean) {
    if (next !== options.isOpen() && !(next && options.isDisabled())) {
      options.onValue(next);
      options.onOpenChange?.(next);
    }
  }

  return {
    get anchor() {
      return root.current;
    },
    root(node) {
      const undo = root.attach(node);
      const trigger = focusableWithin(node)[0] ?? node;
      const isOpen = options.isOpen();
      trigger.setAttribute('aria-haspopup', 'dialog');
      trigger.setAttribute('aria-expanded', String(isOpen));
      if (isOpen) {
        trigger.setAttribute('aria-controls', options.id);
      } else {
        trigger.removeAttribute('aria-controls');
      }
      return undo;
    },
    handleClick(event) {
      // Native renders the panel in here: a press inside it is not the trigger's.
      if (!(event.target as Element).closest(`[id="${options.id}"]`)) {
        set(!options.isOpen());
      }
    },
    close: () => set(false),
  };
}
