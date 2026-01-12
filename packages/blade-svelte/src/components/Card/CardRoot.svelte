<script lang="ts">
  import type { CardRootProps } from './types';
  import { cardStyles } from '@razorpay/blade-core/styles';
  import { metaAttribute } from '@razorpay/blade-core/utils';
  import { makeAccessible } from '@razorpay/blade-core/utils';

  let {
    isSelected = false,
    isFocused = false,
    shouldScaleOnHover = false,
    onClick,
    children,
    href,
    as = 'div',
    accessibilityLabel,
    validationState = 'none',
    cursor,
    borderRadius = 'medium',
    width,
    height,
    minHeight,
    minWidth,
    maxWidth,
    testID,
    styledPropsClasses = '',
    analyticsAttributes = {},
  }: CardRootProps = $props();

  let isPressed = $state(false);

  const isInteractive = $derived(!!(onClick || href));
  const elementType = as === 'label' ? 'label' : 'div';

  const classes = $derived(
    [
      cardStyles({
        isSelected,
        isFocused,
        shouldScaleOnHover,
        isPressed,
        validationState,
        isInteractive,
        as: elementType,
      }),
      styledPropsClasses,
    ]
      .filter(Boolean)
      .join(' '),
  );

  const metaAttrs = $derived(metaAttribute({ name: 'Card', testID }));
  const accessibilityAttrs = $derived(
    makeAccessible({
      label: accessibilityLabel,
      role: href ? 'link' : onClick ? 'button' : undefined,
    }),
  );

  const styles = $derived(() => {
    const styleObj: Record<string, string> = {};
    if (width) styleObj.width = width;
    if (height) styleObj.height = height;
    if (minHeight) styleObj['min-height'] = minHeight;
    if (minWidth) styleObj['min-width'] = minWidth;
    if (maxWidth) styleObj['max-width'] = maxWidth;
    if (cursor) styleObj.cursor = cursor;
    if (borderRadius === 'medium') styleObj['border-radius'] = 'var(--border-radius-medium)';
    if (borderRadius === 'large') styleObj['border-radius'] = 'var(--border-radius-large)';
    if (borderRadius === 'xlarge') styleObj['border-radius'] = 'var(--border-radius-xlarge)';
    return styleObj;
  });

  function handleMouseDown(): void {
    if (isInteractive) {
      isPressed = true;
    }
  }

  function handleMouseUp(): void {
    isPressed = false;
  }

  function handleTouchStart(): void {
    if (isInteractive) {
      isPressed = true;
    }
  }

  function handleTouchEnd(): void {
    isPressed = false;
  }
</script>

<svelte:element
  this={elementType}
  class={classes}
  style={Object.entries(styles()).map(([k, v]) => `${k}: ${v}`).join('; ')}
  tabindex={isInteractive ? 0 : undefined}
  onmousedown={handleMouseDown}
  onmouseup={handleMouseUp}
  ontouchstart={handleTouchStart}
  ontouchend={handleTouchEnd}
  {...metaAttrs}
  {...accessibilityAttrs}
  {...analyticsAttributes}
>
  {@render children()}
</svelte:element>
