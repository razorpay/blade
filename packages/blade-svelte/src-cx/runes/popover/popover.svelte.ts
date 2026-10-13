import { onDestroy } from 'svelte';
import type { Attachment } from 'svelte/attachments';
import { createDisclosure } from '../base/disclosure';
import { defaultSchedule } from '../base/schedule';
import type { Schedule } from '../base/schedule';
import { createTrigger } from '../dom/trigger.svelte';

export interface PopoverOptions {
  /** The panel's element id: what the trigger controls. */
  id: string;
  isOpen: () => boolean;
  /** The bindable write. */
  onValue: (isOpen: boolean) => void;
  onOpenChange?: (isOpen: boolean) => void;
  isDisabled: () => boolean;
  /** `hover`: the pointer over the trigger or the panel opens it. @default click */
  openInteraction?: () => 'click' | 'hover';
  /** Injected by tests, so the hover grace never sleeps. */
  schedule?: Schedule;
}

export interface Popover {
  /** The trigger's wrapper, once mounted: what the panel hangs from. */
  readonly anchor: HTMLElement | undefined;
  /** On the root: stamps the trigger's aria state, which is the caller's control. */
  readonly root: Attachment<HTMLElement>;
  handleClick(event: MouseEvent): void;
  /**
   * Whether the pointer opens it: `hover` asked for, and a device that can
   * hover. A touch screen, and the native renderer, open on a tap instead.
   */
  readonly opensOnHover: boolean;
  /** On the trigger's wrapper and on the panel, for `hover`. */
  handlePointerEnter(): void;
  handlePointerLeave(): void;
  close(): void;
}

// Long enough to cross the gap between the trigger and the panel.
const HOVER_GRACE_MS = 100;

/** A popover's open state and the trigger's aria wiring. Call during component initialisation. */
export function createPopover(options: PopoverOptions): Popover {
  const schedule = options.schedule ?? defaultSchedule;
  const disclosure = createDisclosure({
    open: options.isOpen,
    onOpenChange: (open) => {
      options.onValue(open);
      options.onOpenChange?.(open);
    },
  });
  const trigger = createTrigger({
    controls: options.id,
    isExpanded: options.isOpen,
    haspopup: 'dialog',
  });

  function set(next: boolean): void {
    if (!(next && options.isDisabled())) {
      if (next) {
        disclosure.open('trigger');
      } else {
        disclosure.close('trigger');
      }
    }
  }

  // A device that cannot hover (touch, native) opens on a tap either way.
  const canHover = (): boolean =>
    typeof matchMedia === 'function' && matchMedia('(hover: hover)').matches;
  const isHover = (): boolean => options.openInteraction?.() === 'hover' && canHover();
  let leaving: (() => void) | undefined;
  function stay(): void {
    leaving?.();
    leaving = undefined;
  }
  // A grace still running when the popover goes must not write to it.
  onDestroy(stay);

  return {
    get opensOnHover() {
      return isHover();
    },
    get anchor() {
      return trigger.anchor;
    },
    root: trigger.attach,
    handleClick(event) {
      if (isHover()) {
        return;
      }
      // Native renders the panel in here: a press inside it is not the trigger's.
      if (!trigger.isInside(event)) {
        set(!options.isOpen());
      }
    },
    handlePointerEnter() {
      if (isHover()) {
        stay();
        set(true);
      }
    },
    handlePointerLeave() {
      if (isHover()) {
        stay();
        leaving = schedule(() => {
          leaving = undefined;
          set(false);
        }, HOVER_GRACE_MS);
      }
    },
    close: () => {
      stay();
      set(false);
    },
  };
}
