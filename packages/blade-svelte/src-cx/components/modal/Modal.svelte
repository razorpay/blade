<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import type { BackAnswer } from '../../runes/base/back';
  import {
    createDialog,
    type DialogCloseSource,
  } from '../../runes/modal/dialog.svelte';
  import Surface from '../layer/Surface.svelte';
  import ModalCloseIcon from './ModalCloseIcon.svelte';
  import {
    resolveModal,
    type ModalLookProp,
    type ModalStyleProps,
  } from './styles';

  interface BehaviourProps {
    isOpen?: boolean;
    /** Fires once per close the modal decided itself, with what closed it. */
    onDismiss?: (source: DialogCloseSource) => void;
    /** The exit finished and the modal left the DOM, whoever closed it. */
    onClosed?: () => void;
    /** Whether the backdrop, Escape and back may close it. */
    isDismissible?: boolean;
    /**
     * The content may own back: `true` = it handled back, nothing closes;
     * `false` = it cedes, the modal closes even when not dismissible;
     * `undefined` = no opinion, `isDismissible` rules.
     */
    onBack?: () => BackAnswer;
    role?: 'dialog' | 'alertdialog';
    /** The modal's name, first in the header: a string or a snippet. */
    title?: string | Snippet;
    /**
     * The rest of the header, under the title: a subtitle, a back button,
     * a badge — anything Blade's header props did, as content.
     */
    header?: Snippet;
    /**
     * Content in the preset's padded, scrolling body. `close` is for the
     * content's own actions (a Cancel button). Ignored when `children` is
     * given.
     */
    body?: Snippet<[{ close: () => void }]>;
    footer?: Snippet;
    /** Raw content: no container, no padding — the content owns its box. */
    children?: Snippet<[{ close: () => void }]>;
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
  // rest goes to the resolver — the modal's own, or the look a spelling
  // passes in its place.
  type Props = BehaviourProps & ModalLookProp & ModalStyleProps;

  let {
    isOpen = $bindable(false),
    onDismiss,
    onClosed,
    isDismissible = true,
    onBack,
    role = 'dialog',
    title,
    header: headerContent,
    body,
    footer,
    children,
    closeLabel = 'Close',
    accessibilityLabel,
    testID,
    class: className = '',
    look,
    ...styleProps
  }: Props = $props();

  const uid = $props.id();
  const titleId = `${uid}-title`;

  const dialog = createDialog({
    isOpen: () => isOpen,
    onValue: (next) => {
      isOpen = next;
    },
    onDismiss: (source) => onDismiss?.(source),
    isDismissible: () => isDismissible,
    onBack: () => onBack?.(),
  });

  const classes = $derived((look ?? resolveModal)(styleProps));
  const close = () => dialog.close();
  const hasHeader = $derived(Boolean(title || headerContent));
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
    onclick={() => dialog.close('cross')}
  >
    <ModalCloseIcon {...styleProps} />
  </button>
{/snippet}

{#snippet header()}
  {#if hasHeader}
    <div class={classes.header}>
      <div class={classes.headerRow}>
        <div class={classes.titleBlock}>
          {#if title}
            {@render text(title, classes.title, titleId)}
          {/if}
          {@render headerContent?.()}
        </div>
        {#if isDismissible}
          {@render closeButton(classes.close)}
        {/if}
      </div>
    </div>
  {:else}
    <!-- Blade's empty header: an 8px strip holding the floating close. -->
    <div class={classes.emptyHeader}>
      {#if isDismissible}
        {@render closeButton(classes.floatingClose)}
      {/if}
    </div>
  {/if}
{/snippet}

<Surface
  {isOpen}
  isTop={dialog.isTop}
  {role}
  labelledBy={title ? titleId : undefined}
  {accessibilityLabel}
  {classes}
  {isDismissible}
  onDismissRequest={dialog.dismiss}
  {onClosed}
  {testID}
  class={className}
  {header}
>
  {#if children}
    {@render children({ close })}
  {:else if body}
    <div class={classes.body}>{@render body({ close })}</div>
  {/if}
  {#if footer}
    <div class={classes.footer}>{@render footer()}</div>
  {/if}
</Surface>
