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
    /** The rest of the header, under the title (a subtitle). */
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
     * Localized name of the close button — the library ships no copy. The
     * button exists only when it has a name.
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
    closeLabel,
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
</script>

<!--
  No DOM access here: everything platform-bound lives in Surface.svelte and
  its native twin, so this component is shared by web and native as is.
-->
{#snippet header()}
  {#if title || headerContent}
    <div class={classes.header}>
      {#if typeof title === 'string'}
        <h2 id={titleId} class={classes.title}>{title}</h2>
      {:else if title}
        <div id={titleId}>{@render title()}</div>
      {/if}
      {@render headerContent?.()}
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
  {#if closeLabel}
    <button
      type="button"
      class={classes.close}
      aria-label={closeLabel}
      onclick={() => dialog.close('cross')}
    >
      <ModalCloseIcon {...styleProps} />
    </button>
  {/if}
  {#if children}
    {@render children({ close })}
  {:else if body}
    <div class={classes.body}>{@render body({ close })}</div>
  {/if}
  {#if footer}
    <div class={classes.footer}>{@render footer()}</div>
  {/if}
</Surface>
