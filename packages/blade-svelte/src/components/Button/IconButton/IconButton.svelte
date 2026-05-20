<script lang="ts">
  import type { IconButtonProps } from './types';
  import { makeAccessible, metaAttribute, MetaConstants } from '@razorpay/blade-core/utils';
  import { getIconButtonClasses } from '@razorpay/blade-core/styles';

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

  // Icon size mapping (intentionally matches button size 1:1)
  const iconSizeMap = {
    small: 'small',
    medium: 'medium',
    large: 'large',
  } as const;

  // CSS classes (color/background/focus ring all live in blade-core)
  const buttonClasses = $derived(
    getIconButtonClasses({ size, emphasis, isDisabled, isHighlighted })
  );

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
    if (isDisabled) return;
    onClick?.(event);
  }

  function handleFocus(event: FocusEvent): void {
    if (isDisabled) return;
    onFocus?.(event);
  }

  function handleBlur(event: FocusEvent): void {
    if (isDisabled) return;
    onBlur?.(event);
  }
</script>

<button
  type="button"
  class={buttonClasses}
  disabled={isDisabled}
  tabindex={tabIndex}
  onclick={handleClick}
  onfocus={handleFocus}
  onblur={handleBlur}
  {...accessibilityProps}
  {...metaAttrs}
>
  <Icon
    size={iconSizeMap[size]}
    color={isDisabled ? 'interactive.icon.gray.disabled' : 'currentColor'}
  />
</button>

