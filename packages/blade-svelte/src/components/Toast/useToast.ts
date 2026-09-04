import { get } from 'svelte/store';
import { logger } from '@razorpay/blade-core/utils';
import { toastStore, showToast, dismissToast, generateId } from './toastStore';
import type { ToastProps, UseToastReturn } from './types';

declare const __DEV__: boolean;

const INFORMATIONAL_DURATION = 4000;
const PROMOTIONAL_DURATION = 8000;

/**
 * Stable `show` function — defined once at module scope so every caller
 * receives the same reference. Reads the promotional-toast guard
 * synchronously via `get(toastStore)` (no reactive subscription needed
 * for the guard check).
 */
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

/**
 * Returns helpers to show, dismiss, and observe toasts.
 *
 * Unlike React's hook-based contract, this is a plain function safe to call
 * from anywhere — Svelte components, plain `.ts` modules, or event handlers.
 * The returned `toasts` is the live `Writable` store, so consumers can either
 * `$toasts` (auto-subscribe inside Svelte) or `toasts.subscribe(...)` outside.
 *
 * `show` and `dismiss` are referentially stable — defined once at module
 * scope, so the same function references are returned on every call.
 */
export function useToast(): UseToastReturn {
  return {
    show,
    dismiss: dismissToast,
    toasts: toastStore,
  };
}
