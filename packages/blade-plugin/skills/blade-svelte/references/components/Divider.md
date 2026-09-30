## Component Name

Divider

## Description

Divider is a thin line that separates content sections or groups within a layout. It renders horizontally between stacked content or vertically between items placed side by side. `variant`, `thickness` and `dividerStyle` (solid or dashed) control how prominent the separation is.

## Important Constraints

- Divider renders a `<div role="separator">` with no children; it cannot hold a label.
- A vertical Divider gets its height from `align-self: stretch`, so it only shows inside a flex row (for example a Box with `className="display-flex"`).

## TypeScript Types

These are the props the Divider component accepts.

```typescript
type DividerSlot = 'root';

type DividerProps = {
  /**
   * Sets the orientation of divider
   *
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Sets the style of divider
   *
   * @default 'solid'
   */
  dividerStyle?: 'solid' | 'dashed';
  /**
   * Sets the variant of divider
   *
   * @default 'muted'
   */
  variant?: 'normal' | 'subtle' | 'muted';
  /**
   * Sets the thickness of divider
   *
   * @default 'thin'
   */
  thickness?: 'thinner' | 'thin' | 'thick' | 'thicker';
  /**
   * Test ID for testing
   */
  testID?: string;
  /**
   * Additional class names
   */
  class?: string;
  /**
   * Per-slot classname overrides. Merged under provider `componentConfig.Divider.styleOverride`;
   * instance values win on conflicts.
   */
  styleOverride?: Partial<Record<DividerSlot, string>>;
} & StyledPropsBlade;
```

## Usage Guidelines

**Do**

- Use `Divider` to separate groups of related content, such as a summary from its line items.
- Use `orientation="horizontal"` between stacked content and `orientation="vertical"` between items in a row.
- Keep the default `variant="muted"` for most separations; use `normal` only where the split needs more emphasis.
- Space the Divider from its neighbours with margin props such as `marginY="spacing.4"` or `marginX="spacing.4"`.
- Use `dividerStyle="dashed"` for soft separations, such as between a subtotal and the grand total.

**Don't**

- Don't use Divider as a container border; style the container with Card or token-based CSS (`var(--surface-border-gray-muted)`).
- Don't use Divider to add spacing; use `gap-spacing-*` classes on the parent or margin props.
- Don't put a Divider between every row of a short list; use spacing, and keep Dividers for section breaks.
- Don't pass `className`; Divider takes `class` for extra classes and `styleOverride` for slot overrides.

## Examples

### Settlement summary sections

A horizontal Divider splits a settlement summary from its breakdown, and a dashed Divider marks the final total.

```svelte
<script lang="ts">
  import { Box, Divider, Heading, Text } from '@razorpay/blade-svelte/components';

  const lineItems = [
    { id: 'gross', label: 'Gross amount', value: '₹1,24,500.00' },
    { id: 'fees', label: 'Razorpay fees', value: '- ₹2,490.00' },
    { id: 'gst', label: 'GST on fees', value: '- ₹448.20' },
  ];
</script>

<Box as="section" className="display-flex flex-col">
  <Heading size="medium">Settlement setl_Nf29aK1</Heading>
  <Text size="small" color="surface.text.gray.muted">Credited to HDFC ••4521 on 12 Aug</Text>
  <Divider marginY="spacing.4" testID="settlement-divider" />
  <Box className="display-flex flex-col gap-spacing-3">
    {#each lineItems as item (item.id)}
      <Box className="display-flex justify-between">
        <Text size="small">{item.label}</Text>
        <Text size="small">{item.value}</Text>
      </Box>
    {/each}
  </Box>
  <Divider dividerStyle="dashed" variant="normal" marginY="spacing.4" />
  <Box className="display-flex justify-between">
    <Text weight="semibold">Net settlement</Text>
    <Text weight="semibold">₹1,21,561.80</Text>
  </Box>
</Box>
```

### Vertical divider between actions

A vertical Divider separates two groups of actions in a toolbar row.

```svelte
<script lang="ts">
  import { Box, Button, Divider } from '@razorpay/blade-svelte/components';

  let isExporting = $state(false);

  const exportSettlements = () => {
    isExporting = true;
  };
</script>

<Box className="display-flex items-center">
  <Button variant="secondary" size="small" isLoading={isExporting} onClick={exportSettlements}>
    Export CSV
  </Button>
  <Divider orientation="vertical" thickness="thin" marginX="spacing.4" />
  <Button variant="tertiary" size="small">Filters</Button>
</Box>
```
