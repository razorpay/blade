import { onDestroy, untrack } from 'svelte';
import type { Attachment } from 'svelte/attachments';
import { createDisclosure } from '../base/disclosure';
import { defaultSchedule } from '../base/schedule';
import type { Schedule } from '../base/schedule';
import { createNodeRef } from '../dom/node.svelte';
import { getTooltipGroup } from './group';
import type { TooltipGroup, TooltipGroupMember } from './group';

export interface TooltipModelOptions {
  disabled?: () => boolean;
  onOpenChange?: (open: boolean) => void;
  /** Hover must rest this long before the tooltip opens. Blade's: 300ms. */
  openDelay?: number;
  /**
   * Hover may leave this long before it closes: time for the pointer to
   * travel from the trigger onto the tooltip itself. Blade's: 300ms.
   */
  closeDelay?: number;
  /** The delay group it is in: while another is open, it opens at once. */
  group?: TooltipGroup;
  schedule?: Schedule;
}

export interface TooltipModel {
  /** Tracked by whatever reads it. */
  isOpen(): boolean;
  /** The pointer is over the trigger or the tooltip. */
  pointerEnter(): void;
  pointerLeave(): void;
  /** Keyboard focus reached the trigger: no delay. */
  focus(): void;
  blur(): void;
  /** A tap: the only way in where nothing hovers (touch). */
  press(): void;
  /** Escape. Returns whether it closed. */
  dismiss(): boolean;
  /** Re-read `disabled`; a tooltip disabled while open closes. */
  refresh(): void;
  destroy(): void;
}

/** When a tooltip is open: hover with intent, focus, or a tap. */
export function createTooltipModel(options: TooltipModelOptions = {}): TooltipModel {
  const schedule = options.schedule ?? defaultSchedule;
  const openDelay = options.openDelay ?? 300;
  const closeDelay = options.closeDelay ?? 300;
  const isDisabled = (): boolean => Boolean(options.disabled?.());
  const member: TooltipGroupMember = { close: () => set(false, 0) };
  const disclosure = createDisclosure({
    onOpenChange: (open) => {
      if (open) {
        options.group?.opened(member);
      } else {
        options.group?.closed(member);
      }
      options.onOpenChange?.(open);
    },
  });
  let cancel: (() => void) | undefined;

  function settle(): void {
    cancel?.();
    cancel = undefined;
  }

  function set(open: boolean, delay: number): void {
    settle();
    if (open && isDisabled()) {
      return;
    }
    if (!delay || disclosure.isOpen() === open) {
      if (open) {
        disclosure.open('trigger');
      } else {
        disclosure.close('trigger');
      }
      return;
    }
    cancel = schedule(() => {
      cancel = undefined;
      set(open, 0);
    }, delay);
  }

  return {
    isOpen: disclosure.isOpen,
    pointerEnter: () => set(true, options.group?.isInstant(member) ? 0 : openDelay),
    pointerLeave: () => set(false, closeDelay),
    focus: () => set(true, 0),
    blur: () => set(false, 0),
    press: () => set(!disclosure.isOpen(), 0),
    dismiss() {
      settle();
      return disclosure.dismiss('escape');
    },
    refresh() {
      if (isDisabled()) {
        set(false, 0);
      }
    },
    destroy() {
      settle();
      options.group?.closed(member);
    },
  };
}

export interface TooltipOptions {
  isDisabled: () => boolean;
  onOpenChange?: (isOpen: boolean) => void;
  /** Injected by tests; the delays are the model's defaults. */
  schedule?: Schedule;
  /** Injected by tests; else the group of the nearest layer stack. */
  group?: TooltipGroup;
}

export interface Tooltip {
  readonly isOpen: boolean;
  /** The trigger's wrapper, once mounted: what the bubble points at. */
  readonly anchor: HTMLElement | undefined;
  /** On the root element. */
  readonly root: Attachment<HTMLElement>;
  handlePointerDown(event: PointerEvent): void;
  handlePointerEnter(event: PointerEvent): void;
  handlePointerLeave(event: PointerEvent): void;
  handleFocusIn(): void;
  handleFocusOut(): void;
  handleClick(event: MouseEvent): void;
  /** The pointer reached the bubble. */
  handleBubbleEnter(): void;
  handleBubbleLeave(): void;
  /** Escape. */
  dismiss(): void;
  /** A press landed outside the trigger and the bubble. */
  blur(): void;
}

/**
 * The tooltip's open/close behaviour over the model above: what the
 * pointer, the keyboard and a tap each do. Call during component
 * initialisation.
 */
export function createTooltip(options: TooltipOptions): Tooltip {
  const root = createNodeRef<HTMLElement>();
  const model = createTooltipModel({
    disabled: options.isDisabled,
    onOpenChange: (open) => options.onOpenChange?.(open),
    group: options.group ?? getTooltipGroup(),
    schedule: options.schedule,
  });
  const isOpen = $derived(model.isOpen());
  onDestroy(() => model.destroy());

  // A tooltip disabled while open closes.
  $effect.pre(() => {
    void options.isDisabled();
    untrack(() => model.refresh());
  });

  // What started the gesture in flight: a pointer-made focus is not a
  // keyboard focus, and a mouse click is not a tap.
  let pointer: string | undefined;

  return {
    get isOpen() {
      return isOpen;
    },
    get anchor() {
      return root.current;
    },
    root: root.attach,
    handlePointerDown(event) {
      pointer = event.pointerType;
    },
    handlePointerEnter(event) {
      if (event.pointerType === 'mouse') {
        model.pointerEnter();
      }
    },
    handlePointerLeave(event) {
      if (event.pointerType === 'mouse') {
        model.pointerLeave();
      }
    },
    handleFocusIn() {
      if (!pointer) {
        model.focus();
      }
    },
    handleFocusOut() {
      model.blur();
    },
    handleClick(event) {
      const via = pointer;
      pointer = undefined;
      // A keyboard click (detail 0) already has the tooltip through focus; a
      // mouse has it through hover. What is left is a tap.
      if (via === 'mouse' || event.detail === 0) {
        return;
      }
      model.press();
    },
    handleBubbleEnter: () => model.pointerEnter(),
    handleBubbleLeave: () => model.pointerLeave(),
    dismiss: () => model.dismiss(),
    blur: () => model.blur(),
  };
}
