<script lang="ts">
  import type { Snippet } from 'svelte';
  import { setButtonGroupContext } from '../ButtonGroup/buttonGroupContext';

  /**
   * Resets contexts that shouldn't leak into portaled overlay content. Mirrors
   * React's `OverlayContextReset` — buttons inside an overlay triggered from a
   * ButtonGroup must not inherit the group's size/variant. Renders its children
   * with an empty ButtonGroup context.
   */
  let { children }: { children: Snippet } = $props();

  setButtonGroupContext(() => ({}));
</script>

{@render children()}
