<script lang="ts">
  import { cx } from '../../cx';
  import { createToastStack } from '../../runes/toast/stack.svelte';
  import { getToasts } from './toasts';
  import { resolveToastStack, type ToastStackStyleProps } from './styles';
  import Toast from './Toast.svelte';

  // Native cannot resolve the stack's placement variables: the toasts flow
  // in a column, and a press holds the timers.
  type Props = ToastStackStyleProps & {
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

<div
  class={cx(classes.column, className)}
  role="region"
  aria-label={accessibilityLabel}
  data-testid={testID}
  onfocusin={stack.pause}
  onfocusout={stack.resume}
  {@attach stack.root}
>
  {#each stack.entries as entry (entry.id)}
    <Toast id={entry.id} content={entry.content} model={stack.model} />
  {/each}
</div>
