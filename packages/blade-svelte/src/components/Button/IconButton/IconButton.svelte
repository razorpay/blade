<script lang="ts">
  import type { IconButtonProps } from './types';
  import { makeAccessible, metaAttribute, MetaConstants } from '@razorpay/blade-core/utils';
  import type { IconColor } from '../../Icons/types';

  let {
    icon: Icon,
    size = 'medium',
    emphasis = 'intense',
    accessibilityLabel,
    isDisabled = false,
    isHighlighted = false,
    tabIndex,
    onClick,
    onFocus,
    onBlur,
  }: IconButtonProps = $props();

  // Interaction state
  let isHovered = $state(false);
  let isFocused = $state(false);

  // Icon size mapping
  const iconSizeMap = {
    small: 'small',
    medium: 'medium',
    large: 'large',
  } as const;

  // Button size mapping (clickable area)
  const buttonSizeMap = {
    small: 24,
    medium: 32,
    large: 40,
  } as const;

  // Get icon color based on state and emphasis
  const iconColor = $derived.by((): IconColor => {
    if (isDisabled) {
      return 'interactive.icon.gray.disabled';
    }

    const isInteracting = isHovered || isFocused || isHighlighted;

    if (emphasis === 'intense') {
      return isInteracting
        ? 'interactive.icon.gray.normal'
        : 'interactive.icon.gray.muted';
    }

    // subtle emphasis
    return isInteracting
      ? 'interactive.icon.gray.muted'
      : 'interactive.icon.gray.subtle';
  });

  // Accessibility props
  const accessibilityProps = $derived(
    makeAccessible({
      label: accessibilityLabel,
      disabled: isDisabled,
    })
  );

  // Meta attributes
  const metaAttrs = metaAttribute({
    name: MetaConstants.IconButton,
  });

  // Event handlers
  function handleClick(event: MouseEvent): void {
    if (!isDisabled) {
      onClick?.(event);
    }
  }

  function handleMouseEnter(): void {
    if (!isDisabled) {
      isHovered = true;
    }
  }

  function handleMouseLeave(): void {
    isHovered = false;
  }

  function handleFocus(event: FocusEvent): void {
    if (!isDisabled) {
      isFocused = true;
      onFocus?.(event);
    }
  }

  function handleBlur(event: FocusEvent): void {
    isFocused = false;
    onBlur?.(event);
  }
</script>

<button
  type="button"
  class="icon-button"
  class:icon-button--disabled={isDisabled}
  style="--button-size: {buttonSizeMap[size]}px"
  disabled={isDisabled}
  tabindex={tabIndex}
  onclick={handleClick}
  onmouseenter={handleMouseEnter}
  onmouseleave={handleMouseLeave}
  onfocus={handleFocus}
  onblur={handleBlur}
  {...accessibilityProps}
  {...metaAttrs}
>
  <Icon size={iconSizeMap[size]} color={iconColor} />
</button>

<style>
  .icon-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--button-size);
    height: var(--button-size);
    padding: 0;
    margin: 0;
    border: none;
    background: transparent;
    border-radius: var(--blade-border-radius-medium, 4px);
    cursor: pointer;
    transition: background-color 150ms ease-in-out;
  }

  .icon-button:hover:not(.icon-button--disabled) {
    background-color: var(--blade-color-interactive-background-gray-default, rgba(0, 0, 0, 0.04));
  }

  .icon-button:focus-visible {
    outline: none;
    box-shadow: 0px 0px 0px 4px var(--blade-color-interactive-background-primary-faded, rgba(0, 102, 255, 0.18));
  }

  .icon-button--disabled {
    cursor: not-allowed;
  }
</style>

