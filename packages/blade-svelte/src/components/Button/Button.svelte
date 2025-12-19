<script lang="ts">
  import BaseButton from './BaseButton/BaseButton.svelte';
  import type { ButtonProps } from './types';
  import { makeAnalyticsAttribute } from '@razorpay/blade-core/utils';

  let {
    children,
    icon,
    iconPosition = 'left',
    isDisabled = false,
    isFullWidth = false,
    isLoading = false,
    href,
    target,
    rel,
    onClick,
    size = 'medium',
    type = 'button',
    variant = 'primary',
    color = 'primary',
    accessibilityLabel,
    role,
    testID,
    onBlur,
    onFocus,
    onMouseLeave,
    onMouseMove,
    onMouseDown,
    onPointerDown,
    onPointerEnter,
    onTouchStart,
    onTouchEnd,
    ...rest
  }: ButtonProps = $props();

  // Extract analytics attributes
  const analyticsAttrs = makeAnalyticsAttribute(rest);

  // Build accessibility props
  const accessibilityProps = $derived({
    label: accessibilityLabel,
    describedBy: rest['aria-describedby'],
    expanded: rest['aria-expanded'],
    hasPopup: rest['aria-haspopup'],
    role,
  });
</script>

<BaseButton
  {...(icon ? { icon, children } : { children })}
  {...rest}
  {...analyticsAttrs}
  {href}
  {target}
  {rel}
  {accessibilityProps}
  {iconPosition}
  {color}
  {isDisabled}
  {isFullWidth}
  {onClick}
  {size}
  {type}
  {variant}
  {isLoading}
  {testID}
  {onBlur}
  {onFocus}
  {onMouseLeave}
  {onMouseMove}
  {onMouseDown}
  {onPointerDown}
  {onPointerEnter}
  {onTouchStart}
  {onTouchEnd}
/>
