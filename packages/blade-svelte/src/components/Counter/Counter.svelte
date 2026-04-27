<script lang="ts">
  import BaseCounter from './BaseCounter/BaseCounter.svelte';
  import type { CounterProps } from './types';

  let {
    value,
    max,
    color = 'neutral',
    emphasis = 'subtle',
    size = 'medium',
    testID,
    ...rest
  }: CounterProps = $props();
</script>

<BaseCounter
  {value}
  {max}
  {color}
  {emphasis}
  {size}
  {testID}
  {...rest}
/>
