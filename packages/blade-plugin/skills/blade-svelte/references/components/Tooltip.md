## Component Name

Tooltip

## Description

Tooltip shows a short hint in a dark bubble beside its trigger: on hover after a 300ms rest, at once on keyboard focus, and on a tap where there is no pointer. The bubble is at most 200px wide with an arrow toward the trigger, takes a `content` string or snippet and an optional `title`, and sits at `top` by default, flipping when that side lacks room and staying inside the overlay host. Tooltips share a delay group: while one is open the next opens at once, so the pointer can sweep along a row of them.

## Important Constraints

- `children` is the trigger, in a wrapper that listens for hover, focus and taps: make it focusable (a Button, an IconButton, a Link) so keyboard users reach the tooltip
- `content` is required: a string, or a snippet for rich content; there is no `maxWidth`
- Escape closes only the tooltip, never a modal beneath it; the page never goes inert
- `class` lands on the wrapper around the trigger and only places it; `testID` lands on the bubble
- Put nothing interactive in the bubble: it is a hint, not a panel (use Popover)

## Props

```typescript
type Placement =
  | 'top' | 'bottom' | 'left' | 'right'
  | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end'
  | 'left-start' | 'left-end' | 'right-start' | 'right-end';

interface TooltipProps {
  /** What it says: a string, or a snippet (it inherits the content's type). */
  content: string | Snippet;
  /** A semibold heading above the content: a string or a snippet. */
  title?: string | Snippet;
  /** The wanted side; the bubble flips when it lacks room. @default 'top' */
  placement?: Placement;
  /** Never opens; closes if open. @default false */
  isDisabled?: boolean;
  /** Fires on every open and close. */
  onOpenChange?: (change: { isOpen: boolean }) => void;
  /** Lands on the bubble. */
  testID?: string;
  /** Placement only, on the wrapper around the trigger. */
  class?: string;
  /** The trigger; `isOpen` is there to read. */
  children: Snippet<[{ isOpen: boolean }]>;
}
```

## Guidelines

- Use Tooltip to name an icon-only control or add a one-line hint; use Popover when the user needs to read more or act.
- Keep `content` to one short sentence; add a `title` only when the hint needs a heading.
- Don't hide information the user needs to finish a task in a tooltip: on touch it only shows on a tap.
- Don't wrap a disabled control: it takes no focus, so the keyboard never reaches the tooltip.

## Examples

### A hint on a button

```svelte
<script lang="ts">
  import { Button, Tooltip } from '@razorpay/blade-svelte/components';
</script>

<Tooltip content="Charged by your bank, not the merchant">
  <Button variant="secondary">Convenience fee</Button>
</Tooltip>
```

### An icon-only control, with a title, below it

```svelte
<script lang="ts">
  import { IconButton, Tooltip } from '@razorpay/blade-svelte/components';
  import { InfoIcon } from '@razorpay/blade-svelte/icons';
</script>

<Tooltip title="Secure payment" content="Card details are encrypted and never stored by the merchant." placement="bottom-start">
  <IconButton icon={InfoIcon} accessibilityLabel="About secure payment" />
</Tooltip>
```

### Rich content

```svelte
<script lang="ts">
  import { Link, Tooltip } from '@razorpay/blade-svelte/components';
</script>

<Tooltip placement="right">
  {#snippet content()}
    <span>Settles in <strong>T+2</strong> working days</span>
  {/snippet}
  <Link href="#settlements">Settlement time</Link>
</Tooltip>
```
