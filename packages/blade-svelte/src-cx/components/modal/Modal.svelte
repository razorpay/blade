<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import {
    createDialog,
    type DialogDismissEvent,
  } from '../../runes/modal/dialog.svelte';
  import { useComponentDefaults } from '../defaults';
  import Surface from '../layer/Surface.svelte';
  import Icon from '../icon/Icon.svelte';
  import type { IconSource } from '../../runes/icon/source';
  import { ChevronLeftIcon } from '../../icons';
  import ModalCloseIcon from './ModalCloseIcon.svelte';
  import { resolveModal, type ModalStyleProps } from './styles';

  interface BehaviourProps {
    isOpen?: boolean;
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

  const dialog = createDialog({
    isOpen: () => isOpen,
    onValue: (next) => {
      isOpen = next;
    },
    onDismiss: (event) => onDismiss?.(event),
    isDismissible: () => isDismissible,
  });

  const style = useComponentDefaults('Modal', () => styleProps);
  const classes = $derived(resolveModal(style.current));
  const close = () => dialog.close();
  const hasHeader = $derived(
    Boolean(title || subtitle || headerContent || leading || trailing || showBackButton)
  );
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
  {#if isDismissible}
    {@render closeButton(hasHeader ? classes.close : classes.floatingClose)}
  {/if}
  {@render chromeContent?.({ close })}
{/snippet}

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
  {#if children}
    {@render children({ close })}
  {:else if body}
    <div class={classes.body}>{@render body({ close })}</div>
  {/if}
  {#if footer}
    <div class={classes.footer}>{@render footer({ close })}</div>
  {/if}
</Surface>
