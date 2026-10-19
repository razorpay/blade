<script lang="ts">
  import { useComponentDefaults } from '../defaults';
  import { analyticsAttributes } from '../../runes/dom/analytics';
  import { cx } from '../../cx';
  import { isToastImage, type ToastsModel } from '../../runes/toast/toasts.svelte';
  import { createToastAction } from '../../runes/toast/action.svelte';
  import { resolveToast } from './styles';
  import ToastCloseIcon from './ToastCloseIcon.svelte';
  import Icon from '../icon/Icon.svelte';
  import { createPresence } from '../../runes/layer/presence';
  import type { ShowToastOptions } from './toasts';

  // One toast, with its presence (enter and exit transitions).
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
  const analytics = $derived(analyticsAttributes(styleProps));
  const classes = $derived(resolveToast(style.current));
  // Blade gives every colour a glyph; an icon or an image `leading` replaces it.
  const image = $derived(leading && isToastImage(leading) ? leading : undefined);
  const icon = $derived(leading && !isToastImage(leading) ? leading : classes.defaultIcon);
  const actionModel = createToastAction(() => action);
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
  {...analytics}
  transition:presence.transition|global
  {@attach presence.mount}
>
  <span class={classes.icon}>
    {#if image}
      <img class={classes.image} src={image.image} alt={image.alt ?? ''} />
    {:else}
      <Icon source={icon} />
    {/if}
  </span>
  <span class={classes.body}><span class={classes.content}>{text}</span></span>
  <span class={classes.trailing}>
    {#if action}
      <button
        type="button"
        class={classes.action}
        disabled={actionModel.isBusy || undefined}
        aria-busy={actionModel.isBusy || undefined}
        onclick={(event) => {
          event.stopPropagation();
          actionModel.press();
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
