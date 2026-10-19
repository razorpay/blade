import { getAdapters } from '../../adapters';
import { createToastQueue } from '../../runes/toast/toasts.svelte';
import type {
  ShowToastControl,
  ShowToastOptions as ShowToastOptionsOf,
  ToastAction,
  ToastDismissReason,
  ToastLeading,
  Toasts as ToastsOf,
} from '../../runes/toast/toasts.svelte';
import type { ToastStyleProps } from './styles';

// The toast queue bound to this library's Toast: its style props are what
// `showToast` accepts beside the content.
export type ShowToastOptions = ShowToastOptionsOf<ToastStyleProps>;
export type Toasts = ToastsOf<ToastStyleProps>;
export type { ShowToastControl, ToastAction, ToastDismissReason, ToastLeading };

/** The page's queue, for when no provider passes `adapters.toasts`. */
export const globalToasts: Toasts = createToastQueue<ToastStyleProps>();

/** A queue of toasts of its own: pass it as BladeProvider's `adapters.toasts`. */
export function createToasts(): Toasts {
  return createToastQueue<ToastStyleProps>();
}

/** The nearest provider's `adapters.toasts`, else the page's. Call during component init. */
export function getToasts(): Toasts {
  return getAdapters().toasts ?? globalToasts;
}

/**
 * Shows a toast from anywhere — a flow in a `.ts` file as much as a
 * component — on the page's queue, which a ToastContainer shows. Resolves
 * with why it left (`timeout`, `dismiss`, `evicted`, `cleared`); its
 * `cancelled` resolving dismisses it (`createCancel()` makes one). A toast
 * shown before a ToastContainer mounts waits for it. An app with a queue of its own (`adapters.toasts`) calls its
 * `showToast`.
 */
export function showToast(
  toast: string | ShowToastOptions,
  options?: ShowToastControl,
): Promise<ToastDismissReason> {
  return globalToasts.showToast(toast, options);
}
