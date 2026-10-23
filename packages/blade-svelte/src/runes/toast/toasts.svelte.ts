import type { AnalyticsAttributes } from '../dom/analytics';
import { createLayerStack } from '../base/layer-stack.svelte';
import { defaultSchedule } from '../base/schedule';
import type { Schedule } from '../base/schedule';
import type { IconSource } from '../icon/source';

export type ToastDismissReason = 'timeout' | 'dismiss' | 'evicted' | 'cleared';

export interface ToastEntry<T> {
  id: number;
  content: T;
}

export interface ToastModelHandle {
  id: number;
  /** Takes it away; does nothing once it's gone. */
  dismiss(): void;
  /** Resolves with the reason when the toast leaves the stack. Never rejects. */
  dismissed: Promise<ToastDismissReason>;
}

export interface ToastsOptions<T> {
  /** Toasts shown at once; a new one evicts the oldest beyond it. Default: unbounded. */
  capacity?: number;
  /** Default ms before auto-dismiss when `show` passes none; 0 = sticky. Default 0. */
  duration?: number;
  schedule?: Schedule;
  /** Clock in ms (timers are deadline-anchored). Default `Date.now`. */
  now?: () => number;
  hooks?: {
    onDismiss?: (content: T, reason: ToastDismissReason) => void;
  };
}

export interface ToastsModel<T> {
  /** Oldest first; the newest toast is last. Tracked by whatever reads it. */
  readonly entries: readonly ToastEntry<T>[];
  show(content: T, options?: { duration?: number }): ToastModelHandle;
  /** Returns whether a toast with that id was showing. */
  dismiss(id: number): boolean;
  clear(): void;
  /** Suspend every running timer (pointer over the stack). */
  pause(): void;
  resume(): void;
  /** New limits: a smaller capacity evicts the oldest at once. */
  configure(limits: { capacity: number; duration: number }): void;
}

interface ToastTimer {
  cancel?: () => void;
  deadline: number;
  remainingMs: number;
}

/**
 * The toast queue: ordered entries over `layer-stack`, one deadline-anchored
 * timer per toast (a background tab cannot stretch a duration), capacity
 * eviction, and pause/resume. Rendering, transitions and placement are the
 * stack rune's; it reads `entries` and draws.
 */
export function createToastsModel<T>(options: ToastsOptions<T> = {}): ToastsModel<T> {
  let capacity = options.capacity ?? Infinity;
  let defaultDuration = options.duration ?? 0;
  const schedule = options.schedule ?? defaultSchedule;
  const now = options.now ?? Date.now;
  const stack = createLayerStack<T>();
  const timers = new Map<number, ToastTimer>();
  const reasons = new Map<number, ToastDismissReason>();
  let paused = false;

  type ToastLayer = ReturnType<typeof stack.push>;

  const entries = $derived(
    stack.entries.map(
      (layer): ToastEntry<T> => ({
        id: layer.id,
        content: layer.entry,
      }),
    ),
  );

  function arm(layer: ToastLayer, timer: ToastTimer): void {
    timer.deadline = now() + timer.remainingMs;
    timer.cancel = schedule(() => {
      close(layer, 'timeout');
    }, timer.remainingMs);
  }

  function close(layer: ToastLayer, reason: ToastDismissReason): void {
    timers.get(layer.id)?.cancel?.();
    timers.delete(layer.id);
    reasons.set(layer.id, reason);
    options.hooks?.onDismiss?.(layer.entry, reason);
    layer.close();
  }

  function closeAll(reason: ToastDismissReason, keepLast = 0): void {
    // Snapshot: closing mutates the stack.
    const layers = [...stack.entries];
    layers.slice(0, layers.length - keepLast).forEach((layer) => {
      close(layer, reason);
    });
  }

  return {
    get entries() {
      return entries;
    },
    show(content, showOptions) {
      const duration = showOptions?.duration ?? defaultDuration;
      const layer = stack.push(content);
      if (duration > 0) {
        const timer: ToastTimer = { remainingMs: duration, deadline: 0 };
        timers.set(layer.id, timer);
        if (!paused) {
          arm(layer, timer);
        }
      }
      if (stack.entries.length > capacity) {
        closeAll('evicted', capacity);
      }
      return {
        id: layer.id,
        dismiss: () => {
          // A toast already gone stays gone: no second `onDismiss`.
          if (stack.entries.includes(layer)) {
            close(layer, 'dismiss');
          }
        },
        dismissed: layer.promise.then(() => {
          const reason = reasons.get(layer.id) ?? 'dismiss';
          reasons.delete(layer.id);
          return reason;
        }),
      };
    },
    dismiss(id) {
      const layer = stack.entries.find((l) => l.id === id);
      if (!layer) {
        return false;
      }
      close(layer, 'dismiss');
      return true;
    },
    clear() {
      closeAll('cleared');
    },
    pause() {
      if (paused) {
        return;
      }
      paused = true;
      timers.forEach((timer) => {
        timer.cancel?.();
        timer.cancel = undefined;
        timer.remainingMs = Math.max(0, timer.deadline - now());
      });
    },
    resume() {
      if (!paused) {
        return;
      }
      paused = false;
      stack.entries.forEach((layer) => {
        const timer = timers.get(layer.id);
        if (timer) {
          arm(layer, timer);
        }
      });
    },
    configure(limits) {
      capacity = limits.capacity;
      defaultDuration = limits.duration;
      if (stack.entries.length > capacity) {
        closeAll('evicted', capacity);
      }
    },
  };
}

/**
 * What leads a toast: an icon in place of the colour's default glyph, or an
 * image (a bank's logo) — Blade DSL's _Toast/ Leading Item (Figma) is an
 * icon or an asset. Data only: Toast draws it.
 */
export type ToastLeading = IconSource | { image: string; alt?: string };

/** The leading item is an image, not an icon. */
export function isToastImage(leading: ToastLeading): leading is { image: string; alt?: string } {
  return typeof leading === 'object' && 'image' in leading;
}

/** A button beside the content. */
export interface ToastAction {
  text: string;
  /**
   * Pressed. A returned promise shows the action busy until it settles (a
   * rejection goes to `adapters.reportError`). Pressing doesn't dismiss
   * the toast: resolve the `cancelled` given to `showToast`.
   */
  onClick: () => void | Promise<unknown>;
}

/** What showing a toast decides about it, besides how it looks. */
export interface ToastContent extends Partial<AnalyticsAttributes> {
  /** What the toast says. */
  content: string;
  /** Before the content: an icon, or an image. @default the colour's glyph */
  leading?: ToastLeading;
  /** ms before it goes. @default the stack's (`defaults.ToastContainer.duration`), 4000 */
  duration?: number;
  /** `false`: it stays until dismissed. @default true */
  autoDismiss?: boolean;
  action?: ToastAction;
  /** The dismiss button was pressed. */
  onDismissButtonClick?: () => void;
  /** The dismiss button's name. @default 'Dismiss toast' */
  closeLabel?: string;
  /** It went: by timeout, a press, eviction, or its `cancelled` resolving. */
  onDismiss?: (reason: ToastDismissReason) => void;
  testID?: string;
}

export type ShowToastOptions<S extends object> = ToastContent & S;

/** How a toast is shown: `cancelled` takes it away when it resolves. */
export interface ShowToastControl {
  /**
   * Resolves once the caller withdraws; never rejects. The toast is then
   * dismissed (`'dismiss'`). One already resolved still goes on the next
   * microtask, before it paints, so don't show a toast you already know is
   * cancelled (`createCancel().isCancelled`).
   */
  cancelled?: Promise<void>;
}

/** A queue of toasts: what `showToast` adds to, and a ToastContainer shows. */
export interface Toasts<S extends object> {
  /** Shows a toast; resolves with why it left. Never rejects. */
  showToast(
    toast: string | ShowToastOptions<S>,
    options?: ShowToastControl,
  ): Promise<ToastDismissReason>;
}

/** What a ToastContainer renders a Blade queue through. Internal. */
export interface ToastQueue<S extends object> {
  /** The queue's toasts, from the first `showToast` on: they wait for a stack. */
  readonly model: ToastsModel<ShowToastOptions<S>>;
  /**
   * A ToastContainer mounted over the queue: the first brings its defaults and
   * starts the timers; a later one shares the model.
   */
  attach(limits: { capacity: number; duration: number }): ToastsModel<ShowToastOptions<S>>;
  /** A stack unmounted: the toasts go with the last one. */
  detach(): void;
}

// Blade's queues: what a stack can render. An app's own `Toasts` is not one.
const queues = new WeakMap<object, ToastQueue<object>>();

/** The queue behind a `Toasts` that `createToastQueue` made, else undefined. */
export function queueOf<S extends object>(
  toasts: Toasts<S> | undefined,
): ToastQueue<S> | undefined {
  return toasts ? (queues.get(toasts) as ToastQueue<S> | undefined) : undefined;
}

/** A queue of toasts, rendered by the ToastContainers that attach to it. */
export function createToastQueue<S extends object>(): Toasts<S> {
  // Up front: a toast shown before any stack mounts waits, its timer held,
  // and shows once one does. Blade: 4s, until a stack brings its own.
  const model = createToastsModel<ShowToastOptions<S>>({
    duration: 4000,
    hooks: {
      onDismiss: (content, reason) => content.onDismiss?.(reason),
    },
  });
  model.pause();
  // Stacks mounted over it: one stack unmounting must not take the toasts
  // from another still showing them.
  let attached = 0;
  const toasts: Toasts<S> = {
    showToast(toast, control = {}) {
      const content =
        typeof toast === 'string' ? ({ content: toast } as ShowToastOptions<S>) : toast;
      const handle = model.show(content, {
        duration: content.autoDismiss === false ? 0 : content.duration,
      });
      control.cancelled?.then(handle.dismiss, () => undefined);
      return handle.dismissed;
    },
  };
  queues.set(toasts, {
    model,
    attach(limits) {
      attached += 1;
      model.configure(limits);
      if (attached === 1) {
        model.resume();
      }
      return model;
    },
    detach() {
      attached = Math.max(0, attached - 1);
      if (!attached) {
        model.clear();
        model.pause();
      }
    },
  });
  return toasts;
}
