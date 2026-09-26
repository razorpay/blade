<script lang="ts">
  import { cx } from '../../cx';
  import { createToastStack } from '../../runes/toast/stack.svelte';
  import { getToasts } from './toasts';
  import { resolveToastStack, type ToastStackStyleProps } from './styles';
  import Toast from './Toast.svelte';

  // Renders what `showToast` asked for. Mount it once, beside the LayerHost:
  // toasts render into the host so they sit over open modals, but they push
  // no layer — nothing goes inert, no focus moves, Escape is not theirs.
  // Blade's stack: the newest toast in front at the edge, the rest peeking
  // behind it until a hover (desktop) or a tap (phone) expands the column;
  // either also holds the timers. The native twin is a flow column.
  type Props = ToastStackStyleProps & {
    /** Localized; names the region for a screen reader. */
    accessibilityLabel?: string;
    testID?: string;
    class?: string;
  };

  let {
    accessibilityLabel,
    testID,
    class: className = '',
    ...styleProps
  }: Props = $props();

  const classes = $derived(resolveToastStack(styleProps));
  const stack = createToastStack({
    toasts: getToasts(),
    capacity: () => classes.capacity,
    duration: () => classes.duration,
    geometry: () => classes.geometry,
    minShown: () => classes.minShown,
    phoneMedia: () => classes.phoneMedia,
  });
</script>

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
    style:--hover-bottom={stack.hoverVars['--hover-bottom']}
    style:--hover-height={stack.hoverVars['--hover-height']}
    data-expanded={stack.isExpanded}
  ></div>
  {#each stack.entries as entry (entry.id)}
    {@const vars = stack.varsOf(entry.id)}
    <div
      class={classes.wrapper}
      style:--toast-offset={vars['--toast-offset']}
      style:--toast-scale={vars['--toast-scale']}
      style:--toast-opacity={vars['--toast-opacity']}
      style:--toast-z={vars['--toast-z']}
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
