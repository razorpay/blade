<script lang="ts">
  import { cx } from '../../cx';
  import type { ToastsModel } from '../../runes/toast/toasts.svelte';
  import { resolveToast } from './styles';
  import ToastCloseIcon from './ToastCloseIcon.svelte';
  import Icon from '../icon/Icon.svelte';
  import { createPresence } from '../../runes/layer/presence';
  import type { ShowToastOptions } from './toasts';

  // One toast. Web only in its presence; native has no computed styles, and
  // its twin simply mounts and unmounts.
  interface Props {
    id: number;
    content: ShowToastOptions;
    model: ToastsModel<ShowToastOptions>;
    /** From the stack: the edge it enters from and leaves to. */
    slide?: string;
  }

  let { id, content, model, slide = '' }: Props = $props();

  const {
    message,
    icon,
    action,
    closeLabel,
    testID,
    duration: _duration,
    onDismiss: _onDismiss,
    ...styleProps
  } = $derived(content);
  const classes = $derived(resolveToast(styleProps));
  // A failure interrupts; anything else waits its turn.
  const isUrgent = $derived(classes.role === 'alert');

  const presence = createPresence((node) => [node]);
</script>

<!--
  `global`: the stack drops a dismissed toast at once, so the exit must play
  while the block around it is being torn down.
-->
<div
  class={cx(classes.root, slide)}
  role={classes.role}
  aria-live={isUrgent ? 'assertive' : 'polite'}
  data-state="closed"
  data-testid={testID}
  transition:presence.transition|global
  {@attach presence.mount}
>
  {#if icon}
    <span class={classes.icon}><Icon source={icon} /></span>
  {/if}
  <span class={classes.message}>{message}</span>
  {#if action}
    <button
      type="button"
      class={classes.action}
      onclick={() => {
        action.onPress();
        model.dismiss(id);
      }}
    >
      {action.label}
    </button>
  {/if}
  {#if closeLabel}
    <span class={classes.divider} aria-hidden="true"></span>
    <button
      type="button"
      class={classes.close}
      aria-label={closeLabel}
      onclick={() => model.dismiss(id)}
    >
      <ToastCloseIcon {...styleProps} />
    </button>
  {/if}
</div>
