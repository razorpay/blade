import type { Attachment } from 'svelte/attachments';
import { createTrigger } from '../dom/trigger.svelte';
import type { CollapsibleContext } from './context';

export interface CollapsibleOptions {
  /** The host's `$props.id()`: the body's id hangs off it. */
  id: string;
  isExpanded: () => boolean;
  /** The bindable write. */
  onValue: (isExpanded: boolean) => void;
  /** A toggle changed the state. */
  onExpandChange?: (isExpanded: boolean) => void;
  direction: () => 'bottom' | 'top';
}

export interface Collapsible extends CollapsibleContext {
  /** The body's id: the trigger `aria-controls` it. */
  readonly bodyId: string;
  toggle(): void;
  /**
   * Around the trigger: stamps `aria-expanded` and `aria-controls` on its
   * first focusable element — the caller's Button or Link, which forward no
   * attributes of their own — and keeps them current. `aria-controls` is set
   * only while the body is mounted, that is, expanded.
   */
  readonly trigger: Attachment<HTMLElement>;
}

/**
 * Blade's Collapsible: one expanded state, the trigger that toggles it and
 * the body it shows. Call during component initialisation; the component
 * provides the result to its parts (`provideCollapsible`).
 */
export function createCollapsible(options: CollapsibleOptions): Collapsible {
  const bodyId = `${options.id}-body`;
  const trigger = createTrigger({
    controls: bodyId,
    isExpanded: options.isExpanded,
  });
  return {
    get isExpanded() {
      return options.isExpanded();
    },
    get direction() {
      return options.direction();
    },
    bodyId,
    toggle() {
      const next = !options.isExpanded();
      options.onValue(next);
      options.onExpandChange?.(next);
    },
    trigger: trigger.attach,
  };
}
