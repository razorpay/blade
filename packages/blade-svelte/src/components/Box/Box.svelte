<script lang="ts">
  import { metaAttribute, MetaConstants } from '@razorpay/blade-core/utils';
  import type { BoxProps } from './types';

  // style and this are intentionally omitted — Box does not support inline styles; use className instead
  let { as = 'div', className, testID, children, style: _style, this: _this, ...rest }: BoxProps & { style?: unknown; this?: unknown } = $props();

  const metaAttrs = $derived(metaAttribute({ name: MetaConstants.Box, testID }));
</script>

<svelte:element this={as} class={className} {...metaAttrs} {...rest}>
  {#if typeof children === 'string'}
    {children}
  {:else}
    {@render children?.()}
  {/if}
</svelte:element>
