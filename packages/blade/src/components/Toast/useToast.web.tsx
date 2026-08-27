import type { Toast } from 'react-hot-toast';
import toast, { useToasterStore } from 'react-hot-toast';
import type { ToastProps } from './types';
import { Toast as ToastComponent } from './Toast';
import { logger } from '~utils/logger';

type BladeToast = Omit<Toast, 'type'> & ToastProps;

type ToastActions = {
  show: (props: ToastProps) => string;
  dismiss: (id?: string) => void;
};

type UseToastReturn = ToastActions & {
  toasts: BladeToast[];
};

// ── Module-level toast snapshot ──────────────────────────────────────
//
// `stableShow` needs to check whether a promotional toast is already
// active, but it must NOT subscribe to the store (that would force every
// caller to re-render on toast changes). Instead we keep a module-level
// snapshot that is kept in sync by the ToastContainer (which always
// subscribes via `useToaster`) and by every `useToast()` caller.
let _latestToasts: Toast[] = [];

function syncToasts(toasts: Toast[]): void {
  _latestToasts = toasts;
}

// ── Stable imperative actions ────────────────────────────────────────
//
// These are created once at module load and never re-created, so every
// caller receives the exact same function references across renders.
const stableShow = (props: ToastProps): string => {
  props.type = props.type ?? 'informational';

  // Do not show promotional toasts if there is already one
  if (
    _latestToasts.find((t) => {
      // @ts-expect-error - react-hot-toast doesn't recognize our promotional type
      return t.type === 'promotional';
    }) &&
    props.type === 'promotional'
  ) {
    if (__DEV__) {
      logger({
        message: 'There can only be one promotional toast at a time',
        type: 'warn',
        moduleName: 'Toast',
      });
    }
    return '';
  }

  const isPromoToast = props.type === 'promotional';
  if (props.autoDismiss === undefined) {
    // Promotional toasts should not auto dismiss
    props.autoDismiss = !isPromoToast;
  }

  if (props.duration === undefined) {
    // Set default durations
    if (isPromoToast) {
      props.duration = 8000;
    } else {
      props.duration = 4000;
    }
  }

  // If autoDismiss is false, set duration to infinity
  if (!props.autoDismiss) {
    props.duration = Infinity;
  }

  return toast.custom(({ visible, id }) => {
    return <ToastComponent {...props} id={id} isVisible={visible} />;
  }, props);
};

const stableDismiss = toast.dismiss;

const toastActions: ToastActions = {
  show: stableShow,
  dismiss: stableDismiss,
};

/**
 * Returns referentially-stable `show` and `dismiss` functions that do
 * **not** subscribe to the toast-state store.
 *
 * Use this instead of `useToast()` when your component only needs to
 * trigger toasts and never reads the active toasts list. Components
 * using `useToastActions()` will NOT re-render when toasts are shown
 * or dismissed.
 *
 * @example
 * ```tsx
 * const { show, dismiss } = useToastActions();
 * // show === show (same reference across re-renders)
 * ```
 */
const useToastActions = (): ToastActions => {
  return toastActions;
};

/**
 * Returns the full toast API: the active `toasts` list plus stable
 * `show` and `dismiss` functions.
 *
 * **Note:** This hook subscribes to the toast-state store, so the
 * calling component will re-render whenever a toast is shown or
 * dismissed. If you only need to show/dismiss toasts, prefer
 * `useToastActions()` to avoid unnecessary re-renders.
 */
const useToast = (): UseToastReturn => {
  const { toasts } = useToasterStore();
  // Keep the module-level snapshot in sync so `stableShow` can check
  // for active promotional toasts without a subscription.
  syncToasts(toasts);
  return {
    toasts: (toasts as unknown) as BladeToast[],
    show: stableShow,
    dismiss: stableDismiss,
  };
};

export type { UseToastReturn, ToastActions };
export { useToast, useToastActions, syncToasts };
