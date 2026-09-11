<script lang="ts">
  import { metaAttribute, MetaConstants } from '@razorpay/blade-core/utils';
  import type { BoxProps } from './types';

  // this is omitted — Box does not bind to a DOM node reference
  let { as = 'div', className, style, testID, children, this: _this, ...rest }: BoxProps & { this?: unknown } = $props();

  const metaAttrs = $derived(metaAttribute({ name: MetaConstants.Box, testID }));
</script>

<svelte:element this={as} class={className} style={style} {...metaAttrs} {...rest}>
  {#if typeof children === 'string'}
    {children}
  {:else}
    {@render children?.()}
  {/if}
</svelte:element>
