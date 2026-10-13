<script lang="ts">
  import { useComponentDefaults } from '../defaults';
  import type { Snippet } from 'svelte';
  import { slide } from 'svelte/transition';
  import { prefersReducedMotion } from '../../runes/dom/motion';
  import { cx } from '../../cx';
  import type { IconSource } from '../../runes/icon/source';
  import Icon from '../icon/Icon.svelte';
  import { resolveAlert, type AlertStyleProps } from './styles';

  type Props = AlertStyleProps & {
    /** The message: text, or a snippet (a Link at most). */
    description: string | Snippet;
    /** Above the description: text, or a snippet in the title's box. */
    title?: string | Snippet;
    /**
     * Before the text.
     * @default the colour's icon (info, check, triangle, octagon)
     */
    icon?: IconSource;
    /**
     * Shows the dismiss button; pressing it closes the alert.
     * @default true
     */
    isDismissible?: boolean;
    /** The dismiss button was pressed, before the alert closes. */
    onDismiss?: () => void;
    /**
     * Whether the alert shows. Dismissing sets it to `false`; bind it to
     * bring the alert back.
     * @default true
     */
    isOpen?: boolean;
    /**
     * The dismiss button's accessible name.
     * @default 'Dismiss alert'
     */
    closeLabel?: string;
    testID?: string;
    class?: string;
  };

  let {
    description,
    title,
    icon,
    isDismissible = true,
    onDismiss,
    isOpen = $bindable(true),
    closeLabel = 'Dismiss alert',
    testID,
    class: className = '',
    ...styleProps
  }: Props = $props();

  const style = useComponentDefaults('Alert', () => styleProps);

  const classes = $derived(
    resolveAlert(style.current, Boolean(title))
  );

  // Svelte slides through the Web Animations API: without it, or with
  // reduced motion, the alert just goes.
  const isStill =
    typeof document === 'undefined' ||
    typeof document.body.animate !== 'function' ||
    prefersReducedMotion();

  function dismiss() {
    onDismiss?.();
    isOpen = false;
  }
</script>

{#if isOpen}
  <div
    class={cx(classes.root, className)}
    role={classes.role}
    aria-live={classes.live}
    data-testid={testID}
    out:slide={{ duration: isStill ? 0 : classes.slide }}
  >
    <span class={classes.icon}>
      <Icon source={icon ?? classes.defaultIcon} />
    </span>
    <div class={classes.text}>
      {#if typeof title === 'string' && title}
        <p class={classes.title}>{title}</p>
      {:else if title && typeof title !== 'string'}
        <div class={classes.title}>{@render title()}</div>
      {/if}
      <p class={classes.description}>
        {#if typeof description === 'string'}
          {description}
        {:else}
          {@render description()}
        {/if}
      </p>
    </div>
    {#if isDismissible}
      <button
        type="button"
        class={classes.close}
        aria-label={closeLabel}
        onclick={dismiss}
      >
        <Icon source={classes.closeIcon} />
      </button>
    {/if}
  </div>
{/if}
