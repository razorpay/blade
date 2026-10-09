## Component Name

Box

## Description

Box is a minimal layout primitive: a polymorphic element (`div`, `section`, `header`, `nav`, ...) that forwards `className` and standard HTML attributes to the DOM. Unlike React Blade's Box it has no style props; lay it out with utility classes, either Blade's global layout classes from `theme.css` (`display-flex`, `flex-col`, `gap-spacing-4`, `items-center`, `justify-between`, `margin-*-spacing-*`) or your own utility CSS such as Tailwind.

## Important Constraints

- Box has no styled props. `display`, `gap`, `padding`, `margin`, `backgroundColor`, `elevation` and every other React Box style prop are not supported; props that aren't HTML attributes are written to the DOM as unknown attributes and have no visual effect.
- Box takes `className`, not `class`, and does not accept `style`.
- `as` only accepts `div`, `section`, `footer`, `header`, `main`, `aside`, `nav`, `span` and `label`.
- `this` is not supported; Box does not expose a DOM node reference.

## TypeScript Types

These are the props the Box component accepts. Standard HTML attributes (`id`, `role`, `aria-*`, `onclick`, ...) come from Svelte's `HTMLAttributes`.

```typescript
import type { HTMLAttributes } from 'svelte/elements';

type BoxAs = 'div' | 'section' | 'footer' | 'header' | 'main' | 'aside' | 'nav' | 'span' | 'label';

type BoxProps = Omit<HTMLAttributes<HTMLElement>, 'class' | 'style' | 'children' | 'this'> & {
  /**
   * Element/tag Box renders as.
   *
   * @default 'div'
   */
  as?: BoxAs;
  /**
   * Additional class names, forwarded as-is to the underlying DOM element.
   * Box has no style props of its own — use this to apply utility-class
   * styling (e.g. Tailwind), including responsive variants.
   */
  className?: string;
  /**
   * Test ID for testing
   */
  testID?: string;
  children?: Snippet | string;
  /**
   * Analytics data attributes (`data-analytics-*`).
   */
  [key: `data-analytics-${string}`]: string;
};
```

## Usage Guidelines

**Do**

- Use `Box` for non-visual layout: stacks, rows, and grouping content with a semantic tag.
- Use `as` for landmarks and semantics (`section`, `header`, `nav`, `main`, `aside`, `footer`).
- Lay out with Blade's `theme.css` classes, for example `className="display-flex flex-col gap-spacing-4"` or `className="display-flex items-center justify-between"`.
- Use responsive utility classes (for example Tailwind `md:flex-row`) for breakpoint-specific layouts.
- Pass `aria-*` and `role` attributes directly when the grouping needs them, such as `aria-busy` on a loading region.

**Don't**

- Don't pass React Box style props (`display="flex"`, `gap="spacing.4"`, `padding="spacing.5"`); use classes instead.
- Don't use Box as a visual surface with background, border and elevation; use `Card`.
- Don't hardcode colors or pixel spacing in classes; use tokens such as `var(--spacing-4)` and `var(--surface-background-gray-moderate)` in your own CSS.
- Don't use Box for text; use `Text` or `Heading` so typography tokens apply.

## Examples

### Payment summary layout

A semantic section laid out with Blade's global layout classes, with rows that push amounts to the right.

```svelte
<script lang="ts">
  import { Badge, Box, Divider, Heading, Text } from '@razorpay/blade-svelte/components';

  const rows = [
    { id: 'amount', label: 'Order amount', value: '₹2,499.00' },
    { id: 'fee', label: 'Convenience fee', value: '₹49.00' },
  ];
</script>

<Box as="section" className="display-flex flex-col gap-spacing-3" aria-label="Payment summary" testID="payment-summary">
  <Box as="header" className="display-flex items-center justify-between">
    <Heading as="h2" size="small">Payment summary</Heading>
    <Badge color="positive" size="small">Captured</Badge>
  </Box>
  {#each rows as row (row.id)}
    <Box className="display-flex justify-between">
      <Text size="small">{row.label}</Text>
      <Text size="small">{row.value}</Text>
    </Box>
  {/each}
  <Divider />
  <Box className="display-flex justify-between" data-analytics-section="payment-total">
    <Text weight="semibold">Total paid</Text>
    <Text weight="semibold">₹2,548.00</Text>
  </Box>
</Box>
```

### Responsive settings layout with Tailwind

Box forwards `className` untouched, so utility frameworks such as Tailwind handle breakpoints.

```svelte
<script lang="ts">
  import { Box, Heading, Text } from '@razorpay/blade-svelte/components';
</script>

<Box as="main" className="flex flex-col gap-4 md:flex-row md:gap-8">
  <Box as="nav" className="md:w-1/4" aria-label="Settings sections">
    <Text weight="semibold">Account &amp; settings</Text>
  </Box>
  <Box as="section" className="flex-1">
    <Heading size="medium">Webhooks</Heading>
    <Text size="small" color="surface.text.gray.muted">
      Receive payment.captured and settlement.processed events on your server.
    </Text>
  </Box>
</Box>
```
