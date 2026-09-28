<script lang="ts">
  import type { Snippet } from 'svelte';
  import { metaAttribute } from '@razorpay/blade-core/utils';

  type ClipPathProps = {
    id: string;
    children: Snippet;
  };

  let { id, children }: ClipPathProps = $props();

  const metaAttrs = metaAttribute({ name: 'svg-clippath' });
</script>

<clipPath {id} {...metaAttrs}>
  {@render children()}
</clipPath>
