<script lang="ts">
  import type { Snippet } from 'svelte';
  import { createFloating } from '../../runes/layer/floating.svelte';
  import type { Placement } from '../../runes/layer/placement';
  import type { PopoverClasses } from './styles';

  interface Props {
    id: string;
    /** The element the panel hangs from. */
    anchor: HTMLElement;
    placement: Placement;
    classes: PopoverClasses;
    role: 'dialog' | 'menu';
    accessibilityLabel?: string;
    /** Whether opening moves focus into the panel (a menu moves its own). */
    isFocusMoved: boolean;
    testID?: string;
    /** Escape, or a press outside the trigger and the panel. */
    onDismiss: (source: 'escape' | 'outside') => void;
    onKeyDown?: (event: KeyboardEvent) => void;
    children: Snippet;
  }

  let {
    id,
    anchor,
    placement,
    classes,
    role,
    accessibilityLabel,
    isFocusMoved,
    testID,
    onDismiss,
    onKeyDown,
    children,
  }: Props = $props();

  // The web half of a popover, with a platform twin in
  // PopoverPanel.native.svelte. It answers Escape itself — in capture, so
  // a modal beneath does not.
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
  aria-label={accessibilityLabel}
  style:left="{placed?.x ?? 0}px"
  style:top="{placed?.y ?? 0}px"
  style:visibility={placed ? undefined : 'hidden'}
  data-state="closed"
  data-side={placed?.side}
  data-testid={testID}
  transition:floating.presence.transition
  {@attach floating.presence.mount}
  {@attach floating.attach}
  onkeydown={onKeyDown}
>
  {@render children()}
</div>
