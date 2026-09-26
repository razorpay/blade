<script lang="ts">
  import type { ToastsModel } from '../../runes/toast/toasts.svelte';
  import { resolveToast } from './styles';
  import ToastCloseIcon from './ToastCloseIcon.svelte';
  import Icon from '../icon/Icon.svelte';
  import type { ShowToastOptions } from './toasts';

  // Native has no computed styles to time an exit with: the toast mounts
  // and unmounts.
  interface Props {
    id: number;
    content: ShowToastOptions;
    model: ToastsModel<ShowToastOptions>;
    /** Web only; native mounts and unmounts. */
    slide?: string;
  }

  let { id, content, model }: Props = $props();

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
</script>

<div class={classes.root} role={classes.role} data-testid={testID}>
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
