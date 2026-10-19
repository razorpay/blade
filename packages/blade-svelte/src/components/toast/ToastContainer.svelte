<script lang="ts">
  import { cx } from '../../cx';
  import { useComponentDefaults } from '../defaults';
  import { createToastStack } from '../../runes/toast/stack.svelte';
  import { queueOf, type ToastQueue } from '../../runes/toast/toasts.svelte';
  import {
    resolveToastContainer,
    type ToastContainerStyleProps,
    type ToastStyleProps,
  } from './styles';
  import { getToasts } from './toasts';
  import Toast from './Toast.svelte';

  // Blade's ToastContainer: the app renders it once, inside BladeProvider,
  // and it shows what `showToast` asks for — the nearest provider's
  // `adapters.toasts`, else the page's queue. An app's own `Toasts` shows
  // its toasts its own way: nothing renders. Its toasts move into the
  // overlay host: they sit over open modals, but push no layer — nothing
  // goes inert, no focus moves, Escape is not theirs.
  // Blade's stack: the newest toast in front at the edge, the rest peeking
  // behind it until a hover (desktop) or a tap (phone) expands the column;
  // either also holds the timers.
  type Props = ToastContainerStyleProps & {
    /**
     * Localized; names the region for a screen reader.
     * @default 'Notifications'
     */
    accessibilityLabel?: string;
    testID?: string;
    /** Blade's `offsetBottom` is a margin here (`mb-*`). */
    class?: string;
  };

  let {
    accessibilityLabel = 'Notifications',
    testID,
    class: className = '',
    ...styleProps
  }: Props = $props();

  const style = useComponentDefaults('ToastContainer', () => styleProps);
  const classes = $derived(resolveToastContainer(style.current));
  // The queue, read once.
  const queue = queueOf(getToasts()) as ToastQueue<ToastStyleProps> | undefined;
  const stack = queue
    ? createToastStack({
        queue,
        capacity: () => classes.capacity,
        duration: () => classes.duration,
        geometry: () => classes.geometry,
        minShown: () => classes.minShown,
      })
    : undefined;
</script>

{#if stack}
  <!-- svelte-ignore a11y_no_static_element_interactions, a11y_click_events_have_key_events -->
  <div
    class={cx(classes.root, className)}
    role="region"
    aria-label={accessibilityLabel}
    data-testid={testID}
    onpointerenter={stack.handlePointerEnter}
    onpointerleave={stack.handlePointerLeave}
    onclick={stack.handleClick}
    onfocusin={stack.pause}
    onfocusout={stack.resume}
    {@attach stack.root}
  >
    <div
      class={classes.hover}
      style:--hover-height={stack.hoverHeight}
      data-expanded={stack.isExpanded}
    ></div>
    {#each stack.entries as entry (entry.id)}
      {@const vars = stack.varsOf(entry.id)}
      <div
        class={classes.wrapper}
        style:--toast-offset={vars['--toast-offset']}
        style:--toast-scale={vars['--toast-scale']}
        data-shown={stack.isShown(entry.id)}
        style:--toast-height={vars['--toast-height'] === 'auto'
          ? 'auto'
          : `${vars['--toast-height']}px`}
        {@attach stack.measure(entry.id)}
      >
        <Toast
          id={entry.id}
          content={entry.content}
          model={stack.model}
          slide={classes.slide}
        />
      </div>
    {/each}
  </div>
{/if}
