<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cardSurfaceStyles } from '@razorpay/blade-core/styles';
  import type { CardSurfaceVariants } from '@razorpay/blade-core/styles';

  type OverflowValue = 'visible' | 'hidden' | 'scroll' | 'auto' | 'clip';

  let {
    children,
    backgroundColor = 'surface.background.gray.intense',
    padding = 'spacing.7',
    borderRadius = 'medium',
    height,
    minHeight,
    overflow,
    overflowX,
    overflowY,
  }: {
    children: Snippet;
    backgroundColor?: CardSurfaceVariants['backgroundColor'];
    padding?: CardSurfaceVariants['padding'];
    borderRadius?: CardSurfaceVariants['borderRadius'];
    height?: string;
    minHeight?: string;
    overflow?: OverflowValue;
    overflowX?: OverflowValue;
    overflowY?: OverflowValue;
  } = $props();

  const surfaceClasses = $derived(
    cardSurfaceStyles({
      backgroundColor,
      padding,
      borderRadius,
    })
  );
</script>

<div
  class={surfaceClasses}
  style:height={height}
  style:min-height={minHeight}
  style:overflow={overflow}
  style:overflow-x={overflowX}
  style:overflow-y={overflowY}
>
  {@render children()}
</div>
