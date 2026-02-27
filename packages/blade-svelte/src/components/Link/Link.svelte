<script lang="ts">
  import type { Snippet, Component } from 'svelte';
  import BaseLink from './BaseLink/BaseLink.svelte';
  import type { IconProps } from '../Icons/types';

  // Icon component type - Svelte component that accepts IconProps
  type IconComponent = Component<IconProps>;

  interface LinkProps {
    variant?: 'anchor' | 'button';
    icon?: IconComponent;
    color?: 'primary' | 'white' | 'neutral' | 'negative' | 'positive';
    iconPosition?: 'left' | 'right';
    isDisabled?: boolean;
    onClick?: (event: MouseEvent) => void;
    href?: string;
    target?: string;
    rel?: string;
    accessibilityLabel?: string;
    'aria-describedby'?: string;
    size?: 'xsmall' | 'small' | 'medium' | 'large';
    testID?: string;
    htmlTitle?: string;
    children?: Snippet | string;
    // Event handlers
    onBlur?: (event: FocusEvent) => void;
    onFocus?: (event: FocusEvent) => void;
    onMouseLeave?: (event: MouseEvent) => void;
    onMouseMove?: (event: MouseEvent) => void;
    onPointerDown?: (event: PointerEvent) => void;
    onPointerEnter?: (event: PointerEvent) => void;
    onTouchStart?: (event: TouchEvent) => void;
    onTouchEnd?: (event: TouchEvent) => void;
    onMouseDown?: (event: MouseEvent) => void;
    onMouseUp?: (event: MouseEvent) => void;
    // Analytics attributes
    [key: `data-analytics-${string}`]: string;
  }

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

