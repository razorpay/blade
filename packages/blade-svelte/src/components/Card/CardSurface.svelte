<script lang="ts">
  import type { Snippet } from 'svelte';
  import { getCardSurfaceClasses } from '@razorpay/blade-core/styles';

  let {
    children,
    elevation = 'lowRaised',
    backgroundColor = 'surface.background.gray.intense',
    padding = 'spacing.7',
    borderRadius = 'medium',
    height,
    minHeight,
  }: {
    children: Snippet;
    elevation?: 'none' | 'lowRaised' | 'midRaised' | 'highRaised';
    backgroundColor?: string;
    padding?: string;
    borderRadius?: 'medium' | 'large' | 'xlarge';
    height?: string;
    minHeight?: string;
  } = $props();

  const surfaceClasses = $derived(
    getCardSurfaceClasses({
      elevation,
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
>
  {@render children()}
</div>
