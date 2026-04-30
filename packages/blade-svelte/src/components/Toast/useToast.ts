import { get } from 'svelte/store';
import { logger } from '@razorpay/blade-core/utils';
import { toastStore, showToast, dismissToast, generateId } from './toastStore';
import type { ToastProps, UseToastReturn } from './types';

const INFORMATIONAL_DURATION = 4000;
const PROMOTIONAL_DURATION = 8000;

/**
 * Returns helpers to show, dismiss, and observe toasts.
 *
 * Unlike React's hook-based contract, this is a plain function safe to call
 * from anywhere — Svelte components, plain `.ts` modules, or event handlers.
 * The returned `toasts` is the live `Writable` store, so consumers can either
 * `$toasts` (auto-subscribe inside Svelte) or `toasts.subscribe(...)` outside.
 */
export function useToast(): UseToastReturn {
  function show(props: ToastProps): string {
    const type = props.type ?? 'informational';
    const isPromoToast = type === 'promotional';

    if (isPromoToast) {
      const existingPromo = get(toastStore).find((t) => t.type === 'promotional');
      if (existingPromo) {
        if (typeof __DEV__ !== 'undefined' && __DEV__) {
          logger({
            message: 'There can only be one promotional toast at a time',
            type: 'warn',
            moduleName: 'Toast',
          });
        }
        return '';
      }
    }

    const autoDismiss = props.autoDismiss === undefined ? !isPromoToast : props.autoDismiss;
    let duration = props.duration;
    if (duration === undefined) {
      duration = isPromoToast ? PROMOTIONAL_DURATION : INFORMATIONAL_DURATION;
    }
    if (!autoDismiss) {
      duration = Infinity;
    }

    const id = props.id ?? generateId();

    return showToast({
      ...props,
      id,
      type,
      autoDismiss,
      duration,
    });
  }

  return {
    show,
    dismiss: dismissToast,
    toasts: toastStore,
  };
}

declare const __DEV__: boolean;
