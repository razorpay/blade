<script lang="ts">
  import { cx } from '../../cx';
  import type { IconSource } from '../../runes/icon/source';
  import {
    createPress,
    type ButtonType,
  } from '../../runes/button/press.svelte';
  import Icon from '../icon/Icon.svelte';
  import { resolveIconButton, type IconButtonStyleProps } from './styles';

  interface BehaviourProps {
    icon: IconSource;
    /** Required: the glyph is decorative, this is the button's only name. */
    accessibilityLabel: string;
    onClick?: (event: MouseEvent) => void;
    isLoading?: boolean;
    isDisabled?: boolean;
    /** As on Button, but `button` by default: a press leaves the enclosing Form alone. */
    type?: ButtonType;
    validateForm?: boolean;
    /** Localized text announced while a press settles. */
    loadingAnnouncement?: string;
    testID?: string;
    class?: string;
  }

  type Props = BehaviourProps & IconButtonStyleProps;

  let {
    icon,
    accessibilityLabel,
    onClick,
    isLoading = false,
    isDisabled = false,
    type = 'button',
    validateForm = false,
    loadingAnnouncement,
    testID,
    class: className = '',
    ...styleProps
  }: Props = $props();

  const press = createPress({
    type: () => type,
    validateForm: () => validateForm,
    isLoading: () => isLoading,
    isDisabled: () => isDisabled,
    onClick: (event) => onClick?.(event),
  });

  const classes = $derived(resolveIconButton(styleProps));
</script>

<!--
  Replaces the glyph at the glyph's size, in the button's text colour. The
  button keeps its aria-label, so nothing here needs a name.
-->
{#snippet loader()}
  {@const box =
    styleProps.size === 'small'
      ? 'w-3 h-3'
      : styleProps.size === 'large'
        ? 'w-5 h-5'
        : 'w-4 h-4'}
  <span
    class={`animate-spin rounded-max border-thicker border-solid border-current border-t-transparent motion-reduce:animate-none ${box}`}
    aria-hidden="true"
  ></span>
{/snippet}

<button
  type={press.type}
  class={cx(
    classes.root,
    press.shake && classes.shake,
    press.busy && classes.loading,
    className
  )}
  disabled={isDisabled}
  aria-disabled={press.busy ? 'true' : undefined}
  aria-busy={press.busy ? 'true' : undefined}
  aria-label={accessibilityLabel}
  data-testid={testID}
  onclick={press.handleClick}
>
  {#if press.busyCause}
    {@render loader()}
  {:else}
    <Icon source={icon} {...classes.icon} />
  {/if}
  <span role="status" class={classes.status}>
    {press.busy && loadingAnnouncement ? loadingAnnouncement : ''}
  </span>
</button>
