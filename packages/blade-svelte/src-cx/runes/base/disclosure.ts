import type { BackAnswer } from './back';
import { createControllable } from './controllable.svelte';

/** The default vocabulary of what opened or closed a disclosure. */
export type OpenSource =
  | 'trigger'
  | 'dismiss'
  | 'escape'
  | 'back'
  | 'programmatic';

/**
 * A dismissal, as the owner hears it. `close` ends it — needed only when
 * the disclosure is not dismissible; a dismissible one closes on its own
 * once the handler returns.
 */
export interface DismissEvent<S extends string = OpenSource> {
  source: S;
  close: () => void;
}

/**
 * `S` is the owner's source vocabulary (a dialog's `'cross' | 'drag' | …`);
 * it must hold `'programmatic'` (the default for `open`/`close`) and
 * `'back'` (what `back()` dismisses with).
 */
export interface DisclosureOptions<S extends string = OpenSource> {
  open?: () => boolean | undefined;
  defaultOpen?: boolean;
  /**
   * Whether a dismissal closes it by itself once `onDismiss` has run. When
   * not, it stays open until the event's `close`. Default true.
   */
  dismissible?: () => boolean;
  /** Every dismissal, dismissible or not, before it closes. */
  onDismiss?: (event: DismissEvent<S>) => void;
  onOpenChange?: (open: boolean, source: S) => void;
}

export interface DisclosureModel<S extends string = OpenSource> {
  /** Tracked by whatever reads it. */
  isOpen(): boolean;
  /** Read live from the host's option. */
  isDismissible(): boolean;
  open(source?: S): void;
  close(source?: S): void;
  toggle(source?: S): void;
  /**
   * The user asks it to go: `onDismiss` runs, then a dismissible one
   * closes. Returns whether it closed.
   */
  dismiss(source: S): boolean;
  /**
   * Back pressed while this is on top: a dismissal. Open surfaces always
   * decide (true = handled here, do not pop further); a closed one returns
   * undefined so an enclosing layer stack applies its own default. See
   * `BackAnswer`.
   */
  back(): BackAnswer;
}

/** Open/close with an owner-decided dismiss rule and a back answer. */
export function createDisclosure<S extends string = OpenSource>(
  options: DisclosureOptions<S> = {}
): DisclosureModel<S> {
  const isDismissible = (): boolean => options.dismissible?.() ?? true;
  const programmatic = 'programmatic' as S;
  let source = programmatic;
  const openness = createControllable<boolean>({
    value: options.open,
    defaultValue: Boolean(options.defaultOpen),
    onChange: (next) => options.onOpenChange?.(next, source),
  });

  function set(next: boolean, from: S): void {
    source = from;
    openness.set(next);
  }

  const model: DisclosureModel<S> = {
    isOpen: () => openness.get(),
    isDismissible,
    open(from = programmatic) {
      set(true, from);
    },
    close(from = programmatic) {
      set(false, from);
    },
    toggle(from = 'trigger' as S) {
      set(!openness.get(), from);
    },
    dismiss(from) {
      if (!openness.get()) {
        return false;
      }
      options.onDismiss?.({ source: from, close: () => set(false, from) });
      if (isDismissible() && openness.get()) {
        set(false, from);
      }
      return !openness.get();
    },
    back() {
      if (!openness.get()) {
        return undefined;
      }
      model.dismiss('back' as S);
      // Open or not now, it answered: nothing beneath it pops.
      return true;
    },
  };
  return model;
}
