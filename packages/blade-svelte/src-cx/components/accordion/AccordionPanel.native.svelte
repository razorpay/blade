<script lang="ts">
  import type { Snippet } from 'svelte';

  // Native has no computed styles to slide with and scrolls on its own
  // when the layout grows: the panel simply mounts.
  interface Props {
    id: string;
    labelledBy: string;
    class?: string;
    duration: number;
    scrollIntoView: boolean;
    children: Snippet;
  }

  let { class: className = '', children }: Props = $props();
</script>

<div class={className}>
  {@render children()}
</div>
