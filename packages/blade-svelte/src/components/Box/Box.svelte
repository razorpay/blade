<script lang="ts">
  import { metaAttribute, MetaConstants } from '@razorpay/blade-core/utils';
  import type { BoxProps } from './types';

  let { as = 'div', className, testID, children, ...rest }: BoxProps = $props();

  const metaAttrs = $derived(metaAttribute({ name: MetaConstants.Box, testID }));
</script>

<svelte:element this={as} class={className} {...metaAttrs} {...rest}>
  {#if typeof children === 'string'}
    {children}
  {:else}
    {@render children?.()}
  {/if}
</svelte:element>
