## Component Name

Divider

## Description

Divider is a thin line that separates content: rows in a list, sections of a card, items in a toolbar. It renders an `<hr>` (a separator to assistive tech) that is horizontal by default or vertical in a flex row, solid or dashed, in three gray shades (`surface.border.gray.{variant}`) and four of Blade's border widths. It has no margin of its own: spacing around it goes in `class`.

## Important Constraints

- A horizontal divider is a bottom border that grows along its parent (`flex-grow` in a flex row); a vertical one is a left border stretched to the row's height, so put it in a flex row
- A vertical divider needs a parent with a height: a flex row whose items give it one, or a fixed `h-*`
- Spacing around the line goes in `class` (`my-blade-4`, `mx-blade-3`); so does a fixed width or height
- Its look is `variant`, `thickness` and `dividerStyle`, never colour or border classes
- The prop is `dividerStyle`, not `line` or `style`

## Props

```typescript
type DividerOrientation = 'horizontal' | 'vertical';
type DividerStyle = 'solid' | 'dashed';
type DividerVariant = 'normal' | 'subtle' | 'muted';
type DividerThickness = 'thinner' | 'thin' | 'thick' | 'thicker';

interface DividerProps {
  /** `vertical` sets `aria-orientation` and stretches across a flex row. @default 'horizontal' */
  orientation?: DividerOrientation;
  /** @default 'solid' */
  dividerStyle?: DividerStyle;
  /** The line's colour: `surface.border.gray.{variant}`. @default 'muted' */
  variant?: DividerVariant;
  /** The line's width, Blade's border widths. @default 'thin' */
  thickness?: DividerThickness;
  testID?: string;
  /** Spacing around the line, and a width or height. */
  class?: string;
}
```

## Guidelines

- Keep the default `muted` `thin` line for separating content; use `normal` or a thicker line only where a section needs a stronger break.
- Use `dashed` for a soft break, such as before a total in a bill.
- Put the spacing on the Divider (`my-blade-4`) or use `gap-*` on the parent, not both.
- Don't draw a separator with a bordered `<div>`: use Divider.
- Don't put a Divider between a CardHeader or CardFooter and the body: they draw their own hairline (`showDivider`).

## Examples

### Between sections

```svelte
<script lang="ts">
  import { Divider, Text } from '@razorpay/blade-svelte/components';
</script>

<div class="flex max-w-[24rem] flex-col">
  <Text>Subtotal ₹1,800</Text>
  <Text>GST ₹200</Text>
  <Divider class="my-blade-4" dividerStyle="dashed" />
  <Text weight="semibold">Total ₹2,000</Text>
</div>
```

### Vertical, in a row

```svelte
<script lang="ts">
  import { Divider, Link } from '@razorpay/blade-svelte/components';
</script>

<div class="flex h-blade-7 items-center gap-blade-4">
  <Link href="/terms" size="small">Terms</Link>
  <Divider orientation="vertical" />
  <Link href="/privacy" size="small">Privacy</Link>
  <Divider orientation="vertical" />
  <Link href="/help" size="small">Help</Link>
</div>
```

### Variants and thickness

```svelte
<script lang="ts">
  import { Divider } from '@razorpay/blade-svelte/components';
</script>

<div class="flex flex-col gap-blade-5">
  <Divider variant="subtle" />
  <Divider />
  <Divider variant="normal" thickness="thick" />
  <Divider variant="normal" thickness="thicker" dividerStyle="dashed" />
</div>
```
