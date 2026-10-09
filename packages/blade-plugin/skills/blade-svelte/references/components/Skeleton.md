## Component Name

Skeleton

## Description

Skeleton is a pulsing placeholder block shown while content loads. Compose several Skeletons sized with `width`, `height` and `borderRadius` to mimic the final layout (text lines, avatars, cards), then swap them for the real content once data arrives. It supports margin and flex item props so it can be positioned inside layouts.

## Important Constraints

- Skeleton takes no children; it renders an empty `<div aria-hidden="true">`.
- Skeleton has no default height; without `height` (or `minHeight`) it collapses and nothing shows. Width defaults to the full width of the parent.
- Only the documented props, styled props and `data-analytics-*` attributes reach the DOM; other HTML attributes (`aria-*`, `id`, `class`) are dropped, so put them on the container.

## TypeScript Types

These are the props the Skeleton component accepts.

```typescript
type SkeletonBorderRadius =
  | 'none'
  | '2xsmall'
  | 'xsmall'
  | 'small'
  | 'medium'
  | 'large'
  | 'xlarge'
  | '2xlarge'
  | 'max'
  | 'round';

interface SkeletonProps extends StyledPropsBlade {
  /**
   * Sets the width of the skeleton. Accepts a spacing token (e.g. `'spacing.4'`),
   * a CSS length (`'50px'`, `'100%'`, `'auto'`), or any other valid CSS width value.
   */
  width?: string;
  /**
   * Sets the maximum width of the skeleton.
   */
  maxWidth?: string;
  /**
   * Sets the minimum width of the skeleton.
   */
  minWidth?: string;
  /**
   * Sets the height of the skeleton. Accepts a spacing token (e.g. `'spacing.4'`),
   * a CSS length (`'50px'`, `'100%'`, `'auto'`), or any other valid CSS height value.
   */
  height?: string;
  /**
   * Sets the maximum height of the skeleton.
   */
  maxHeight?: string;
  /**
   * Sets the minimum height of the skeleton.
   */
  minHeight?: string;
  /**
   * Sets the border-radius of the skeleton using a design-system token.
   */
  borderRadius?: SkeletonBorderRadius;
  /**
   * Controls the direction of the flex children when the skeleton acts as a flex item's parent.
   */
  flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  /**
   * Controls flex line wrapping.
   */
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  /**
   * Controls the flex grow factor.
   */
  flexGrow?: number;
  /**
   * Controls the flex shrink factor.
   */
  flexShrink?: number;
  /**
   * Controls the initial size of the flex item.
   */
  flexBasis?: string;
  /**
   * Controls how flex/grid items are aligned along the cross axis.
   */
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  /**
   * Controls how multiple flex lines are aligned within the container.
   */
  alignContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'stretch';
  /**
   * Controls the alignment of an individual flex/grid item along the cross axis.
   */
  alignSelf?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  /**
   * Controls how grid items are aligned along the inline (row) axis.
   */
  justifyItems?: 'start' | 'end' | 'center' | 'stretch';
  /**
   * Controls how flex/grid items are aligned along the main axis.
   */
  justifyContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
    | 'stretch';
  /**
   * Controls the alignment of an individual grid item along the inline (row) axis.
   */
  justifySelf?: 'auto' | 'start' | 'end' | 'center' | 'stretch';
  /**
   * Sets both align-self and justify-self.
   */
  placeSelf?: 'auto' | 'start' | 'end' | 'center' | 'stretch';
  /**
   * Sets both align-items and justify-items.
   */
  placeItems?: 'start' | 'end' | 'center' | 'stretch';
  /**
   * Controls the order of the flex/grid item.
   */
  order?: number;
  /**
   * Test ID for the skeleton element.
   */
  testID?: string;
  /**
   * Analytics data attributes (e.g. `data-analytics-section="hero"`).
   */
  [key: `data-analytics-${string}`]: string;
}
```

## Usage Guidelines

**Do**

- Use `Skeleton` when the layout of the loading content is known, and match the final content's dimensions.
- Set `height` and `borderRadius` on every Skeleton, plus `width` when it should not fill the row: `borderRadius="max"` for avatars, `borderRadius="medium"` for text lines and blocks.
- Vary the widths of stacked text-line Skeletons (for example 100%, 90%, 60%) so the placeholder reads as a paragraph.
- Set `aria-busy={isLoading}` on the container that holds the Skeletons so screen readers know the region is loading.
- Render Skeletons and the real content in `{#if isLoading}...{:else}...{/if}` branches.

**Don't**

- Don't use `Skeleton` when the shape of the content is unknown; use `Spinner`.
- Don't wrap real components inside a Skeleton; Skeleton has no children, so compose placeholders next to the content instead.
- Don't show a `Skeleton` and a `Spinner` for the same loading state; pick one.
- Don't use `Skeleton` when there is no data to load; show an empty-state message with `Text` instead.

## Examples

### Payment details placeholder

A card-shaped placeholder that mirrors a payment summary and switches to the real content once loaded.

```svelte
<script lang="ts">
  import { Box, Button, Divider, Heading, Skeleton, Text } from '@razorpay/blade-svelte/components';

  let isLoading = $state(true);
</script>

<Button variant="tertiary" size="small" onClick={() => (isLoading = !isLoading)}>
  Toggle loading
</Button>

<Box as="section" className="display-flex flex-col margin-top-spacing-4" aria-busy={isLoading}>
  {#if isLoading}
    <Skeleton width="60%" height="24px" borderRadius="medium" marginBottom="spacing.3" />
    <Skeleton width="30%" height="40px" borderRadius="medium" marginBottom="spacing.3" />
    <Skeleton width="45%" height="16px" borderRadius="medium" />
    <Divider marginY="spacing.4" />
    <Skeleton width="100%" height="16px" borderRadius="medium" marginBottom="spacing.2" />
    <Skeleton width="80%" height="16px" borderRadius="medium" testID="payment-skeleton" />
  {:else}
    <Heading size="medium">Total repayable amount</Heading>
    <Text size="large" weight="semibold">₹16,450.00</Text>
    <Text size="small" color="surface.text.gray.muted">Principal ₹16,000 · Interest ₹450</Text>
    <Divider marginY="spacing.4" />
    <Text size="small">
      The amount will be deducted in 3 instalments from your settlement balance between Feb 18-20.
    </Text>
  {/if}
</Box>
```

### Merchant list rows

Avatar and text-line placeholders laid out in flex rows, using `flexShrink` so the circle keeps its size.

```svelte
<script lang="ts">
  import { Box, Skeleton } from '@razorpay/blade-svelte/components';

  const rows = ['row-1', 'row-2', 'row-3'];
</script>

<Box className="display-flex flex-col gap-spacing-5" aria-busy="true">
  {#each rows as row (row)}
    <Box className="display-flex items-center">
      <Skeleton width="40px" height="40px" borderRadius="max" flexShrink={0} marginRight="spacing.3" />
      <Box className="display-flex flex-col gap-spacing-2">
        <Skeleton width="180px" height="16px" borderRadius="medium" />
        <Skeleton width="120px" height="12px" borderRadius="medium" data-analytics-section="merchant-list" />
      </Box>
    </Box>
  {/each}
</Box>
```
