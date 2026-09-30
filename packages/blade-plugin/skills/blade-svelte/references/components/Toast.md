## Component Name

Toast

## Description

Toast shows short, transient feedback, such as "Payment captured" or "Refund failed", in a stack at the bottom-left of the viewport. Render `ToastContainer` once at the app root and call `useToast()` to `show` and `dismiss` toasts from any component or `.ts` module. Informational toasts are colored by feedback `color`; promotional toasts are gray, larger and hold rich snippet content with an action.

## Important Constraints

- Toasts render only when a `ToastContainer` is mounted; render it once at the app root
- Show toasts with `useToast().show(props)`; don't render `<Toast>` directly in your markup
- Only one promotional toast can be active at a time; `show` returns `''` and logs a warning in dev for a second one
- `autoDismiss` defaults to `true` for informational toasts (4000 ms) and `false` for promotional toasts (8000 ms when enabled). This differs from React, where `autoDismiss` defaults to `false`
- Auto-dismiss timers pause while the pointer is over the stack (or after a tap on mobile)
- The dismiss button always removes the toast; `onDismissButtonClick` fires only on that manual click, not on auto-dismiss
- `color` is ignored for promotional toasts, and promotional toasts show no icon unless `leading` is passed
- `useToast` is a plain function, not a hook; its `toasts` is a Svelte `Writable` store, so read it as `$toasts`

## TypeScript Types

These are the props `Toast` (passed to `useToast().show`) and `ToastContainer` accept, plus the `useToast` return type.

```typescript
import type { Writable } from 'svelte/store';

/**
 * Visual style of the toast.
 * - `informational`: colored background based on `color`
 * - `promotional`: gray background, large layout for marketing content
 */
type ToastType = 'informational' | 'promotional';

/**
 * Feedback color tone applied to informational toasts.
 */
type ToastColor = 'information' | 'negative' | 'neutral' | 'notice' | 'positive';

/**
 * Callback payload fired when the dismiss button is clicked or the action button is pressed.
 */
type ToastCallbackPayload = {
  event: MouseEvent;
  toastId: string;
};

/**
 * Action button rendered alongside the toast content.
 */
type ToastAction = {
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

type IconSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge';

/**
 * Any icon exported by @razorpay/blade-svelte/components, e.g. InfoIcon.
 * Color values are the icon color tokens listed in Icons.md.
 */
type IconComponent = Component<{ size?: IconSize; color?: string }>;

interface ToastProps extends StyledPropsBlade {
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

interface ToastContainerProps extends StyledPropsBlade {
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

/**
 * A toast in the live store: every ToastProps field plus container-managed state.
 */
type BladeToast = ToastProps & {
  /** Always present once the toast is in the store */
  id: string;
  /** Driven by container; toggled false on dismiss to play the exit animation */
  visible: boolean;
  /** Measured by `ToastContainer`. `undefined` until first paint. */
  height?: number;
  /** Timestamp when the toast was created (for ordering) */
  createdAt: number;
  /** Timestamp when the auto-dismiss timer was paused (hover/touch). `null` if running. */
  pausedAt: number | null;
};

/**
 * Return shape of `useToast()`.
 * `toasts` is a live Svelte store: use `$toasts` inside components.
 */
type UseToastReturn = {
  /** Shows a toast and returns its id */
  show: (props: ToastProps) => string;
  /** Dismisses one toast by id, or every toast when called without an id */
  dismiss: (id?: string) => void;
  toasts: Writable<BladeToast[]>;
};
```

## Usage Guidelines

**Do**

- Use `Toast` for brief, non-blocking confirmations after an action, such as "Refund of ₹499 initiated".
- Call `useToast()` once at the top of a component script and reuse the returned `show` and `dismiss`.
- Match `color` to the outcome: `positive` for success, `negative` for failures, `notice` for pending states, `information` or `neutral` for facts.
- Keep informational content to one short sentence and action labels to one verb, such as "Undo" or "Retry".
- Dismiss the toast from its action with `toast.dismiss(toastId)` when the action completes the task.
- Pass `autoDismiss: false` for informational toasts whose action the user needs time to reach.
- Use `type: 'promotional'` for a single feature announcement with a heading, image and call to action.
- Raise `ToastContainer`'s `zIndex` when toasts must appear above a custom overlay, and use `offsetBottom` to clear a fixed footer.

**Don't**

- Don't use a Toast for errors the user must act on before continuing; use `Alert` or a `Modal`.
- Don't use a Toast for persistent status tied to a section; use `Alert`.
- Don't render more than one `ToastContainer`; mount one at the app root.
- Don't queue several promotional toasts; show one and wait for it to be dismissed.
- Don't rely on `onDismissButtonClick` to detect auto-dismiss; watch `$toasts` instead.
- Don't put form fields or long paragraphs in a Toast; use a `Modal` or `BottomSheet`.

## Examples

### Refund feedback with an undo action

An app-root `ToastContainer` plus informational toasts that report the outcome of a refund, with an action that dismisses the toast.

```svelte
<script lang="ts">
  import { Button, ToastContainer, useToast } from '@razorpay/blade-svelte/components';

  const toast = useToast();

  let isRefunding = $state(false);

  const initiateRefund = async (): Promise<void> => {
    isRefunding = true;
    try {
      await fetch('/api/payments/pay_29QQoUBi66xm2f/refund', { method: 'POST' });
      toast.show({
        content: 'Refund of ₹499 initiated',
        color: 'positive',
        autoDismiss: false,
        testID: 'refund-toast',
        action: {
          text: 'Undo',
          onClick: ({ toastId }) => toast.dismiss(toastId),
        },
        onDismissButtonClick: ({ toastId }) => console.info('dismissed', toastId),
      });
    } catch {
      toast.show({ content: 'Refund failed, please retry', color: 'negative', duration: 6000 });
    } finally {
      isRefunding = false;
    }
  };
</script>

<Button variant="primary" isLoading={isRefunding} onClick={initiateRefund}>Refund ₹499</Button>

<ToastContainer offsetBottom={72} />
```

### Promotional toast with snippet content

A single promotional toast whose content is a snippet; the trigger is disabled while one is already showing.

```svelte
<script lang="ts">
  import { Button, Heading, InfoIcon, Text, useToast } from '@razorpay/blade-svelte/components';

  const toast = useToast();
  const { toasts } = toast;

  const hasPromo = $derived($toasts.some((item) => item.type === 'promotional' && item.visible));

  const showTurboUpiPromo = (): void => {
    toast.show({
      type: 'promotional',
      leading: InfoIcon,
      content: turboUpiContent,
      action: {
        text: 'Try Turbo UPI',
        onClick: ({ toastId }) => toast.dismiss(toastId),
      },
    });
  };
</script>

{#snippet turboUpiContent()}
  <Heading size="small">Introducing Turbo UPI</Heading>
  <Text size="small" marginTop="spacing.2">
    Customers complete UPI payments in-app, with no redirects to third-party apps.
  </Text>
{/snippet}

<Button variant="secondary" isDisabled={hasPromo} onClick={showTurboUpiPromo}>
  Show what's new
</Button>
```
