import type { BackAnswer } from './back';
import { createControllable } from './controllable.svelte';

export type OpenSource =
  | 'trigger'
  | 'dismiss'
  | 'escape'
  | 'back'
  | 'programmatic';

export interface DisclosureOptions {
  open?: () => boolean | undefined;
  defaultOpen?: boolean;
  /** Whether backdrop, Escape and back may close it. Default true. */
  dismissible?: () => boolean;
  /**
   * The content may own back itself (a non-dismissable flow with its own
   * navigation). See `BackAnswer` for the protocol and how it composes with
   * a layer stack.
   */
  onBack?: () => BackAnswer;
  onOpenChange?: (open: boolean, source: OpenSource) => void;
}

export interface DisclosureModel {
  /** Tracked by whatever reads it. */
  isOpen(): boolean;
  /** Read live from the host's option. */
  isDismissible(): boolean;
  open(source?: OpenSource): void;
  close(source?: OpenSource): void;
  toggle(source?: OpenSource): void;
  /** A dismiss request (backdrop, Escape). Returns whether it closed. */
  dismiss(source?: OpenSource): boolean;
  /**
   * Back pressed while this is on top. Open surfaces always decide (true =
   * handled here, do not pop further); a closed one returns undefined so an
   * enclosing layer stack applies its own default. See `BackAnswer`.
   */
  back(): BackAnswer;
}

/** Open/close with an owner-decided dismiss rule and a back answer. */
export function createDisclosure(
  options: DisclosureOptions = {}
): DisclosureModel {
  const isDismissible = (): boolean => options.dismissible?.() ?? true;
  let source: OpenSource = 'programmatic';
  const openness = createControllable<boolean>({
    value: options.open,
    defaultValue: Boolean(options.defaultOpen),
    onChange: (next) => options.onOpenChange?.(next, source),
  });

  function set(next: boolean, from: OpenSource): void {
    source = from;
    openness.set(next);
  }

  const model: DisclosureModel = {
    isOpen: () => openness.get(),
    isDismissible,
    open(from = 'programmatic') {
      set(true, from);
    },
    close(from = 'programmatic') {
      set(false, from);
    },
    toggle(from = 'trigger') {
      set(!openness.get(), from);
    },
    dismiss(from = 'dismiss') {
      if (!openness.get() || !isDismissible()) {
        return false;
      }
      set(false, from);
      return true;
    },
    back() {
      if (!openness.get()) {
        return undefined;
      }
      const owned = options.onBack?.();
      if (owned !== undefined) {
        return owned;
      }
      model.dismiss('back');
      // A non-dismissable open surface still owns back: nothing beneath it pops.
      return true;
    },
  };
  return model;
}
