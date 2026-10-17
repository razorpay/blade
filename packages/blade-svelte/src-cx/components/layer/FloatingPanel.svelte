<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import { createFloating } from '../../runes/layer/floating.svelte';
  import type { Placement } from '../../runes/layer/placement';
  import type { FloatingClasses } from '../modal/styles';

  interface Props {
    id: string;
    /** The trigger's wrapper: what the panel hangs from. */
    anchor: HTMLElement;
    placement: Placement;
    classes: FloatingClasses;
    role: 'dialog' | 'menu';
    accessibilityLabel?: string;
    /** The id of the element that names the panel (its title). */
    labelledBy?: string;
    /** The id of the element that describes it (its subtitle). */
    describedBy?: string;
    /** Opening moves focus in; closing returns it to the trigger. */
    isFocusMoved: boolean;
    /** A press landed outside the trigger and the panel. Escape reaches the owner's layer. */
    onOutside: () => void;
    /** The exit finished and the panel left the DOM. */
    onClosed?: () => void;
    testID?: string;
    class?: string;
    children: Snippet;
  }

  let {
    id,
    anchor,
    placement,
    classes,
    role,
    accessibilityLabel,
    labelledBy,
    describedBy,
    isFocusMoved,
    onOutside,
    onClosed,
    testID,
    class: className = '',
    children,
  }: Props = $props();

  // The web half of a floating panel (Modal's popover and menu variants),
  // with a platform twin in FloatingPanel.native.svelte. The layer is the
  // Modal's dialog, which answers Escape; this places the panel against
  // its anchor in the OverlayStack and hears presses outside it.
  // svelte-ignore state_referenced_locally
  const floating = createFloating({
    anchor: () => anchor,
    placement: () => placement,
    gap: () => classes.gap,
    onOutside,
    isFocusMoved,
    joinsLayers: false,
    removesItself: true,
  });
  const placed = $derived(floating.placed);
</script>

<div
  {id}
  {role}
  class={cx(classes.panel, className)}
  tabindex="-1"
  aria-label={labelledBy ? undefined : accessibilityLabel}
  aria-labelledby={labelledBy}
  aria-describedby={describedBy}
  style:left="{placed?.x ?? 0}px"
  style:top="{placed?.y ?? 0}px"
  style:visibility={placed ? undefined : 'hidden'}
  style:--popover-arrow="{placed?.arrow ?? 0}px"
  data-state="closed"
  data-side={placed?.side}
  data-testid={testID}
  transition:floating.presence.transition
  onoutroend={() => onClosed?.()}
  {@attach floating.presence.mount}
  {@attach floating.attach}
>
  {@render children()}
  {#if classes.arrow && placed}
    <span
      class={cx(classes.arrow, classes.arrowSide?.[placed.side])}
      aria-hidden="true"
    ></span>
  {/if}
</div>
