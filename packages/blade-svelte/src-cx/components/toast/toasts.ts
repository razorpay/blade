import {
  createToastQueue,
  getToasts as getProvidedToasts,
  provideToasts as provide,
  type ShowToastOptions as ShowToastOptionsOf,
  type ToastHandle,
  type Toasts as ToastsOf,
} from '../../runes/toast/toasts.svelte';
import type { ToastStyleProps } from './styles';

// The toast queue bound to this library's Toast: its style props are what
// `showToast` accepts beside the content.
export type ShowToastOptions = ShowToastOptionsOf<ToastStyleProps>;
export type Toasts = ToastsOf<ToastStyleProps>;
export type { ToastHandle };

/** One queue for the page; an embedded surface provides its own. */
export const globalToasts: Toasts = createToastQueue<ToastStyleProps>();

/** Call during component init; descendants and their ToastStack share it. */
export function provideToasts(): Toasts {
  return provide(createToastQueue<ToastStyleProps>());
}

export function getToasts(): Toasts {
  return getProvidedToasts(globalToasts);
}

/**
 * Shows a toast from anywhere — a flow in a `.ts` file as much as a
 * component. It needs a mounted `ToastStack`; without one nothing shows.
 */
export function showToast(toast: string | ShowToastOptions): ToastHandle {
  return globalToasts.showToast(toast);
}
