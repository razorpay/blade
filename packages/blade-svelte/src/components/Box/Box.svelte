<script lang="ts">
  import { makeAnalyticsAttribute, metaAttribute, MetaConstants } from '@razorpay/blade-core/utils';
  import type { BoxProps } from './types';

  // this is omitted — Box does not bind to a DOM node reference
  let { as = 'div', className, testID, children, this: _this, ...rest }: BoxProps & { this?: unknown } = $props();

  const metaAttrs = $derived(metaAttribute({ name: MetaConstants.Box, testID }));
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
</script>

<svelte:element this={as} class={className} {...metaAttrs} {...analyticsAttrs} {...rest}>
  {#if typeof children === 'string'}
    {children}
  {:else}
    {@render children?.()}
  {/if}
</svelte:element>
