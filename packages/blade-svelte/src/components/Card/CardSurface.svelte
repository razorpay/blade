<script lang="ts">
  import type { Snippet } from 'svelte';
  import {
    cardSurfaceStyles,
    resolveCardOverrides,
    styleObjectToString,
  } from '@razorpay/blade-core/styles';
  import type { CardSurfaceVariants, CardStyleOverrides } from '@razorpay/blade-core/styles';

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
    styleOverrides,
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
    styleOverrides?: CardStyleOverrides;
  } = $props();

  const surfaceClasses = $derived(
    cardSurfaceStyles({
      backgroundColor,
      padding,
      borderRadius,
    })
  );

  // Option B (composite parts): resolve the `surface` part overrides into the
  // element-scoped CSS vars the .cardSurface seams consume (--card-surface-bg /
  // --card-surface-border-color). Emitted as an inline style on the surface element.
  const overrideStyle = $derived(styleObjectToString(resolveCardOverrides(styleOverrides)));
</script>

<div
  class={surfaceClasses}
  style={overrideStyle}
  style:height={height}
  style:min-height={minHeight}
  style:overflow={overflow}
  style:overflow-x={overflowX}
  style:overflow-y={overflowY}
>
  {@render children()}
</div>
