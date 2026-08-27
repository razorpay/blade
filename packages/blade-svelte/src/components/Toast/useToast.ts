import { get } from 'svelte/store';
import { logger } from '@razorpay/blade-core/utils';
import { toastStore, showToast, dismissToast, generateId } from './toastStore';
import type { ToastProps, ToastActions, UseToastReturn } from './types';

declare const __DEV__: boolean;

const INFORMATIONAL_DURATION = 4000;
const PROMOTIONAL_DURATION = 8000;

/**
 * Stable `show` function — defined once at module scope so every caller
 * receives the same reference. Reads the promotional-toast guard
 * synchronously via `get(toastStore)` (no reactive subscription).
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

const toastActions: ToastActions = {
  show,
  dismiss: dismissToast,
};

/**
 * Returns referentially-stable `show` and `dismiss` functions without
 * the reactive `toasts` store.
 *
 * Use this instead of `useToast()` when your component only needs to
 * trigger toasts and never reads the active toasts list. In Svelte this
 * avoids unnecessary store subscriptions.
 *
 * @example
 * ```svelte
 * <script>
 *   import { useToastActions } from '@razorpay/blade-svelte/components';
 *   const { show, dismiss } = useToastActions();
 * </script>
 * ```
 */
export function useToastActions(): ToastActions {
  return toastActions;
}

/**
 * Returns helpers to show, dismiss, and observe toasts.
 *
 * Unlike React's hook-based contract, this is a plain function safe to call
 * from anywhere — Svelte components, plain `.ts` modules, or event handlers.
 * The returned `toasts` is the live `Writable` store, so consumers can either
 * `$toasts` (auto-subscribe inside Svelte) or `toasts.subscribe(...)` outside.
 */
export function useToast(): UseToastReturn {
  return {
    show,
    dismiss: dismissToast,
    toasts: toastStore,
  };
}
