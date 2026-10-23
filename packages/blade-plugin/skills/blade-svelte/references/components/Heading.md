## Component Name

Heading

## Description

Heading titles a page, section, card or dialog in Blade's Heading styles, in the heading face (Tasa). It comes in five sizes from 18 to 40px, regular or semibold, and four colours, and renders `h1` to `h6` (default `h2`), a document level chosen apart from its visual size. It has no behaviour of its own.

## Important Constraints

- The title is `children`, a snippet (plain text between the tags works)
- `as` sets the document level (`h1`–`h6`, default `h2`) and is independent of `size`: pick the level from the page's outline, the size from the design
- `weight` is `regular` or `semibold` only (no `medium`)
- `color` is `default`, `muted`, `primary` or `inherit` only; there is no `subtle`, `negative`, `positive` or `white` heading
- `class` places it and may set text alignment; its look is `size`, `weight` and `color`

## Props

```typescript
type HeadingSize = 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge';

interface HeadingProps {
  /** The document level; independent of the visual `size`. @default 'h2' */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  /** 18/24, 20/26, 24/32, 32/38 or 40/46px (size/line height). @default 'medium' */
  size?: HeadingSize;
  /** @default 'semibold' */
  weight?: 'regular' | 'semibold';
  /** @default 'default' */
  color?: 'default' | 'muted' | 'primary' | 'inherit';
  /** @default 'start' */
  textAlign?: 'start' | 'center' | 'end';
  /** The title. */
  children: Snippet;
  testID?: string;
  /** Placement and text alignment only. */
  class?: string;
}
```

## Guidelines

- Set `as` to keep the heading levels in order (one `h1` per page), whatever size the design asks for.
- Use `small` or `medium` for card and section titles, `large` and above for page titles.
- Pair a Heading with a `Text color="muted"` line below it for a subtitle, inside your own flex column with a `gap-blade-*` class.
- Use Display for hero numbers and marketing headlines above 40px.
- Don't use Heading for body text that only needs to be bold: use `Text weight="semibold"`.
- Don't change its size or font through `class`.

## Examples

### Sizes and levels

```svelte
<script lang="ts">
  import { Heading } from '@razorpay/blade-svelte/components';
</script>

<div class="flex flex-col gap-blade-3">
  <Heading as="h1" size="xlarge">Payments</Heading>
  <Heading as="h2" size="large">Today</Heading>
  <Heading as="h3" size="medium">Failed payments</Heading>
  <Heading as="h4" size="small" weight="regular" color="muted">Last 7 days</Heading>
</div>
```

### A section title with a subtitle

```svelte
<script lang="ts">
  import { Button, Heading, Text } from '@razorpay/blade-svelte/components';
</script>

<header class="flex items-start justify-between gap-blade-4">
  <div class="flex flex-col gap-blade-1">
    <Heading as="h2" size="small">Settlements</Heading>
    <Text size="small" color="muted">Money moved to your bank account</Text>
  </div>
  <Button variant="secondary" size="small">Download report</Button>
</header>
```

### Centred

```svelte
<script lang="ts">
  import { Heading, Text } from '@razorpay/blade-svelte/components';
</script>

<div class="flex flex-col items-center gap-blade-2 p-blade-7">
  <Heading as="h1" size="large" textAlign="center">Your store is live</Heading>
  <Text textAlign="center" color="subtle">Share the link to start taking orders.</Text>
</div>
```
