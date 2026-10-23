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

/**
 * The page's one queue: `showToast` adds to it, and every ToastContainer
 * shows it. Internal.
 */
export const globalToasts: Toasts = createToastQueue<ToastStyleProps>();

/**
 * Shows a toast from anywhere — a flow in a `.ts` file as much as a
 * component — on the page's queue, which a ToastContainer shows. Resolves
 * with why it left (`timeout`, `dismiss`, `evicted`, `cleared`); its
 * `cancelled` resolving dismisses it (`createCancel()` makes one). A toast
 * shown before a ToastContainer mounts waits for it.
 */
export function showToast(
  toast: string | ShowToastOptions,
  options?: ShowToastControl,
): Promise<ToastDismissReason> {
  return globalToasts.showToast(toast, options);
}
