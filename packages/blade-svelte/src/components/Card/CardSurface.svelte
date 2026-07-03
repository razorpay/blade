<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cardSurfaceStyles, getCardBackgroundColor } from '@razorpay/blade-core/styles';
  import type { CardSurfaceVariants, CardType } from '@razorpay/blade-core/styles';

  type OverflowValue = 'visible' | 'hidden' | 'scroll' | 'auto' | 'clip';

  let {
    children,
    type = 'primary',
    backgroundColor,
    padding = 'spacing.7',
    borderRadius = 'medium',
    height,
    minHeight,
    overflow,
    overflowX,
    overflowY,
  }: {
    children: Snippet;
    type?: CardType;
    backgroundColor?: CardSurfaceVariants['backgroundColor'];
    padding?: CardSurfaceVariants['padding'];
    borderRadius?: CardSurfaceVariants['borderRadius'];
    height?: string;
    minHeight?: string;
    overflow?: OverflowValue;
    overflowX?: OverflowValue;
    overflowY?: OverflowValue;
  } = $props();

  const effectiveBackgroundColor = $derived(getCardBackgroundColor(type, backgroundColor));

  const surfaceClasses = $derived(
    cardSurfaceStyles({
      type,
      backgroundColor: effectiveBackgroundColor,
      padding,
      borderRadius,
    }),
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
