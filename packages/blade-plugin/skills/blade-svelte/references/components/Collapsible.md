## Component Name

Collapsible

## Description

Collapsible shows and hides a body under (or above) a trigger: a price breakdown, more details, advanced options. The trigger is `children`, your own Button or `Link variant="button"` (with a `CollapsibleChevron` for Blade's turning chevron), and the body is the `content` snippet; the wrapper toggles on a press, so the trigger wires nothing. It binds `isExpanded`, reports `onExpandChange({ isExpanded })`, opens downwards or with `direction="top"` above the trigger, and slides the body open and closed. It draws nothing of its own: the look is the trigger's and the body's.

## Important Constraints

- `children` is the trigger and `content` the body, both required; `children` may read `{ isExpanded }` as a snippet parameter
- The trigger wires nothing: a press on it toggles, unless its own handler calls `preventDefault()`. Its first focusable element gets `aria-expanded`, and `aria-controls` while the body shows
- `isExpanded` is bindable; there is no `defaultIsExpanded`. `onExpandChange` gets `{ isExpanded }`
- `CollapsibleChevron` only turns inside a Collapsible; put it after the trigger's label
- The body sits right against the trigger and is unmounted while collapsed; spacing and width inside it are yours (`class` on Collapsible, or your own wrapper)

## Props

```typescript
interface CollapsibleProps {
  /** Whether the body shows: initial, a `bind:isExpanded`, or host-driven. @default false */
  isExpanded?: boolean;
  /** The trigger toggled the body. */
  onExpandChange?: (change: { isExpanded: boolean }) => void;
  /** Where the body opens: under the trigger, or above it. @default 'bottom' */
  direction?: 'bottom' | 'top';
  /** The trigger: a Button or a Link. Receives `{ isExpanded }`. */
  children: Snippet<[{ isExpanded: boolean }]>;
  /** The body the trigger reveals. */
  content: Snippet;
  testID?: string;
  /** Placement and width only. */
  class?: string;
}

interface CollapsibleChevronProps {
  /** The chevron's icon size. @default 'medium' */
  size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
}
```

## Guidelines

- Use Collapsible to tuck away secondary detail next to what it explains; for a list of expandable rows on a card, use CardGroupItems with `content` (there is no Accordion).
- Use a `Link variant="button"` with a `CollapsibleChevron` for an inline "View details" trigger, and a Button for a prominent one.
- Read `{ isExpanded }` in the `children` snippet to change the trigger's label ("Show" / "Hide").
- Bind `isExpanded` when something outside the trigger opens or closes it.
- Use `direction="top"` when the trigger sits at the bottom of a panel.
- Don't add an `onClick` to the trigger to toggle it: the wrapper already does.

## Examples

### A link with a turning chevron

```svelte
<script lang="ts">
  import { Amount, Collapsible, CollapsibleChevron, Link, Text } from '@razorpay/blade-svelte/components';
</script>

<Collapsible>
  <Link variant="button">
    View price breakdown<CollapsibleChevron />
  </Link>
  {#snippet content()}
    <div class="flex min-w-[200px] flex-col gap-blade-2 pt-blade-3">
      <div class="flex items-baseline justify-between">
        <Text>Actual amount</Text>
        <Amount value={1000} />
      </div>
      <div class="flex items-baseline justify-between">
        <Text>Platform fees</Text>
        <Text>2%</Text>
      </div>
    </div>
  {/snippet}
</Collapsible>
```

### A Button trigger whose label follows the state

```svelte
<script lang="ts">
  import { Button, Collapsible, Text } from '@razorpay/blade-svelte/components';
</script>

<Collapsible onExpandChange={({ isExpanded }) => console.log('Expanded', isExpanded)}>
  {#snippet children({ isExpanded })}
    <Button variant="secondary" size="small">{isExpanded ? 'Hide' : 'Show'} advanced options</Button>
  {/snippet}
  {#snippet content()}
    <div class="pt-blade-4">
      <Text size="small" color="muted">Webhook retries, settlement holds and more.</Text>
    </div>
  {/snippet}
</Collapsible>
```

### Opened from outside, above its trigger

```svelte
<script lang="ts">
  import { Button, Collapsible, CollapsibleChevron, Link, Text } from '@razorpay/blade-svelte/components';

  let isExpanded = $state(false);
</script>

<div class="flex flex-col items-start gap-blade-4">
  <Button variant="secondary" onClick={() => (isExpanded = !isExpanded)}>Toggle from outside</Button>
  <Collapsible bind:isExpanded direction="top">
    <Link variant="button">
      Order summary<CollapsibleChevron size="small" />
    </Link>
    {#snippet content()}
      <div class="pb-blade-3"><Text>2 items · ₹1,299</Text></div>
    {/snippet}
  </Collapsible>
</div>
```
