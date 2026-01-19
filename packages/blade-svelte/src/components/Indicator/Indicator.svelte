<script lang="ts">
  import BaseIndicator from './BaseIndicator/BaseIndicator.svelte';
  import type { IndicatorProps } from './types';

  let {
    children,
    color = 'neutral',
    emphasis = 'subtle',
    size = 'medium',
    accessibilityLabel,
    testID,
    ...rest
  }: IndicatorProps = $props();
</script>

<BaseIndicator {color} {emphasis} {size} {accessibilityLabel} {testID} {...rest}>
  {#if children}
    {#if typeof children === 'string'}
      {children}
    {:else}
      {@render children()}
    {/if}
  {/if}
</BaseIndicator>
