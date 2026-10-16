## Component Name

Badge

## Description

Badge is a small, color-coded, non-interactive label for short metadata such as a payment status, a count or a category. Colors carry meaning (positive, negative, notice, information), emphasis controls contrast, and sizes fit dense tables as well as standalone callouts. An optional icon reinforces the label.

## Important Constraints

- `children` is required and must be non-empty text; Badge throws `Text as children is required for Badge.` otherwise
- `icon` only accepts an icon component exported by `@razorpay/blade-svelte/components`

## TypeScript Types

These are the props the Badge component accepts.

```typescript
type BadgeSize = 'xsmall' | 'small' | 'medium' | 'large';
type BadgeColor = 'neutral' | 'positive' | 'negative' | 'notice' | 'information' | 'primary';
type BadgeEmphasis = 'subtle' | 'intense';

/**
 * Children type for Badge - can be a string or a snippet
 */
type BadgeChildren = string | Snippet;

type IconSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge';

/**
 * Any icon exported by @razorpay/blade-svelte/components, e.g. CheckCircleIcon.
 * Color values are the icon color tokens listed in Icons.md.
 */
type IconComponent = Component<{ size?: IconSize; color?: string }>;

interface BadgeProps extends StyledPropsBlade {
  /**
   * Sets the label for the badge.
   * Text content is required. Can be passed as slot content: `<Badge>text</Badge>`
   * or as a prop: `<Badge children="text" />`
   */
  children: BadgeChildren;
  /**
   * Sets the color of the badge.
   * @default 'neutral'
   */
  color?: BadgeColor;
  /**
   * Sets the emphasis (contrast) of the badge.
   * @default 'subtle'
   */
  emphasis?: BadgeEmphasis;
  /**
   * Sets the size of the badge.
   * @default 'medium'
   */
  size?: BadgeSize;
  /**
   * Icon to be displayed in the badge.
   * Accepts an icon component from Blade.
   */
  icon?: IconComponent;
  /**
   * Test ID for the badge element.
   */
  testID?: string;
  // Analytics attributes
  [key: `data-analytics-${string}`]: string;
}
```

## Usage Guidelines

**Do**

- Use `Badge` for read-only status and metadata, such as "Captured", "Refunded" or "Test mode".
- Use semantic colors for meaning: `positive` for success, `negative` for failures, `notice` for pending or at-risk states, `information` for neutral facts.
- Use `emphasis="intense"` for the one status that must stand out; keep supporting badges `subtle`.
- Keep labels to one or two words.
- Use `size="small"` or `size="xsmall"` inside table rows and list items; use `medium` or `large` for standalone callouts.
- Pair an icon with the label when it helps scanning, for example `CheckCircleIcon` on a success badge.

**Don't**

- Don't make a Badge clickable; use `Button`, `Link` or `Chip` for actions and selection.
- Don't use a Badge for counts on another element; use `Counter`.
- Don't rely on color alone; the text must state the status.
- Don't mix `intense` and `subtle` badges for items of equal importance in the same group.

## Examples

### Payment status badges

Status badges in a transaction summary, combining semantic colors, emphasis, sizes, an icon and analytics attributes.

```svelte
<script lang="ts">
  import { Badge, Box, CheckCircleIcon, AlertTriangleIcon } from '@razorpay/blade-svelte/components';

  type PaymentStatus = 'captured' | 'failed' | 'pending';

  let status: PaymentStatus = $state('captured');

  const badgeColor = $derived(
    status === 'captured' ? 'positive' : status === 'failed' ? 'negative' : 'notice',
  );
</script>

<Box className="display-flex items-center gap-spacing-3">
  <Badge
    color={badgeColor}
    emphasis="intense"
    size="medium"
    icon={status === 'captured' ? CheckCircleIcon : AlertTriangleIcon}
    testID="payment-status-badge"
    data-analytics-section="payment-status"
  >
    {status === 'captured' ? 'Captured' : status === 'failed' ? 'Failed' : 'Pending'}
  </Badge>
  <Badge color="information" emphasis="subtle" size="small">UPI</Badge>
  <Badge color="neutral" size="small" marginLeft="spacing.2">Test mode</Badge>
</Box>
```

### Badges in a dense list

Extra-small badges that label settlement rows without competing with the amounts.

```svelte
<script lang="ts">
  import { Badge, Box, Text } from '@razorpay/blade-svelte/components';

  const settlements = [
    { id: 'setl_01', label: 'Settlement to HDFC ••4521', state: 'Processed' },
    { id: 'setl_02', label: 'Settlement to ICICI ••9087', state: 'On hold' },
  ];
</script>

<Box className="display-flex flex-col gap-spacing-3">
  {#each settlements as settlement (settlement.id)}
    <Box className="display-flex justify-between items-center">
      <Text size="small">{settlement.label}</Text>
      <Badge size="xsmall" color={settlement.state === 'Processed' ? 'positive' : 'notice'}>
        {settlement.state}
      </Badge>
    </Box>
  {/each}
</Box>
```
