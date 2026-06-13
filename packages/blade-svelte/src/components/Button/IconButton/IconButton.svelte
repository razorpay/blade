<script lang="ts">
  import { makeAnalyticsAttribute } from '@razorpay/blade-core/utils';
  import BaseIconButton from './BaseIconButton/BaseIconButton.svelte';
  import type { IconButtonProps } from './types';

  let {
    icon,
    size = 'medium',
    emphasis = 'intense',
    accessibilityLabel,
    isDisabled = false,
    isHighlighted = false,
    _tabIndex,
    onClick,
    onBlur,
    onFocus,
    onMouseLeave,
    onMouseMove,
    onMouseDown,
    onMouseUp,
    onPointerDown,
    onPointerEnter,
    onTouchStart,
    onTouchEnd,
    ...rest
  }: IconButtonProps = $props();

  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
</script>

<BaseIconButton
  {...rest}
  {...analyticsAttrs}
  {icon}
  {size}
  {emphasis}
  {accessibilityLabel}
  {isDisabled}
  {isHighlighted}
  tabIndex={_tabIndex}
  {onClick}
  {onBlur}
  {onFocus}
  {onMouseLeave}
  {onMouseMove}
  {onMouseDown}
  {onMouseUp}
  {onPointerDown}
  {onPointerEnter}
  {onTouchStart}
  {onTouchEnd}
/>
