<script lang="ts">
  import { cx } from '../../cx';
  import { useComponentDefaults } from '../defaults';
  import { createToastStack } from '../../runes/toast/stack.svelte';
  import type { ToastQueue } from '../../runes/toast/toasts.svelte';
  import { resolveToastStack, type ToastStackStyleProps, type ToastStyleProps } from './styles';
  import Toast from './Toast.svelte';

  // Renders what `showToast` asked for, inside BladeProvider's overlay host
  // (not exported): toasts sit over open modals, but they push no layer —
  // nothing goes inert, no focus moves, Escape is not theirs.
  // Blade's stack: the newest toast in front at the edge, the rest peeking
  // behind it until a hover (desktop) or a tap (phone) expands the column;
  // either also holds the timers.
  type Props = ToastStackStyleProps & {
    /** The Blade queue it renders: the provider's claim. */
    queue: ToastQueue<ToastStyleProps>;
    /** Localized; names the region for a screen reader. */
    accessibilityLabel?: string;
    testID?: string;
    class?: string;
  };

  let {
    queue,
    accessibilityLabel,
    testID,
    class: className = '',
    ...styleProps
  }: Props = $props();

  const style = useComponentDefaults('ToastStack', () => styleProps);
  const classes = $derived(resolveToastStack(style.current));
  // The provider's queue, read once.
  // svelte-ignore state_referenced_locally
  const stack = createToastStack({
    queue,
    capacity: () => classes.capacity,
    duration: () => classes.duration,
    geometry: () => classes.geometry,
    minShown: () => classes.minShown,
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
