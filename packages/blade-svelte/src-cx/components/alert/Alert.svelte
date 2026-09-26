<script lang="ts">
  import type { Snippet } from 'svelte';
  import { slide } from 'svelte/transition';
  import { prefersReducedMotion } from '../../runes/dom/motion';
  import { cx } from '../../cx';
  import type { IconSource } from '../../runes/icon/source';
  import Icon from '../icon/Icon.svelte';
  import { resolveAlert, type AlertStyleProps } from './styles';

  type Props = AlertStyleProps & {
    /** Slides shut and open; an alert that is always there never animates. */
    isOpen?: boolean;
    title?: string;
    /** Decorative, before the text. */
    icon?: IconSource;
    /** Localized; the dismiss button exists only when it has a name. */
    closeLabel?: string;
    /** The dismiss button was pressed; the owner closes it (`isOpen`). */
    onDismiss?: () => void;
    /** Buttons or links, under the description. */
    actions?: Snippet;
    testID?: string;
    class?: string;
    /** The description. */
    children: Snippet;
  };

  let {
    isOpen = true,
    title,
    icon,
    closeLabel,
    onDismiss,
    actions,
    testID,
    class: className = '',
    children,
    ...styleProps
  }: Props = $props();

  const classes = $derived(resolveAlert(styleProps));

  // Svelte slides through the Web Animations API: without it, or with
  // reduced motion, the alert just mounts.
  const isStill =
    typeof document === 'undefined' ||
    typeof document.body.animate !== 'function' ||
    prefersReducedMotion();
</script>

{#if isOpen}
  <div
    class={cx(classes.root, className)}
    role={classes.role}
    data-testid={testID}
    transition:slide={{ duration: isStill ? 0 : classes.slide }}
  >
    {#if icon}
      <span class={classes.icon}>
        <Icon source={icon} />
      </span>
    {/if}
    <div class={classes.text}>
      {#if title}
        <p class={classes.title}>{title}</p>
      {/if}
      <div class={classes.description}>
        {@render children()}
      </div>
      {#if actions}
        <div class={classes.actions}>
          {@render actions()}
        </div>
      {/if}
    </div>
    {#if closeLabel}
      <button
        type="button"
        class={classes.close}
        aria-label={closeLabel}
        onclick={() => onDismiss?.()}
      >
        <Icon source={classes.closeIcon} />
      </button>
    {/if}
  </div>
{/if}
