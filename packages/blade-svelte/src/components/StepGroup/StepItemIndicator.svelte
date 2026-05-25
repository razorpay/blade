<script lang="ts">
  import {
    indicatorBackgroundStyles,
    indicatorDotStyles,
  } from '@razorpay/blade-core/styles';
  import { getStepRootContext } from './context';
  import type { StepItemIndicatorProps } from './types';

  let { color = 'neutral' }: StepItemIndicatorProps = $props();

  const getRootCtx = getStepRootContext();
  const size = $derived(getRootCtx ? getRootCtx().size : 'medium');

  const bgClass = $derived(indicatorBackgroundStyles({ color }));
  const dotClass = $derived(indicatorDotStyles({ size, color }));
</script>

<div class={bgClass}>
  <span class={dotClass}></span>
</div>
