import type { Snippet } from 'svelte';
import type { StyledPropsBlade } from '@razorpay/blade-core/utils';
import type { IconComponent } from '../Icons';

/**
 * Visual style of the toast.
 * - `informational`: colored background based on `color`
 * - `promotional`: gray background, large layout for marketing content
 */
export type ToastType = 'informational' | 'promotional';

/**
 * Feedback color tone applied to informational toasts.
 */
export type ToastColor = 'information' | 'negative' | 'neutral' | 'notice' | 'positive';

/**
 * Callback payload fired when the dismiss button is clicked or the action button is pressed.
 */
export type ToastCallbackPayload = {
  event: MouseEvent;
  toastId: string;
};

/**
 * Action button rendered alongside the toast content.
 */
export type ToastAction = {
  /** Label of the action button */
  text: string;
  /** Click callback receives `event` and the toast `toastId` */
  onClick?: (payload: ToastCallbackPayload) => void;
  /**
   * Shows a loading spinner inside the action button
   * @default false
   */
  isLoading?: boolean;
};

export interface ToastProps extends StyledPropsBlade {
  /**
   * Visual style of the toast.
   *
   * Promotional toasts use a gray background and a more prominent layout suited
   * for marketing content. Informational toasts pick up the `color` prop for
   * feedback signalling.
   * @default 'informational'
   */
  type?: ToastType;

  /**
   * Body content. Pass a string or a Svelte snippet.
   *
   * For `informational` toasts, a string is rendered inside a small static-white
   * `Text`. For `promotional` toasts, the content is rendered as-is so callers
   * can compose richer layouts (heading + image + caption, etc.).
   */
  content: Snippet | string;

  /**
   * Feedback color applied to informational toasts. Ignored when
   * `type === 'promotional'`.
   * @default 'neutral'
   */
  color?: ToastColor;

  /**
   * Optional leading icon. When omitted, informational toasts derive an icon
   * from `color` (positive → CheckCircle, negative → AlertOctagon, etc.).
   */
  leading?: IconComponent;

  /**
   * Auto-dismiss the toast after `duration` ms.
   *
   * Defaults are wired in `useToast`: informational toasts auto-dismiss
   * (`true`), promotional toasts do not (`false`).
   */
  autoDismiss?: boolean;

  /**
   * Lifetime of the toast in milliseconds when `autoDismiss` is `true`.
   *
   * Defaults are wired in `useToast`: 4000 for informational, 8000 for
   * promotional.
   */
  duration?: number;

  /**
   * Called when the user clicks the dismiss button (also when the toast
   * auto-dismisses if your store wires it that way).
   */
  onDismissButtonClick?: (payload: ToastCallbackPayload) => void;

  /**
   * Optional primary action rendered as a button.
   */
  action?: ToastAction;

  /**
   * Stable identifier for the toast. Generated automatically by
   * `useToast.show()` if not provided. Use it for programmatic dismiss.
   */
  id?: string;

  /**
   * Whether the toast is currently visible. Set internally by
   * `ToastContainer` to drive the enter/exit animation. End users typically
   * do not pass this directly.
   * @default true
   */
  isVisible?: boolean;

  /**
   * Test ID applied to the toast root element.
   */
  testID?: string;

  /** Analytics data attributes. */
  [key: `data-analytics-${string}`]: string;
}

/**
 * Internal toast record stored by `toastStore`.
 *
 * Mirrors the shape that `ToastContainer` needs to lay out and animate the
 * toast stack: every prop forwarded to `<Toast>`, plus container-managed
 * fields (`visible`, `height`, `createdAt`, `pausedAt`).
 */
export type BladeToast = ToastProps & {
  /** Always present once the toast is in the store */
  id: string;
  /** Driven by container; toggled false on dismiss to play the exit animation */
  visible: boolean;
  /** Measured by `ToastContainer` via `bind:clientHeight`. `undefined` until first paint. */
  height?: number;
  /** Timestamp when the toast was created (for ordering) */
  createdAt: number;
  /** Timestamp when the auto-dismiss timer was paused (hover/touch). `null` if running. */
  pausedAt: number | null;
};

/**
 * Return shape of the `useToast` helper.
 *
 * `toasts` is the live `writable` from `toastStore` so consumers can either
 * `$toasts` (auto-subscribe inside Svelte) or call `toasts.subscribe(...)`
 * outside Svelte.
 */
export type UseToastReturn = {
  show: (props: ToastProps) => string;
  dismiss: (id?: string) => void;
  toasts: import('svelte/store').Writable<BladeToast[]>;
};

export interface ToastContainerProps extends StyledPropsBlade {
  /**
   * Offset from the bottom of the viewport to the toast container, in pixels.
   * Useful when you need toasts to clear a fixed footer.
   * @default 16 (mobile) / 24 (desktop)
   */
  offsetBottom?: number;

  /**
   * Custom z-index for the container. Use to layer toasts above modals.
   * @default 2001
   */
  zIndex?: number;

  /**
   * Test ID applied to the container element.
   */
  testID?: string;

  /** Analytics data attributes. */
  [key: `data-analytics-${string}`]: string;
}
