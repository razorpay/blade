<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import { resetButtonGroup } from '../../runes/button/group';
  import { createFloating } from '../../runes/layer/floating.svelte';
  import type { Placement } from '../../runes/layer/placement';
  import type { AnalyticsAttributes } from '../../runes/dom/analytics';
  import type { FloatingClasses } from '../modal/styles';

  interface Props {
    id: string;
    /**
     * What the panel hangs from: the trigger's wrapper, or another element
     * (a dropdown hangs from its field's frame while its trigger is a
     * button inside it). A press inside it is not outside.
     */
    anchor: HTMLElement;
    /** The panel is exactly as wide as its anchor. @default false */
    matchesAnchorWidth?: boolean;
    placement: Placement;
    classes: FloatingClasses;
    role: 'dialog' | 'alertdialog' | 'menu';
    accessibilityLabel?: string;
    /** The id of the element that names the panel (its title). */
    labelledBy?: string;
    /** The id of the element that describes it (its subtitle). */
    describedBy?: string;
    /** Opening moves focus in; closing returns it to the trigger. */
    isFocusMoved: boolean;
    /** Where focus moves in, in place of the first focusable. */
    initialFocusRef?: HTMLElement | null;
    /** A press landed outside the trigger and the panel. Escape reaches the owner's layer. */
    onOutside: () => void;
    /** The exit finished and the panel left the DOM. */
    onClosed?: () => void;
    testID?: string;
    /** The `data-analytics-*` attributes, on the panel. */
    analytics?: AnalyticsAttributes;
    class?: string;
    children: Snippet;
  }

  let {
    id,
    anchor,
    matchesAnchorWidth = false,
    placement,
    classes,
    role,
    accessibilityLabel,
    labelledBy,
    describedBy,
    isFocusMoved,
    initialFocusRef,
    onOutside,
    onClosed,
    testID,
    analytics,
    class: className = '',
    children,
  }: Props = $props();

  // A floating panel (Popover's and Menu's). The layer is the overlay's
  // dialog, which answers Escape; this places the panel against its anchor
  // in the overlay host and hears presses outside it.
  // svelte-ignore state_referenced_locally
  const floating = createFloating({
    anchor: () => anchor,
    placement: () => placement,
    gap: () => classes.gap,
    onOutside,
    isFocusMoved,
    initialFocus: () => initialFocusRef,
    joinsLayers: false,
    removesItself: true,
  });
  const placed = $derived(floating.placed);
  // A Button in the panel is its own again, not its trigger's group's, as
  // Blade's OverlayContextReset does.
  resetButtonGroup();
</script>

<div
  {...analytics}
  {id}
  {role}
  class={cx(classes.panel, className)}
  tabindex="-1"
  aria-label={labelledBy ? undefined : accessibilityLabel}
  aria-labelledby={labelledBy}
  aria-describedby={describedBy}
  style:left="{placed?.x ?? 0}px"
  style:top="{placed?.y ?? 0}px"
  style:width={matchesAnchorWidth ? `${placed?.anchorWidth ?? anchor.offsetWidth}px` : undefined}
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
