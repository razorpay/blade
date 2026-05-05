import React from 'react';
import type { ToastProps } from './types';
import { logger } from '~utils/logger';

type ToastEntry = ToastProps & { id: string; visible: boolean };

type UseToastReturn = {
  toasts: ToastEntry[];
  show: (props: ToastProps) => string;
  dismiss: (id?: string) => void;
};

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
      return '';
    }

    const autoDismiss = props.autoDismiss ?? !isPromo;
    let duration = props.duration ?? (isPromo ? 8000 : 4000);
    if (!autoDismiss) {
      duration = Infinity;
    }

    const id = props.id ?? `toast-${this.idCounter++}`;
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
    if (!id) {
      const last = [...this.toasts].reverse().find((t) => t.visible);
      if (!last) return;
      this.dismiss(last.id);
      return;
    }
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }
    this.toasts = this.toasts.map((t) => (t.id === id ? { ...t, visible: false } : t));
    this.notify();
    // Remove from list after exit animation completes.
    setTimeout(() => {
      this.toasts = this.toasts.filter((t) => t.id !== id);
      this.notify();
    }, 250);
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
export { useToast, toastStore };
