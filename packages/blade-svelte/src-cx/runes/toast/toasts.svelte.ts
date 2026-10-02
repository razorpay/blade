import { defineContext } from '../context';
import { createLayerStack } from '../base/layer-stack.svelte';
import { defaultSchedule, type Schedule } from '../base/schedule';
import type { IconSource } from '../icon/source';

export type ToastDismissReason = 'timeout' | 'dismiss' | 'evicted' | 'cleared';

export interface ToastEntry<T> {
  id: number;
  content: T;
}

export interface ToastModelHandle {
  id: number;
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
export function createToasts<T>(
  options: ToastsOptions<T> = {}
): ToastsModel<T> {
  const capacity = options.capacity ?? Infinity;
  const schedule = options.schedule || defaultSchedule;
  const now = options.now || Date.now;
  const stack = createLayerStack<T>();
  const timers = new Map<number, ToastTimer>();
  const reasons = new Map<number, ToastDismissReason>();
  let paused = false;

  type ToastLayer = ReturnType<typeof stack.push>;

  const entries = $derived(
    stack.entries.map((layer): ToastEntry<T> => ({
      id: layer.id,
      content: layer.entry,
    }))
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
      const duration = showOptions?.duration ?? options.duration ?? 0;
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
          close(layer, 'dismiss');
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
  };
}

/** What showing a toast decides about it, besides how it looks. */
export interface ToastContent {
  /** What the toast says. */
  content: string;
  /** A glyph before the content; each colour has Blade's default. */
  icon?: IconSource;
  /** ms before it goes. @default 4000 */
  duration?: number;
  /** `false`: it stays until dismissed. @default true */
  autoDismiss?: boolean;
  /** A button beside the content; pressing it dismisses the toast. */
  action?: { text: string; onClick: () => void; isLoading?: boolean };
  /** The dismiss button was pressed. */
  onDismissButtonClick?: () => void;
  /** The dismiss button's name. @default 'Dismiss toast' */
  closeLabel?: string;
  /** It went: by timeout, a press, eviction, or `dismiss()`. */
  onDismiss?: (reason: ToastDismissReason) => void;
  testID?: string;
}

export type ShowToastOptions<S extends object> = ToastContent & S;

export interface ToastHandle {
  dismiss(): void;
  /** Why it left: `timeout`, `dismiss`, `evicted` or `cleared`. */
  dismissed: Promise<ToastDismissReason>;
}

export interface Toasts<S extends object> {
  /** Undefined until a ToastStack mounts: it brings the defaults. */
  model: ToastsModel<ShowToastOptions<S>> | undefined;
  /** Created by the mounted ToastStack; `showToast` needs one. */
  attach(options: {
    capacity: number;
    duration: number;
  }): ToastsModel<ShowToastOptions<S>>;
  detach(): void;
  showToast(toast: string | ShowToastOptions<S>): ToastHandle;
}

const NEVER: ToastHandle = {
  dismiss: () => undefined,
  dismissed: Promise.resolve('cleared'),
};

export function createToastQueue<S extends object>(): Toasts<S> {
  const toasts: Toasts<S> = {
    model: undefined,
    attach(options) {
      toasts.model ??= createToasts<ShowToastOptions<S>>({
        ...options,
        hooks: {
          onDismiss: (content, reason) => content.onDismiss?.(reason),
        },
      });
      return toasts.model;
    },
    detach() {
      toasts.model?.clear();
      toasts.model = undefined;
    },
    showToast(toast) {
      const content =
        typeof toast === 'string'
          ? ({ content: toast } as ShowToastOptions<S>)
          : toast;
      // Blade: 4s unless `autoDismiss` is false, then until dismissed.
      const handle = toasts.model?.show(content, {
        duration: content.autoDismiss === false ? 0 : (content.duration ?? 4000),
      });
      return handle
        ? { dismiss: handle.dismiss, dismissed: handle.dismissed }
        : NEVER;
    },
  };
  return toasts;
}

const TOASTS = defineContext<unknown>('blade-toasts');

/** Call during component init; descendants and their ToastStack share it. */
export function provideToasts<S extends object>(toasts: Toasts<S>): Toasts<S> {
  TOASTS.set(toasts);
  return toasts;
}

/** The provided queue, else `fallback` (the library's page-wide one). */
export function getToasts<S extends object>(fallback: Toasts<S>): Toasts<S> {
  return (TOASTS.get() as Toasts<S> | undefined) ?? fallback;
}
