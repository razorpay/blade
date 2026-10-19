## Component Name

Skeleton

## Description

Skeleton is a placeholder that stands in for content while it loads: a line of text, an avatar, a card. It is Blade's gray fill (`interactive.background.gray.default`), fading in and then pulsing to its highlighted step, and it has no box of its own: its size and shape (height, width and corner radius) come from `class`. It is always hidden from assistive tech: the region that is loading announces it, not each bone.

## Important Constraints

- Give every Skeleton a box in `class`: a height and a width (`h-4 w-32`, `w-10 h-10`); without one it draws nothing
- Unlike other Blade components, a Skeleton's `class` also sets its corner radius, to take the shape it stands in for (`rounded-xsmall` for text, `rounded-max` for an avatar, `rounded-medium` for a card); it has no default radius
- Don't set its colour, border or padding in `class`
- It is `aria-hidden`: announce the loading state on the region (`aria-busy="true"`, or a DotLoader with `accessibilityLabel`)
- Under reduced motion it still shows, without the pulse

## Props

```typescript
interface SkeletonProps {
  testID?: string;
  /** The skeleton's box and shape: height, width, corner radius, margin, flex or grid item. */
  class?: string;
}
```

## Guidelines

- Match the layout of the content that will replace it: the same rows, widths and shapes, so the page doesn't jump when it loads.
- Vary the widths of text lines (`w-full`, `w-2/3`) so the block reads as text.
- Use Skeleton when the shape of the content is known; use DotLoader for a short wait with no known shape, and ProgressBar when progress can be measured.
- Swap all the skeletons of a region for its content at once.

## Examples

### A list row

```svelte
<script lang="ts">
  import { Skeleton } from '@razorpay/blade-svelte/components';
</script>

<div class="flex max-w-[24rem] items-center gap-blade-4" aria-busy="true">
  <Skeleton class="h-10 w-10 shrink-0 rounded-max" />
  <div class="flex flex-1 flex-col gap-blade-2">
    <Skeleton class="h-4 w-2/3 rounded-xsmall" />
    <Skeleton class="h-3 w-full rounded-xsmall" />
  </div>
</div>
```

### Loading, then content

```svelte
<script lang="ts">
  import { Card, Skeleton, Text } from '@razorpay/blade-svelte/components';

  const balance = fetch('/api/balance').then((response) => response.json() as Promise<{ amount: string }>);
</script>

<Card class="w-full max-w-[20rem]">
  <Text size="small" color="muted">Available balance</Text>
  {#await balance}
    <Skeleton class="mt-blade-2 h-8 w-40 rounded-small" />
  {:then data}
    <Text size="large" weight="semibold" class="mt-blade-2">{data.amount}</Text>
  {/await}
</Card>
```

### A card placeholder

```svelte
<script lang="ts">
  import { Skeleton } from '@razorpay/blade-svelte/components';
</script>

<div class="grid grid-cols-1 gap-blade-4 d:grid-cols-3" aria-busy="true">
  {#each [1, 2, 3] as n (n)}
    <Skeleton class="h-[120px] w-full rounded-medium" />
  {/each}
</div>
```
