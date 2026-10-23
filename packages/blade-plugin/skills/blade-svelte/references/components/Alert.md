## Component Name

Alert

## Description

Alert is an inline message on the page: an icon, an optional title, a description and a dismiss button, in one of six colours and a `subtle` or `intense` emphasis. It spans its container (on desktop, `d`, the content centres on the row), brings the colour's icon unless given one, and slides shut when dismissed; a bound `isOpen` brings it back. `negative` and `notice` announce as `role="alert"` (`notice` politely), the rest as `role="status"`.

## Important Constraints

- `description` is required: a string, or a snippet holding text and at most a Link
- It is dismissible by default (`isDismissible` defaults to `true`): pass `isDismissible={false}` for a message that must stay
- Dismissing calls `onDismiss`, then sets `isOpen` to `false`; bind `isOpen` to show it again
- `icon` takes an icon source from `@razorpay/blade-svelte/icons`; without it, the colour's icon shows (info, check-circle, alert-triangle, alert-octagon)
- There is no `actions`, `isFullWidth` or `maxWidth`: put buttons beside the alert in your own layout, and cap its width with `class` (`max-w-[584px]`)
- A field's own error line is not an Alert: use the input's `errorText`

## Props

```typescript
type AlertColor = 'neutral' | 'information' | 'positive' | 'notice' | 'negative' | 'primary';

interface AlertProps {
  /** The message: text, or a snippet (a Link at most). */
  description: string | Snippet;
  /** A heading line above the description. */
  title?: string | Snippet;
  /** @default 'neutral' */
  color?: AlertColor;
  /** `subtle`: the colour's tinted fill with gray text; `intense`: its solid fill, everything white. @default 'subtle' */
  emphasis?: 'subtle' | 'intense';
  /** Before the text. @default the colour's icon */
  icon?: IconSource;
  /** Shows the dismiss button; pressing it closes the alert. @default true */
  isDismissible?: boolean;
  /** The dismiss button was pressed, before the alert closes. */
  onDismiss?: () => void;
  /** Bindable. Whether it shows; dismissing sets it to `false`. @default true */
  isOpen?: boolean;
  /** The dismiss button's accessible name. @default 'Dismiss alert' */
  closeLabel?: string;
  testID?: string;
  /** Placement only: margin, a width cap. */
  class?: string;
}
```

## Guidelines

- Use Alert for a message about the page or the flow that should stay in view; use a toast for a passing confirmation.
- Pick the colour by meaning: `negative` for a failure, `notice` for a warning, `positive` for success, `information` or `neutral` for context.
- Use `emphasis="intense"` sparingly, for the one message the user must not miss.
- Keep the description to one or two sentences; add a `title` when it needs a summary.
- Don't use an alert as a container for a form or buttons.

## Examples

### Colours and a title

```svelte
<script lang="ts">
  import { Alert } from '@razorpay/blade-svelte/components';
</script>

<div class="flex flex-col gap-blade-4">
  <Alert color="information" description="Payouts are paused on bank holidays." isDismissible={false} />
  <Alert color="positive" title="KYC verified" description="You can now accept international payments." />
  <Alert color="negative" emphasis="intense" title="Payment failed" description="No money was debited. Try another method." />
</div>
```

### A custom icon and a link in the description

```svelte
<script lang="ts">
  import { Alert, Link } from '@razorpay/blade-svelte/components';
  import { BankIcon } from '@razorpay/blade-svelte/icons';
</script>

<Alert color="notice" icon={BankIcon} class="max-w-[584px]">
  {#snippet description()}
    HDFC Bank netbanking is slow right now. <Link href="#status" size="small">See status</Link>
  {/snippet}
</Alert>
```

### Bring it back after a dismiss

```svelte
<script lang="ts">
  import { Alert, Button } from '@razorpay/blade-svelte/components';

  let isOpen = $state(true);
</script>

<div class="flex flex-col items-start gap-blade-4">
  <Alert bind:isOpen color="primary" description="Try UPI for instant refunds." />
  {#if !isOpen}
    <Button size="small" variant="secondary" onClick={() => (isOpen = true)}>Show tip again</Button>
  {/if}
</div>
```
