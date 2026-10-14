<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import {
    createDialog,
    type DialogDismissEvent,
  } from '../../runes/modal/dialog.svelte';
  import { createTrigger } from '../../runes/dom/trigger.svelte';
  import { provideOverlay } from '../../runes/layer/overlay';
  import type { Placement } from '../../runes/layer/placement';
  import { useComponentDefaults } from '../defaults';
  import FloatingPanel from '../layer/FloatingPanel.svelte';
  import Surface from '../layer/Surface.svelte';
  import Icon from '../icon/Icon.svelte';
  import type { IconSource } from '../../runes/icon/source';
  import { ChevronLeftIcon } from '../../icons';
  import ModalCloseIcon from './ModalCloseIcon.svelte';
  import { resolveModal, type ModalStyleProps } from './styles';

  interface BehaviourProps {
    isOpen?: boolean;
    /**
     * The trigger: a Button or an IconButton. The wrapper around it opens
     * the modal on a click (and, for a menu, on ArrowDown or ArrowUp), so
     * it wires nothing; `isOpen` is there to read (a chevron that flips).
     * Click only: hover has no touch counterpart, so nothing opens on it.
     * The `popover` and `menu` variants need it: the panel hangs from it.
     */
    trigger?: Snippet<[{ isOpen: boolean }]>;
    /**
     * Where a `popover` or `menu` panel sits against its trigger; the
     * variant's default otherwise (`top` for a popover, `bottom-start` for
     * a menu). Ignored as a surface.
     */
    placement?: Placement;
    /** The trigger does not open it. @default false */
    isDisabled?: boolean;
    /**
     * The user asked it to go — the close button, the backdrop, Escape, back
     * or a drag (`source`) — whether or not it is dismissible. A dismissible
     * modal closes once this returns, and nothing prevents it; otherwise it
     * stays open until `close` is called.
     */
    onDismiss?: (event: DialogDismissEvent) => void;
    /** The exit finished and the modal left the DOM, whoever closed it. */
    onClosed?: () => void;
    /**
     * Whether a dismissal closes it by itself, and whether the close
     * button shows.
     * @default true
     */
    isDismissible?: boolean;
    role?: 'dialog' | 'alertdialog';
    /** The modal's name, first in the header: a string or a snippet. */
    title?: string | Snippet;
    /** One muted line under the title; it describes the modal. */
    subtitle?: string;
    /**
     * Before the title, 8px from it. An icon (`IconSource`) is drawn as a
     * 20px glyph on the title's first line; a snippet goes in a 32px slot
     * centred on the title block: an asset or an avatar.
     */
    leading?: IconSource | Snippet;
    /** Beside the title, 8px from it: a Counter or a Badge. */
    titleSuffix?: Snippet;
    /**
     * After the title block, 16px clear of it and of the close button: a
     * Badge, text, a Link or an action.
     */
    trailing?: Snippet<[{ close: () => void }]>;
    /**
     * The header's content, around the drawn title and subtitle: it receives
     * them as snippets (`title`, `subtitle`; each renders nothing when its
     * prop is unset) and places them with anything else — a badge beside the
     * title, a back button, a line under them. Render `title`: it names the
     * modal. Without `header` the two render on their own.
     */
    header?: Snippet<[{ title: Snippet; subtitle: Snippet; close: () => void }]>;
    /**
     * Content in the preset's padded, scrolling body. `close` is for the
     * content's own actions (a Cancel button). Ignored when `children` is
     * given.
     */
    body?: Snippet<[{ close: () => void }]>;
    /** `close` is for the footer's own actions (Cancel, Done). */
    footer?: Snippet<[{ close: () => void }]>;
    /** Raw content: no container, no padding — the content owns its box. */
    children?: Snippet<[{ close: () => void }]>;
    /**
     * Things that hang off the panel: a full-width, zero-height box on its
     * top edge that the panel does not clip, and that moves with it. What
     * goes in positions itself — above the panel (`absolute bottom-full`,
     * an illustration) or over it (`absolute top-*`). It sits beside the
     * close button and a sheet's handle, which live there too.
     */
    chrome?: Snippet<[{ close: () => void }]>;
    /**
     * A back button first in the header, before the leading item and the
     * title: a step back inside the modal, not a dismissal (it fires no
     * `onDismiss`).
     * @default false
     */
    showBackButton?: boolean;
    /** The back button was pressed; `close` closes the modal without a dismissal. */
    onBackButtonClick?: (event: { close: () => void }) => void;
    /**
     * The back button's accessible name.
     * @default 'Back'
     */
    backLabel?: string;
    /**
     * The close button's accessible name; the button shows while the modal
     * is dismissible.
     * @default 'Close'
     */
    closeLabel?: string;
    /** Names the modal when there is no `title`. */
    accessibilityLabel?: string;
    /** Lands on the panel, the element that carries the modal role. */
    testID?: string;
    class?: string;
  }

  // Behaviour props declared here, style props by `./styles`; the typed
  // rest goes to the resolver.
  // The providers' defaults fill the style props not given.
  type Props = BehaviourProps & ModalStyleProps;

  let {
    isOpen = $bindable(false),
    trigger,
    placement,
    isDisabled = false,
    onDismiss,
    onClosed,
    isDismissible = true,
    role = 'dialog',
    title,
    subtitle,
    leading,
    titleSuffix,
    trailing,
    header: headerContent,
    body,
    footer,
    children,
    chrome: chromeContent,
    showBackButton = false,
    onBackButtonClick,
    backLabel = 'Back',
    closeLabel = 'Close',
    accessibilityLabel,
    testID,
    class: className = '',
    ...styleProps
  }: Props = $props();

  const uid = $props.id();
  const titleId = `${uid}-title`;
  const subtitleId = `${uid}-subtitle`;
  const panelId = `${uid}-panel`;

  const style = useComponentDefaults('Modal', () => styleProps);
  const classes = $derived(resolveModal(style.current));
  // A floating panel by the trigger (popover, menu), or a surface on the
  // layer stack (modal, sheet, drawers — and a popover or menu presented
  // as a sheet).
  const isFloating = $derived(classes.kind === 'floating');

  const dialog = createDialog({
    isOpen: () => isOpen,
    onValue: (next) => {
      isOpen = next;
    },
    onDismiss: (event) => onDismiss?.(event),
    isDismissible: () => isDismissible,
    isModal: () => !isFloating,
  });

  // The trigger side: the wrapper's ref (what a floating panel hangs from)
  // and the aria state stamped on the control inside it.
  const opener = createTrigger({
    controls: panelId,
    popup: panelId,
    isExpanded: () => isOpen,
    haspopup: () => classes.popup,
  });

  const close = () => dialog.close();
  const hasHeader = $derived(
    Boolean(title || subtitle || headerContent || leading || trailing || showBackButton)
  );
  // A menu has no close button: its rows are the way out (a pick, Escape).
  const hasClose = $derived(isDismissible && !(isFloating && classes.popup === 'menu'));

  provideOverlay({
    get variant() {
      return style.current.variant ?? 'modal';
    },
    get isAnchored() {
      return isFloating;
    },
    panelId,
    close,
  });

  function handleTriggerClick(event: MouseEvent): void {
    // Native renders the panel in the wrapper: a press inside it is not the trigger's.
    if (isDisabled || opener.isInside(event)) {
      return;
    }
    if (isOpen) {
      close();
    } else {
      isOpen = true;
    }
  }

  function handleTriggerKeyDown(event: KeyboardEvent): void {
    // Closed: the arrows open a menu from its trigger, as Blade.
    if (
      !isOpen &&
      !isDisabled &&
      classes.popup === 'menu' &&
      event.target === opener.control() &&
      (event.key === 'ArrowDown' || event.key === 'ArrowUp')
    ) {
      event.preventDefault();
      isOpen = true;
    }
  }
</script>

<!--
  No DOM access here: everything platform-bound lives in Surface.svelte and
  its native twin, so this component is shared by web and native as is.
-->
{#snippet text(slot: string | Snippet, className: string, id?: string)}
  {#if typeof slot === 'string'}
    <p {id} class={className}>{slot}</p>
  {:else}
    <div {id}>{@render slot()}</div>
  {/if}
{/snippet}

{#snippet closeButton(className: string)}
  <button
    type="button"
    class={className}
    aria-label={closeLabel}
    onclick={() => dialog.dismiss('cross')}
  >
    <ModalCloseIcon {...style.current} />
  </button>
{/snippet}

<!-- The drawn title and subtitle: on their own, or handed to `header`. -->
{#snippet titleSlot()}
  {#if title && titleSuffix}
    <div class={classes.titleRow}>
      {@render text(title, classes.title, titleId)}
      <span class={classes.titleSuffix}>{@render titleSuffix()}</span>
    </div>
  {:else if title}
    {@render text(title, classes.title, titleId)}
  {/if}
{/snippet}

{#snippet subtitleSlot()}
  {#if subtitle}
    <p id={subtitleId} class={classes.subtitle}>{subtitle}</p>
  {/if}
{/snippet}

{#snippet header()}
  {#if hasHeader}
    <div class={classes.header}>
      <div class={cx(classes.headerRow, isDismissible && classes.closeClearance)}>
        {#if showBackButton}
          <button
            type="button"
            class={classes.back}
            aria-label={backLabel}
            onclick={() => onBackButtonClick?.({ close })}
          >
            <Icon source={ChevronLeftIcon} size="large" />
          </button>
        {/if}
        {#if typeof leading === 'function'}
          <span class={classes.leading}>{@render leading()}</span>
        {:else if leading}
          <span class={classes.leadingIcon}>
            <Icon source={leading} size="large" />
          </span>
        {/if}
        <div class={classes.titleBlock}>
          {#if headerContent}
            {@render headerContent({ title: titleSlot, subtitle: subtitleSlot, close })}
          {:else}
            {@render titleSlot()}
            {@render subtitleSlot()}
          {/if}
        </div>
        {#if trailing}
          <div class={classes.trailing}>{@render trailing({ close })}</div>
        {/if}
      </div>
    </div>
  {:else}
    <!-- Blade's empty header: an 8px strip under the floating close. -->
    <div class={classes.emptyHeader}></div>
  {/if}
{/snippet}

{#snippet chrome()}
  {#if hasClose}
    {@render closeButton(hasHeader ? classes.close : classes.floatingClose)}
  {/if}
  {@render chromeContent?.({ close })}
{/snippet}

{#snippet sections()}
  {#if children}
    {@render children({ close })}
  {:else if body}
    <div class={classes.body}>{@render body({ close })}</div>
  {/if}
  {#if footer}
    <div class={classes.footer}>{@render footer({ close })}</div>
  {/if}
{/snippet}

{#if trigger}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <span
    class="relative inline-flex"
    onclick={handleTriggerClick}
    onkeydown={handleTriggerKeyDown}
    {@attach opener.attach}
  >
    {@render trigger({ isOpen })}
  </span>
{/if}

{#if isFloating}
  {#if isOpen && opener.anchor && classes.floating}
    <FloatingPanel
      id={panelId}
      anchor={opener.anchor}
      placement={placement ?? (classes.popup === 'menu' ? 'bottom-start' : 'top')}
      classes={classes.floating}
      role={classes.popup}
      {accessibilityLabel}
      labelledBy={title ? titleId : undefined}
      describedBy={subtitle ? subtitleId : undefined}
      isFocusMoved
      onOutside={() => dialog.dismiss('blur')}
      {onClosed}
      {testID}
      class={className}
    >
      <!-- First, so what it holds (the close button) is early in tab order. -->
      <div class={classes.chrome}>{@render chrome()}</div>
      <div class={classes.content}>
        {@render header()}
        {@render sections()}
      </div>
    </FloatingPanel>
  {/if}
{:else}
<Surface
  {isOpen}
  isTop={dialog.isTop}
  {role}
  labelledBy={title ? titleId : undefined}
  describedBy={subtitle ? subtitleId : undefined}
  {accessibilityLabel}
  {classes}
  {isDismissible}
  onDismissRequest={dialog.dismiss}
  {onClosed}
  {testID}
  class={className}
  {header}
  {chrome}
>
  {@render sections()}
</Surface>
{/if}
