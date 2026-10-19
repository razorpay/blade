<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { Overlay } from '../../runes/modal/overlay.svelte';

  // The wrapper around an overlay's trigger (a Button, an IconButton): it
  // opens the overlay on a click (and a menu on ArrowDown or ArrowUp), and
  // stamps the aria state on the control inside, so the control wires
  // nothing. A floating panel hangs from it.
  interface Props {
    overlay: Overlay;
    isOpen: boolean;
    trigger: Snippet<[{ isOpen: boolean }]>;
  }

  let { overlay, isOpen, trigger }: Props = $props();
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<span
  class="relative inline-flex"
  onclick={overlay.handleTriggerClick}
  onkeydown={overlay.handleTriggerKeyDown}
  {@attach overlay.trigger.attach}
>
  {@render trigger({ isOpen })}
</span>
