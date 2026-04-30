/**
 * Toast — short, transient feedback messages stacked at the bottom-left of
 * the viewport.
 *
 * Render `ToastContainer` once at the root of your app, then call the helpers
 * returned by `useToast()` to show or dismiss toasts from anywhere.
 *
 * @example
 * ```svelte
 * <script>
 *   import { ToastContainer, useToast, Button } from '@razorpay/blade-svelte/components';
 *
 *   const toast = useToast();
 * </script>
 *
 * <Button onClick={() => toast.show({ content: 'Payment successful', color: 'positive' })}>
 *   Show Toast
 * </Button>
 * <ToastContainer />
 * ```
 */
export { default as Toast } from './Toast.svelte';
export { default as ToastContainer } from './ToastContainer.svelte';
export { useToast } from './useToast';
export {
  toastStore,
  showToast,
  dismissToast,
  updateToastHeight,
  pauseToast,
  resumeToast,
} from './toastStore';
export type {
  ToastProps,
  ToastContainerProps,
  ToastType,
  ToastColor,
  ToastAction,
  ToastCallbackPayload,
  BladeToast,
  UseToastReturn,
} from './types';
