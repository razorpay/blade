<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import type { Placement } from '../../runes/layer/placement';
  import { createTooltip } from '../../runes/tooltip/tooltip.svelte';
  import { resolveTooltip, type TooltipStyleProps } from './styles';
  import TooltipBubble from './TooltipBubble.svelte';

  interface BehaviourProps {
    content: string | Snippet;
    /**
     * The wanted side, optionally aligned to the trigger's start or end.
     * On web the bubble flips to the opposite side when this one lacks room.
     */
    placement?: Placement;
    isDisabled?: boolean;
    onOpenChange?: (isOpen: boolean) => void;
    /** Lands on the bubble. */
    testID?: string;
    class?: string;
    /**
     * The trigger. Make it focusable (a button, a link): hover and a tap
     * reach anything, the keyboard only reaches what takes focus.
     */
    children: Snippet;
  }

  // Behaviour props declared here, style props by `./styles`; the typed
  // rest goes to the resolver.
  type Props = BehaviourProps & TooltipStyleProps;

  let {
    content,
    placement = 'top',
    isDisabled = false,
    onOpenChange,
    testID,
    class: className = '',
    children,
    ...styleProps
  }: Props = $props();

  const uid = $props.id();
  const bubbleId = `${uid}-tooltip`;

  const tooltip = createTooltip({
    isDisabled: () => isDisabled,
    onOpenChange: (open) => onOpenChange?.(open),
  });

  const classes = $derived(resolveTooltip(styleProps));
</script>

<!-- svelte-ignore a11y_no_static_element_interactions, a11y_click_events_have_key_events -->
<span
  class={cx(classes.root, className)}
  onpointerdown={tooltip.handlePointerDown}
  onpointerenter={tooltip.handlePointerEnter}
  onpointerleave={tooltip.handlePointerLeave}
  onfocusin={tooltip.handleFocusIn}
  onfocusout={tooltip.handleFocusOut}
  onclick={tooltip.handleClick}
  {@attach tooltip.root}
>
  {@render children()}
  {#if tooltip.isOpen && tooltip.anchor}
    <TooltipBubble
      id={bubbleId}
      anchor={tooltip.anchor}
      {placement}
      {classes}
      {content}
      {testID}
      onPointerEnter={tooltip.handleBubbleEnter}
      onPointerLeave={tooltip.handleBubbleLeave}
      onDismiss={tooltip.dismiss}
      onOutside={tooltip.blur}
    />
  {/if}
</span>
