<script lang="ts">
  import { useComponentDefaults } from '../defaults';
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import type { Placement } from '../../runes/layer/placement';
  import { createPopover } from '../../runes/popover/popover.svelte';
  import Icon from '../icon/Icon.svelte';
  import { CloseIcon } from '../../icons';
  import type { IconSource } from '../../runes/icon/source';
  import PopoverPanel from './PopoverPanel.svelte';
  import { resolvePopover, type PopoverStyleProps } from './styles';

  type Props = PopoverStyleProps & {
    isOpen?: boolean;
    onOpenChange?: (change: { isOpen: boolean }) => void;
    /** @default 'top' */
    placement?: Placement;
    /**
     * `click` toggles it and shows a close button; `hover` opens it while
     * the pointer is over the trigger or the panel.
     * @default 'click'
     */
    openInteraction?: 'click' | 'hover';
    /**
     * The panel's heading, a string or a snippet; it names the dialog. A
     * snippet sits in the title's box and inherits its type.
     */
    title?: string | Snippet;
    /** Before the title: a glyph, drawn at 20px. */
    titleIcon?: IconSource;
    /** Before the title in place of `titleIcon`: an asset (a logo, an avatar). */
    titleLeading?: Snippet<[{ close: () => void }]>;
    /** Under the content: actions. `close` is for them. */
    footer?: Snippet<[{ close: () => void }]>;
    /** The close button's name. @default 'Close' */
    closeLabel?: string;
    isDisabled?: boolean;
    /** Names the dialog when there is no `title`. */
    accessibilityLabel?: string;
    testID?: string;
    class?: string;
    /**
     * The trigger: a Button or an IconButton. The wrapper around it opens
     * the popover, so it wires nothing; `isOpen` is there to read (a
     * chevron that flips).
     */
    trigger: Snippet<[{ isOpen: boolean }]>;
    /** The panel's content. `close` is for its own actions. */
    children: Snippet<[{ close: () => void }]>;
  };

  let {
    isOpen = $bindable(false),
    onOpenChange,
    placement = 'top',
    openInteraction = 'click',
    title,
    titleIcon,
    titleLeading,
    footer,
    closeLabel = 'Close',
    isDisabled = false,
    accessibilityLabel,
    testID,
    class: className = '',
    trigger,
    children,
    ...styleProps
  }: Props = $props();

  const style = useComponentDefaults('Popover', () => styleProps);

  const uid = $props.id();
  const panelId = `${uid}-popover`;
  const titleId = `${uid}-title`;

  const classes = $derived(resolvePopover(style.current));
  const parts = $derived(classes.content);

  const popover = createPopover({
    id: panelId,
    isOpen: () => isOpen,
    onValue: (next) => {
      isOpen = next;
    },
    onOpenChange: (next) => onOpenChange?.({ isOpen: next }),
    isDisabled: () => isDisabled,
    openInteraction: () => openInteraction,
  });

  // Blade shows the close button when a click opened the popover — and so
  // does a hover popover on a device that cannot hover, which a tap opens.
  const hasClose = $derived(!popover.opensOnHover);
  const hasHeader = $derived(Boolean(title || titleIcon || titleLeading));
</script>

{#snippet closeButton(className: string)}
  <button
    type="button"
    class={className}
    aria-label={closeLabel}
    onclick={popover.close}
  >
    <Icon source={CloseIcon} size="medium" />
  </button>
{/snippet}

<!-- svelte-ignore a11y_no_static_element_interactions, a11y_click_events_have_key_events -->
<span
  class={cx(classes.root, className)}
  onclick={popover.handleClick}
  onpointerenter={popover.handlePointerEnter}
  onpointerleave={popover.handlePointerLeave}
  {@attach popover.root}
>
  {@render trigger({ isOpen })}
  {#if isOpen && popover.anchor}
    <PopoverPanel
      id={panelId}
      anchor={popover.anchor}
      {placement}
      {classes}
      role="dialog"
      {accessibilityLabel}
      labelledBy={title ? titleId : undefined}
      isFocusMoved={!popover.opensOnHover}
      {testID}
      onDismiss={popover.close}
      onPointerEnter={popover.handlePointerEnter}
      onPointerLeave={popover.handlePointerLeave}
    >
      {#if !hasHeader && hasClose}
        {@render closeButton(parts.floatingClose)}
      {/if}
      <div class={parts.layout}>
        <div class={parts.main}>
          {#if hasHeader}
            <div class={parts.header}>
              <div class={parts.titleRow}>
                {#if titleIcon}
                  <Icon source={titleIcon} size="large" />
                {:else}
                  {@render titleLeading?.({ close: popover.close })}
                {/if}
                {#if typeof title === 'string' && title}
                  <p id={titleId} class={parts.title}>{title}</p>
                {:else if title && typeof title !== 'string'}
                  <div id={titleId} class={parts.title}>{@render title()}</div>
                {/if}
              </div>
              {#if hasClose}
                {@render closeButton(parts.close)}
              {/if}
            </div>
          {/if}
          <div>{@render children({ close: popover.close })}</div>
        </div>
        {#if footer}
          <div>{@render footer({ close: popover.close })}</div>
        {/if}
      </div>
    </PopoverPanel>
  {/if}
</span>
