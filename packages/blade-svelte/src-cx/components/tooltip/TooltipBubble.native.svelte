<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import type { Placement, PlacementSide } from '../../runes/layer/placement';
  import type { TooltipClasses } from './styles';

  // Native cannot measure into a host, hover or press Escape: the bubble
  // renders inside the root at a static placement and a tap toggles it.
  interface Props {
    placement: Placement;
    classes: TooltipClasses;
    content: string | Snippet;
  }

  let { placement, classes, content }: Props = $props();

  const side = $derived(placement.split('-')[0] as PlacementSide);
</script>

<div class={cx(classes.bubble, classes.nativePlacement[placement])}>
  <span class={classes.content}>
    {#if typeof content === 'string'}{content}{:else}{@render content()}{/if}
  </span>
  <span class={cx(classes.arrow, classes.arrowSide[side])}></span>
</div>
