## Component Name

ToastContainer

## Description

Toasts are short, timed messages (a card removed, a link copied) shown by calling `showToast` from anywhere and rendered by the one `ToastContainer` the app mounts inside its BladeProvider. A toast is data, not markup: `showToast(toast, { cancelled })` takes a string or an options object (`content`, `color`, `leading`, `action`, `duration`…) and returns a promise of why it left (`timeout`, `dismiss`, `evicted`, `cleared`); resolving `cancelled`, from `createCancel()`, dismisses it. The container stacks them at the bottom (or `top`) of the overlay host, over open modals, newest in front, three at most.

## Important Constraints

- Render exactly one `ToastContainer`, inside the app's BladeProvider; two containers on one queue show every toast twice. Without one, no toast shows and no toast code ships
- There is no `useToast()`, toast id or `dismiss(id)`: call `showToast`; to take a toast away, pass `{ cancelled }` and resolve it (`createCancel()` gives `{ cancelled, cancel(), isCancelled }`)
- `showToast`'s options are data: `leading` is an icon source or `{ image, alt }`, never a snippet; `content` is a string
- Pressing the `action` does not dismiss the toast: call `cancel()` when the action is done. An `action.onClick` that returns a promise shows the action busy until it settles; a rejection goes to `adapters.reportError`
- The dismiss button always shows; `duration` defaults to the container's (4000ms unless its `duration` or `defaults.ToastContainer.duration` says otherwise), and `autoDismiss: false` keeps the toast until it is dismissed
- `showToast` from `/components` adds to the page's one queue, from a component or a `.ts` flow; the app's one `ToastContainer` shows it. There is no per-provider queue
- Toasts push no layer: nothing goes inert, focus stays put, Escape is not theirs; a `negative` toast is announced as an `alert`, the rest politely

## Props

```typescript
type ToastColor = 'neutral' | 'information' | 'positive' | 'notice' | 'negative';
type ToastDismissReason = 'timeout' | 'dismiss' | 'evicted' | 'cleared';

interface ToastContainerProps {
  /** The edge of the overlay host the stack sits on. @default 'bottom' */
  placement?: 'bottom' | 'top';
  /**
   * ms a toast stays when `showToast` passes no `duration`; also settable for
   * the app as BladeProvider's `defaults.ToastContainer.duration`. @default 4000
   */
  duration?: number;
  /** Localized; names the region for a screen reader. @default 'Notifications' */
  accessibilityLabel?: string;
  testID?: string;
  /** Placement only: Blade React's `offsetBottom` is a margin here (`mb-*`). */
  class?: string;
}

/** What `showToast(toast, control?)` takes as `toast` (or a plain string, its `content`). */
type ShowToastOptions = {
  /** What the toast says. */
  content: string;
  /** The colour; each brings its glyph (info, check-circle, alert-triangle, alert-octagon). @default 'neutral' */
  color?: ToastColor;
  /** In place of the colour's glyph: an icon source, or an image (a bank's logo, 20px). */
  leading?: IconSource | { image: string; alt?: string };
  /** ms before it goes. @default 4000 */
  duration?: number;
  /** `false`: it stays until dismissed. @default true */
  autoDismiss?: boolean;
  /** One inline button; a returned promise shows it busy. Pressing it does not dismiss. */
  action?: { text: string; onClick: () => void | Promise<unknown> };
  /** The dismiss button was pressed. */
  onDismissButtonClick?: () => void;
  /** The dismiss button's name. @default 'Dismiss toast' */
  closeLabel?: string;
  /** It went, with the same reason the promise resolves with. */
  onDismiss?: (reason: ToastDismissReason) => void;
  testID?: string;
};
```

## Guidelines

- Use a toast for a brief confirmation of something the user just did; use an Alert for a message that must stay on the page, and a Modal for a decision.
- Keep `content` to one short sentence; offer at most one `action` (Undo, Retry).
- Use `color="positive"` for success and `negative` for a failure; leave `neutral` for plain confirmations.
- Call `showToast` from `.ts` flows as freely as from components: it needs no context.
- Don't `await` a toast before continuing a flow unless you need why it left: the promise resolves only when it goes.
- Don't render ToastContainer per page or per component: once, beside the app inside BladeProvider.

## Examples

### The container, once, and a toast from a button

```svelte
<script lang="ts">
  import { BladeProvider, Button, ToastContainer, showToast } from '@razorpay/blade-svelte/components';
</script>

<div class="relative min-h-screen">
  <BladeProvider>
    <Button onClick={() => showToast({ content: 'Payment link copied', color: 'positive' })}>Copy link</Button>
    <ToastContainer />
  </BladeProvider>
</div>
```

### Undo, with an action that cancels the toast

```svelte
<script lang="ts">
  import { Button, createCancel, showToast } from '@razorpay/blade-svelte/components';
  import { CreditCardIcon } from '@razorpay/blade-svelte/icons';

  let { restore }: { restore: () => Promise<void> } = $props();
  let outcome = $state('');

  async function remove(): Promise<void> {
    const request = createCancel();
    const reason = await showToast(
      {
        content: 'Card ending 4421 removed',
        leading: CreditCardIcon,
        action: {
          text: 'Undo',
          // Busy until the promise settles; then the toast is taken away.
          onClick: async () => {
            await restore();
            request.cancel();
          },
        },
      },
      { cancelled: request.cancelled },
    );
    outcome = request.isCancelled ? 'undone' : reason;
  }
</script>

<Button variant="secondary" color="negative" onClick={remove}>Remove card</Button>
```

### A failure that stays, at the top

```svelte
<script lang="ts">
  import { Button, ToastContainer, showToast } from '@razorpay/blade-svelte/components';

  function fail(): void {
    void showToast({
      content: 'Payment failed. No money was debited.',
      color: 'negative',
      autoDismiss: false,
      closeLabel: 'Dismiss',
    });
  }
</script>

<Button onClick={fail}>Pay</Button>
<!-- The app's one container; `placement` could also come from BladeProvider's defaults. -->
<ToastContainer placement="top" />
```
