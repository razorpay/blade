<script lang="ts">
  import { useComponentDefaults } from '../defaults';
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
    content: text,
    leading,
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
  // Blade gives every colour a glyph; an icon `leading` replaces it.
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
  <span class={classes.icon}>
    {#if typeof leading === 'function'}
      {@render leading()}
    {:else}
      <Icon source={leading ?? classes.defaultIcon} />
    {/if}
  </span>
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
