import React from 'react';
import type { ToastProps } from './types';
import { logger } from '~utils/logger';

type ToastEntry = ToastProps & { id: string; visible: boolean };

type UseToastReturn = {
  toasts: ToastEntry[];
  show: (props: ToastProps) => string;
  dismiss: (id?: string) => void;
};

// Mirrors the exit animation duration in Toast.native.tsx + a small grace
// window so the Animated.View has time to fade before the entry is removed
// from the list (otherwise the user sees a single-frame "pop" as the row
// disappears).
const EXIT_DURATION_MS = 200;
const REMOVAL_GRACE_MS = 50;
const REMOVAL_DELAY_MS = EXIT_DURATION_MS + REMOVAL_GRACE_MS;

// Sentinel returned by `show()` when a promotional toast is rejected because
// another promo is already visible. Consumers can compare against this to
// distinguish rejection from a real toast id.
const TOAST_REJECTED = '';

/**
 * Native Toast store.
 *
 * Web's useToast is built on top of `react-hot-toast`, which is a
 * web-only library and crashes the React Native bundle at module-load
 * time. This file provides an equivalent store + hook for RN — same
 * public API as the web version (`{ toasts, show, dismiss }`) so
 * consumers can write platform-agnostic code.
 */
class ToastStore {
  private listeners = new Set<() => void>();
  private toasts: ToastEntry[] = [];
  private idCounter = 0;
  // Tracks both auto-dismiss timers (queued during `show`) and removal timers
  // (queued during `dismiss`). A `show` immediately after `dismiss` with the
  // same id would otherwise let the pending removal nuke the freshly created
  // toast.
  private timers = new Map<string, ReturnType<typeof setTimeout>>();

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return (): void => {
      this.listeners.delete(listener);
    };
  };

  getSnapshot = (): ToastEntry[] => this.toasts;

  show = (props: ToastProps): string => {
    const type = props.type ?? 'informational';
    const isPromo = type === 'promotional';

    // Only one promotional toast at a time (matches web behavior).
    if (isPromo && this.toasts.some((t) => t.type === 'promotional' && t.visible)) {
      if (__DEV__) {
        logger({
          message: 'There can only be one promotional toast at a time',
          type: 'warn',
          moduleName: 'Toast',
        });
      }
      return TOAST_REJECTED;
    }

    const autoDismiss = props.autoDismiss ?? !isPromo;
    let duration = props.duration ?? (isPromo ? 8000 : 4000);
    if (!autoDismiss) {
      duration = Infinity;
    }

    const id = props.id ?? `toast-${this.idCounter++}`;

    // If a removal timer is pending against this id (re-shown faster than the
    // exit animation finishes), cancel it so the new toast survives.
    const pendingTimer = this.timers.get(id);
    if (pendingTimer) {
      clearTimeout(pendingTimer);
      this.timers.delete(id);
    }

    const entry: ToastEntry = {
      ...props,
      type,
      autoDismiss,
      duration,
      id,
      visible: true,
    };

    this.toasts = [...this.toasts, entry];
    this.notify();

    if (autoDismiss && Number.isFinite(duration)) {
      const timer = setTimeout(() => this.dismiss(id), duration);
      this.timers.set(id, timer);
    }
    return id;
  };

  dismiss = (id?: string): void => {
    // No id — match `react-hot-toast.toast.dismiss()`: dismiss every visible
    // toast, not just the most recent one.
    if (!id) {
      const visibleIds = this.toasts.filter((t) => t.visible).map((t) => t.id);
      if (visibleIds.length === 0) return;
      visibleIds.forEach((vid) => this.dismiss(vid));
      return;
    }
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }
    this.toasts = this.toasts.map((t) => (t.id === id ? { ...t, visible: false } : t));
    this.notify();
    // Remove from list after exit animation completes. Track the timer so a
    // re-show with the same id can cancel it before it fires.
    const removalTimer = setTimeout(() => {
      this.timers.delete(id);
      this.toasts = this.toasts.filter((t) => t.id !== id);
      this.notify();
    }, REMOVAL_DELAY_MS);
    this.timers.set(id, removalTimer);
  };

  private notify(): void {
    this.listeners.forEach((l) => l());
  }
}

const toastStore = new ToastStore();

const useToast = (): UseToastReturn => {
  const toasts = React.useSyncExternalStore(
    toastStore.subscribe,
    toastStore.getSnapshot,
    toastStore.getSnapshot,
  );
  return { toasts, show: toastStore.show, dismiss: toastStore.dismiss };
};

export type { UseToastReturn };
export { useToast, toastStore, TOAST_REJECTED };
