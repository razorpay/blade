<script lang="ts">
  import type { ActionListItemAssetProps } from './types';

  let { src, alt }: ActionListItemAssetProps = $props();
</script>

<img {src} {alt} width="16" height="12" />
