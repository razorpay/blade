## Component Name

Display

## Description

Display sets the largest text in Blade, the Display styles from 48 to 72px in the heading face, for hero headlines, landing-page statements and a single big number. It comes in four sizes, three weights and four colours, and renders an `h1` by default (`h2`–`h6` or a `span` otherwise), a level chosen apart from its size. It has no behaviour of its own.

## Important Constraints

- The text is `children`, a snippet (plain text between the tags works)
- `as` defaults to `h1`; use `as="span"` when the Display is decoration (a big figure) and not the page's title
- `color` is `default`, `muted`, `primary` or `inherit` (Heading's colours)
- `class` places it and may set text alignment; its look is `size`, `weight` and `color`

## Props

```typescript
type DisplaySize = 'small' | 'medium' | 'large' | 'xlarge';

interface DisplayProps {
  /** The element; independent of the visual `size`. @default 'h1' */
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  /** 48/56, 56/64, 64/70 or 72/78px (size/line height). @default 'small' */
  size?: DisplaySize;
  /** Semibold sets at 0% letter-spacing, regular and medium at -1.3%. @default 'semibold' */
  weight?: 'regular' | 'medium' | 'semibold';
  /** @default 'default' */
  color?: 'default' | 'muted' | 'primary' | 'inherit';
  /** @default 'start' */
  textAlign?: 'start' | 'center' | 'end';
  /** The text. */
  children: Snippet;
  testID?: string;
  /** Placement and text alignment only. */
  class?: string;
}
```

## Guidelines

- Use at most one Display per view, for the one thing the page is about.
- Use `as="span"` for a big figure that is not a title, and keep the real `h1` elsewhere.
- For a big money figure use Amount with `type="display"`, which formats the currency and decimals.
- Use Heading for page and section titles; Display is for hero and marketing moments.
- Don't shrink a Display with classes on small screens; pick a smaller `size`, or a Heading.

## Examples

### A hero headline

```svelte
<script lang="ts">
  import { Button, Display, Text } from '@razorpay/blade-svelte/components';
</script>

<section class="flex flex-col items-center gap-blade-5 px-blade-5 py-blade-10">
  <Display size="medium" textAlign="center">Payments, made simple</Display>
  <Text size="large" color="subtle" textAlign="center">One integration for UPI, cards and netbanking.</Text>
  <Button size="large">Get started</Button>
</section>
```

### A big figure

```svelte
<script lang="ts">
  import { Display, Text } from '@razorpay/blade-svelte/components';
</script>

<div class="flex flex-col gap-blade-2">
  <Text size="small" color="muted">Merchants onboarded</Text>
  <Display as="span" size="small" weight="medium" color="primary">10,000,000+</Display>
</div>
```
