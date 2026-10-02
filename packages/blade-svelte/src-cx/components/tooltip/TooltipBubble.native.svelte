<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import type { Placement, PlacementSide } from '../../runes/layer/placement';
  import type { TooltipClasses } from './styles';

  // Native cannot measure into a host, hover or press Escape: the bubble
  // renders inside the root at a static placement and a tap toggles it.
  interface Props {
    /** What the trigger's `aria-describedby` names. */
    id: string;
    placement: Placement;
    classes: TooltipClasses;
    content: string | Snippet;
    title?: string | Snippet;
    testID?: string;
  }

  let { id, placement, classes, content, title, testID }: Props = $props();

  const side = $derived(placement.split('-')[0] as PlacementSide);
</script>

<div
  {id}
  role="tooltip"
  class={cx(classes.bubble, classes.nativePlacement[placement])}
  data-testid={testID}
>
  {#if title}
    <span class={classes.title}>
      {#if typeof title === 'string'}{title}{:else}{@render title()}{/if}
    </span>
  {/if}
  <span class={classes.content}>
    {#if typeof content === 'string'}{content}{:else}{@render content()}{/if}
  </span>
  <span class={cx(classes.arrow, classes.arrowSide[side])} aria-hidden="true"></span>
</div>
