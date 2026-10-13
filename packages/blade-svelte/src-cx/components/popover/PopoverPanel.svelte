<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { Attachment } from 'svelte/attachments';
  import { cx } from '../../cx';
  import { createFloating } from '../../runes/layer/floating.svelte';
  import type { Placement } from '../../runes/layer/placement';
  import type { PopoverClasses } from './styles';

  interface Props {
    id: string;
    /** The element the panel hangs from. */
    anchor: HTMLElement;
    placement: Placement;
    classes: PopoverClasses;
    /** None for a panel whose list sits inside it (a dropdown's listbox). */
    role?: 'dialog' | 'menu';
    accessibilityLabel?: string;
    /** The id of the element that names the panel (its title). */
    labelledBy?: string;
    /** Whether opening moves focus into the panel (a menu moves its own). */
    isFocusMoved: boolean;
    testID?: string;
    /** Escape, or a press outside the trigger and the panel. */
    onDismiss: (source: 'escape' | 'outside') => void;
    onKeyDown?: (event: KeyboardEvent) => void;
    /** For a hover-opened panel: the pointer over the panel keeps it open. */
    onPointerEnter?: () => void;
    onPointerLeave?: () => void;
    /** At least as wide as the anchor (a select field's list). @default false */
    matchesAnchorWidth?: boolean;
    /** A menu panel is its own list: it holds focus and names the active row. */
    focusOwner?: Attachment<HTMLElement>;
    activeDescendant?: string;
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
    isFocusMoved,
    testID,
    onDismiss,
    onKeyDown,
    onPointerEnter,
    onPointerLeave,
    focusOwner,
    activeDescendant,
    matchesAnchorWidth = false,
    children,
  }: Props = $props();

  // The web half of a popover, with a platform twin in
  // PopoverPanel.native.svelte. It joins the layers as a floating layer:
  // Escape reaches it only while it is the topmost overlay.
  // svelte-ignore state_referenced_locally
  const floating = createFloating({
    anchor: () => anchor,
    placement: () => placement,
    gap: () => classes.gap,
    onEscape: () => onDismiss('escape'),
    onOutside: () => onDismiss('outside'),
    isFocusMoved,
    removesItself: true,
  });
  const placed = $derived(floating.placed);
</script>

<div
  {id}
  {role}
  class={classes.panel}
  tabindex="-1"
  aria-label={labelledBy ? undefined : accessibilityLabel}
  aria-labelledby={labelledBy}
  aria-activedescendant={activeDescendant}
  style:left="{placed?.x ?? 0}px"
  style:top="{placed?.y ?? 0}px"
  style:visibility={placed ? undefined : 'hidden'}
  style:--popover-arrow="{placed?.arrow ?? 0}px"
  style:min-width={matchesAnchorWidth ? `${anchor.offsetWidth}px` : undefined}
  data-state="closed"
  data-side={placed?.side}
  data-testid={testID}
  transition:floating.presence.transition
  {@attach floating.presence.mount}
  {@attach floating.attach}
  {@attach focusOwner}
  onkeydown={onKeyDown}
  onpointerenter={onPointerEnter}
  onpointerleave={onPointerLeave}
>
  {@render children()}
  {#if classes.arrow && placed}
    <span
      class={cx(classes.arrow, classes.arrowSide?.[placed.side])}
      aria-hidden="true"
    ></span>
  {/if}
</div>
