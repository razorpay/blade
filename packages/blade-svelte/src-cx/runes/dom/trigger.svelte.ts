import type { Attachment } from 'svelte/attachments';
import { focusableWithin } from './focus';
import { createNodeRef } from './node.svelte';

export interface TriggerOptions {
  /** The id of what the trigger shows: `aria-controls` points at it while it is shown. */
  controls: string;
  isExpanded: () => boolean;
  /**
   * The id of the whole popup, when what it controls sits inside it (a
   * dropdown's listbox in its panel): presses there aren't the trigger's.
   * Defaults to `controls`.
   */
  popup?: string;
  /** For a trigger that opens a popup: the popup's kind. */
  haspopup?: 'dialog' | 'menu' | 'listbox';
}

export interface Trigger {
  /** The wrapper, once mounted: what a floating panel hangs from. */
  readonly anchor: HTMLElement | undefined;
  /**
   * On the wrapper around the caller's control (a Button, a Link — which
   * forward no attributes of their own): stamps `aria-haspopup`,
   * `aria-expanded` and, only while shown, `aria-controls` on its first
   * focusable element, and keeps them current.
   */
  readonly attach: Attachment<HTMLElement>;
  /** The caller's control: the wrapper's first focusable element, else the wrapper. */
  control(): HTMLElement | undefined;
  /** A press inside what it controls (native renders a panel inside the wrapper): not the trigger's. */
  isInside(event: Event): boolean;
}

/**
 * The trigger side of a disclosure (popover, menu, collapsible): the
 * wrapper's ref and the aria state stamped on the control inside it. Call
 * during component initialisation.
 */
export function createTrigger(options: TriggerOptions): Trigger {
  const root = createNodeRef<HTMLElement>();
  const controlIn = (node: HTMLElement): HTMLElement => focusableWithin(node)[0] ?? node;
  return {
    get anchor() {
      return root.current;
    },
    attach(node) {
      const undo = root.attach(node);
      const control = controlIn(node);
      const isExpanded = options.isExpanded();
      if (options.haspopup) {
        control.setAttribute('aria-haspopup', options.haspopup);
      }
      control.setAttribute('aria-expanded', String(isExpanded));
      // What it controls mounts only while shown: point at it only then.
      if (isExpanded) {
        control.setAttribute('aria-controls', options.controls);
      } else {
        control.removeAttribute('aria-controls');
      }
      return undo;
    },
    control() {
      const node = root.current;
      return node && controlIn(node);
    },
    isInside(event) {
      const popup = options.popup ?? options.controls;
      return Boolean((event.target as Element | null)?.closest?.(`[id="${popup}"]`));
    },
  };
}
