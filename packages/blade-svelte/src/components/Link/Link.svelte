<script lang="ts">
  import BaseLink from './BaseLink/BaseLink.svelte';
  import type { LinkProps } from './types';

  let {
    children,
    icon,
    iconPosition = 'left',
    isDisabled = false,
    onClick,
    variant = 'anchor',
    color = 'primary',
    href,
    target,
    rel,
    accessibilityLabel,
    size = 'medium',
    testID,
    htmlTitle,
    onBlur,
    onFocus,
    onMouseLeave,
    onMouseMove,
    onPointerDown,
    onPointerEnter,
    onTouchStart,
    onTouchEnd,
    onMouseDown,
    onMouseUp,
    'aria-describedby': ariaDescribedBy,
    ...rest
  }: LinkProps = $props();

  // Map Link props to BaseLink props - use $derived for reactivity
  const baseLinkProps = $derived({
    children,
    icon,
    iconPosition,
    variant,
    color,
    size,
    onClick,
    testID,
    htmlTitle,
    accessibilityProps: {
      label: accessibilityLabel,
      describedBy: ariaDescribedBy,
    },
    onBlur,
    onFocus,
    onMouseLeave,
    onMouseMove,
    onPointerDown,
    onPointerEnter,
    onTouchStart,
    onTouchEnd,
    onMouseDown,
    onMouseUp,
    ...(variant === 'anchor'
      ? { href, target, rel }
      : { isDisabled }),
    ...rest,
  });
</script>

<BaseLink {...baseLinkProps} />

