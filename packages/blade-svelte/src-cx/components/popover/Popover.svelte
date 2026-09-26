<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import type { Placement } from '../../runes/layer/placement';
  import { createPopover } from '../../runes/popover/popover.svelte';
  import PopoverPanel from './PopoverPanel.svelte';
  import { resolvePopover, type PopoverStyleProps } from './styles';

  type Props = PopoverStyleProps & {
    /** Bindable, or a value the host keeps driving. */
    isOpen?: boolean;
    onOpenChange?: (isOpen: boolean) => void;
    /** The wanted side; on web the panel flips when that side lacks room. */
    placement?: Placement;
    isDisabled?: boolean;
    /** Names the panel. */
    accessibilityLabel: string;
    /** Lands on the panel. */
    testID?: string;
    class?: string;
    /** The trigger: a Button or an IconButton. A press on it toggles. */
    children: Snippet;
    /** The panel; `close` is for a control inside it. */
    content: Snippet<[{ close: () => void }]>;
  };

  let {
    isOpen = $bindable(false),
    onOpenChange,
    placement = 'bottom-start',
    isDisabled = false,
    accessibilityLabel,
    testID,
    class: className = '',
    children,
    content,
    ...styleProps
  }: Props = $props();

  const uid = $props.id();
  const panelId = `${uid}-popover`;

  const classes = $derived(resolvePopover(styleProps));

  const popover = createPopover({
    id: panelId,
    isOpen: () => isOpen,
    onValue: (next) => {
      isOpen = next;
    },
    onOpenChange: (next) => onOpenChange?.(next),
    isDisabled: () => isDisabled,
  });
</script>

<!-- svelte-ignore a11y_no_static_element_interactions, a11y_click_events_have_key_events -->
<span
  class={cx(classes.root, className)}
  onclick={popover.handleClick}
  {@attach popover.root}
>
  {@render children()}
  {#if isOpen && popover.anchor}
    <PopoverPanel
      id={panelId}
      anchor={popover.anchor}
      {placement}
      {classes}
      role="dialog"
      {accessibilityLabel}
      isFocusMoved
      {testID}
      onDismiss={popover.close}
    >
      {@render content({ close: popover.close })}
    </PopoverPanel>
  {/if}
</span>
