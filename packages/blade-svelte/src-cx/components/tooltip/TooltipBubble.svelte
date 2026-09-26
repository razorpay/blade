<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import type { Placement } from '../../runes/layer/placement';
  import { createFloating } from '../../runes/layer/floating.svelte';
  import type { TooltipClasses } from './styles';

  interface Props {
    id: string;
    /** The element the bubble points at. */
    anchor: HTMLElement;
    placement: Placement;
    classes: TooltipClasses;
    content: string | Snippet;
    testID?: string;
    onPointerEnter: () => void;
    onPointerLeave: () => void;
    /** Escape. */
    onDismiss: () => void;
    /** A press landed outside the trigger and the bubble. */
    onOutside: () => void;
  }

  let {
    id,
    anchor,
    placement,
    classes,
    content,
    testID,
    onPointerEnter,
    onPointerLeave,
    onDismiss,
    onOutside,
  }: Props = $props();

  // The web half of the tooltip, with a platform twin in
  // TooltipBubble.native.svelte. Only the tooltip answers its Escape, not
  // a modal beneath it.
  const floating = createFloating({
    anchor: () => anchor,
    placement: () => placement,
    gap: () => classes.gap,
    onEscape: () => onDismiss(),
    onOutside: () => onOutside(),
    describes: id,
  });
  const placed = $derived(floating.placed);
</script>

<div
  {id}
  role="tooltip"
  class={classes.bubble}
  style:left="{placed?.x ?? 0}px"
  style:top="{placed?.y ?? 0}px"
  style:visibility={placed ? undefined : 'hidden'}
  style:--tooltip-arrow="{placed?.arrow ?? 0}px"
  data-state="closed"
  data-side={placed?.side}
  data-testid={testID}
  transition:floating.presence.transition
  {@attach floating.presence.mount}
  onpointerenter={onPointerEnter}
  onpointerleave={onPointerLeave}
  {@attach floating.attach}
>
  <span class={classes.content}>
    {#if typeof content === 'string'}{content}{:else}{@render content()}{/if}
  </span>
  <span
    class={cx(classes.arrow, placed && classes.arrowSide[placed.side])}
    aria-hidden="true"
  ></span>
</div>
