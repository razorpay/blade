<script lang="ts">
  import type { Snippet } from 'svelte';

  // Native has no computed styles to slide with and scrolls on its own
  // when the layout grows: the panel simply mounts.
  interface Props {
    id: string;
    labelledBy?: string;
    class?: string;
    duration: number;
    scrollIntoView: boolean;
    children: Snippet;
  }

  let { id, labelledBy, class: className = '', children }: Props = $props();
</script>

<!-- The header's `aria-controls` names this panel, as on web. -->
<div
  {id}
  role={labelledBy ? 'region' : undefined}
  aria-labelledby={labelledBy}
  class={className}
>
  {@render children()}
</div>
