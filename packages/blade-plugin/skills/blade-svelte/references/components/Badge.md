## Component Name

Badge

## Description

Badge is a small, non-interactive pill that labels a status or attribute: Paid, Failed, Beta, New, an offer. It comes in six colours (`neutral`, `information`, `positive`, `notice`, `negative`, `primary`), a tinted (`subtle`) or filled (`intense`) emphasis and three sizes (16, 20 and 24px tall), and takes an optional leading icon. The label stays on one line and carries its full text as a tooltip-style `title` when cut off.

## Important Constraints

- The label is `children`, short text; it is not clickable (use Chip for a choice, Button for an action)
- `icon` takes an icon source from `@razorpay/blade-svelte/icons`, never a component; it is drawn before the label in the label's colour (8px at `small`, 12px above)
- `size` is `small`, `medium` or `large`; React's `xsmall` does not exist
- For a number, use Counter
- `class` places it; its look is `color`, `emphasis` and `size`

## Props

```typescript
type BadgeColor = 'neutral' | 'information' | 'positive' | 'notice' | 'negative' | 'primary';

interface BadgeProps {
  /** @default 'neutral' */
  color?: BadgeColor;
  /** `subtle` is tinted with medium-weight text; `intense` is filled with white, regular-weight text. @default 'subtle' */
  emphasis?: 'subtle' | 'intense';
  /** 16, 20 or 24px tall. @default 'medium' */
  size?: 'small' | 'medium' | 'large';
  /** Before the label, in its colour. */
  icon?: IconSource;
  /** The label: text. */
  children: Snippet;
  testID?: string;
  /** Placement only. */
  class?: string;
}
```

## Guidelines

- Map colour to meaning: `positive` for success, `negative` for failure, `notice` for pending or attention, `information` for neutral facts, `primary` for brand highlights like "New".
- Use `subtle` by default; keep `intense` for the one badge that must stand out.
- Keep labels to one or two words.
- Use `icon` for an icon, never an `<Icon>` inside `children`: the badge spaces its own icon.
- Don't restyle it with `bg-*`, `text-*` or `px-*` classes.

## Examples

### Status colours

```svelte
<script lang="ts">
  import { Badge } from '@razorpay/blade-svelte/components';
</script>

<div class="flex flex-wrap items-center gap-blade-3">
  <Badge color="positive">Captured</Badge>
  <Badge color="negative">Failed</Badge>
  <Badge color="notice">Pending</Badge>
  <Badge color="information">Refunded</Badge>
  <Badge>Draft</Badge>
  <Badge color="primary" emphasis="intense">New</Badge>
</div>
```

### Sizes with an icon

```svelte
<script lang="ts">
  import { Badge } from '@razorpay/blade-svelte/components';
  import { CheckCircleIcon, ClockIcon } from '@razorpay/blade-svelte/icons';
</script>

<div class="flex flex-wrap items-center gap-blade-3">
  <Badge size="small" color="positive" icon={CheckCircleIcon}>Verified</Badge>
  <Badge color="positive" icon={CheckCircleIcon}>Verified</Badge>
  <Badge size="large" color="notice" icon={ClockIcon}>Awaiting KYC</Badge>
</div>
```

### Next to a title

```svelte
<script lang="ts">
  import { Badge, Heading } from '@razorpay/blade-svelte/components';
</script>

<div class="flex items-center gap-blade-3">
  <Heading as="h2" size="small">Payment links</Heading>
  <Badge color="primary" size="small">Beta</Badge>
</div>
```
