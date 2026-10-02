<script lang="ts">
  import { useComponentDefaults } from '../defaults';
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
    content: text,
    icon,
    action,
    closeLabel = 'Dismiss toast',
    onDismissButtonClick,
    testID,
    duration: _duration,
    autoDismiss: _autoDismiss,
    onDismiss: _onDismiss,
    ...styleProps
  } = $derived(content);

  const style = useComponentDefaults('Toast', () => styleProps);
  const classes = $derived(resolveToast(style.current));
  // Blade gives every colour a glyph; `icon` replaces it.
  const glyph = $derived(icon ?? classes.defaultIcon);
</script>

<div
  class={classes.root}
  role={classes.role}
  aria-live={classes.role === 'alert' ? 'assertive' : 'polite'}
  data-testid={testID}
>
  <span class={classes.icon}><Icon source={glyph} /></span>
  <span class={classes.body}><span class={classes.content}>{text}</span></span>
  <span class={classes.trailing}>
    {#if action}
      <button
        type="button"
        class={classes.action}
        disabled={action.isLoading || undefined}
        aria-busy={action.isLoading || undefined}
        onclick={(event) => {
          event.stopPropagation();
          action.onClick();
        }}
      >
        {action.text}
      </button>
    {/if}
    <button
      type="button"
      class={classes.close}
      aria-label={closeLabel}
      onclick={(event) => {
        event.stopPropagation();
        onDismissButtonClick?.();
        model.dismiss(id);
      }}
    >
      <ToastCloseIcon {...style.current} />
    </button>
  </span>
</div>
