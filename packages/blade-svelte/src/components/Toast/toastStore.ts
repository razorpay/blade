import { writable, get } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { BladeToast, ToastProps } from './types';

/**
 * Reactive store of currently active toasts.
 *
 * `ToastContainer` subscribes to this store to render the stack and consumers
 * use the helpers below (or `useToast`) to mutate it. Lives at module scope so
 * a single store is shared across all `useToast()` callers in an app, mirroring
 * `react-hot-toast` behavior.
 */
export const toastStore: Writable<BladeToast[]> = writable<BladeToast[]>([]);

type TimerEntry = {
  timeoutId: ReturnType<typeof setTimeout>;
  remaining: number;
  startedAt: number;
};

const timers = new Map<string, TimerEntry>();

/**
 * Generate a unique id for a new toast. Falls back to `Math.random` when
 * `crypto.randomUUID` is unavailable (older browsers/jsdom).
 */
function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `toast-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function clearTimer(id: string): void {
  const entry = timers.get(id);
  if (entry) {
    clearTimeout(entry.timeoutId);
    timers.delete(id);
  }
}

function scheduleAutoDismiss(id: string, duration: number): void {
  if (!Number.isFinite(duration) || duration <= 0) return;

  clearTimer(id);
  const startedAt = Date.now();
  const timeoutId = setTimeout(() => {
    timers.delete(id);
    dismissToast(id);
  }, duration);

  timers.set(id, { timeoutId, remaining: duration, startedAt });
}

/**
 * Push a new toast onto the stack. Returns the assigned id.
 *
 * If `autoDismiss` is true, schedules a timer that calls `dismissToast` once
 * `duration` ms have elapsed. The timer is cancelled on manual dismiss or
 * when paused via `pauseToast`.
 */
export function showToast(props: ToastProps & { id: string }): string {
  const { id, autoDismiss, duration } = props;

  const newToast: BladeToast = {
    ...props,
    id,
    visible: true,
    createdAt: Date.now(),
    pausedAt: null,
  };

  toastStore.update((toasts) => [newToast, ...toasts]);

  if (autoDismiss && typeof duration === 'number' && Number.isFinite(duration)) {
    scheduleAutoDismiss(id, duration);
  }

  return id;
}

/**
 * Hide a toast (or all toasts when no id is passed). Sets `visible: false` so
 * the exit animation can play, then removes the entry from the store after the
 * animation has had time to complete.
 */
export function dismissToast(id?: string): void {
  const removeAfterAnimationMs = 500;

  if (id === undefined) {
    const all = get(toastStore);
    all.forEach((t) => clearTimer(t.id));
    toastStore.update((toasts) => toasts.map((t) => ({ ...t, visible: false })));
    setTimeout(() => {
      toastStore.set([]);
    }, removeAfterAnimationMs);
    return;
  }

  clearTimer(id);
  toastStore.update((toasts) => toasts.map((t) => (t.id === id ? { ...t, visible: false } : t)));
  setTimeout(() => {
    toastStore.update((toasts) => toasts.filter((t) => t.id !== id));
  }, removeAfterAnimationMs);
}

/**
 * Update the measured height of a toast (called from `ToastContainer`'s
 * `bind:clientHeight`). Used by stacking math to position later toasts above
 * the front toast.
 */
export function updateToastHeight(id: string, height: number): void {
  toastStore.update((toasts) => toasts.map((t) => (t.id === id ? { ...t, height } : t)));
}

/**
 * Pause auto-dismiss timers for every toast (called on container mouseenter
 * or mobile tap). Subtracts the elapsed time from the toast's remaining
 * duration so resume can continue from the same point.
 */
export function pauseToast(): void {
  const now = Date.now();
  timers.forEach((entry, id) => {
    clearTimeout(entry.timeoutId);
    const elapsed = now - entry.startedAt;
    const remaining = Math.max(0, entry.remaining - elapsed);
    timers.set(id, {
      ...entry,
      remaining,
      timeoutId: (0 as unknown) as ReturnType<typeof setTimeout>,
    });
  });
  toastStore.update((toasts) =>
    toasts.map((t) => (t.pausedAt === null ? { ...t, pausedAt: now } : t)),
  );
}

/**
 * Resume previously paused auto-dismiss timers (mouseleave or second tap).
 * Re-schedules each timer with its remaining duration.
 */
export function resumeToast(): void {
  const now = Date.now();
  const ids: string[] = [];
  timers.forEach((entry, id) => {
    ids.push(id);
    if (entry.remaining > 0) {
      const timeoutId = setTimeout(() => {
        timers.delete(id);
        dismissToast(id);
      }, entry.remaining);
      timers.set(id, { ...entry, startedAt: now, timeoutId });
    }
  });
  toastStore.update((toasts) =>
    toasts.map((t) => (t.pausedAt !== null ? { ...t, pausedAt: null } : t)),
  );
}

export { generateId };
