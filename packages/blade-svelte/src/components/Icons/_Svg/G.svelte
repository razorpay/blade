<script lang="ts">
  import type { Snippet } from 'svelte';
  import { metaAttribute } from '@razorpay/blade-core/utils';

  type GProps = {
    clipPath?: string;
    fill?: string;
    children: Snippet;
  };

  let { clipPath, fill, children }: GProps = $props();

  const metaAttrs = metaAttribute({ name: 'svg-g' });
</script>

<g clip-path={clipPath} {fill} {...metaAttrs}>
  {@render children()}
</g>
