<script lang="ts">
  import {
    makeAccessible,
    makeAnalyticsAttribute,
    metaAttribute,
    MetaConstants,
    getStyledPropsClasses,
  } from '@razorpay/blade-core/utils';
  import {
    getIconButtonClasses,
    getIconButtonTemplateClasses,
  } from '@razorpay/blade-core/styles';
  import type { BaseIconButtonProps } from './types';

  // Call template classes fn to prevent Svelte tree-shaking of CVA-only classes.
  getIconButtonTemplateClasses();

  let {
    icon: Icon,
    size = 'medium',
    emphasis = 'intense',
    accessibilityLabel,
    accessibilityProps,
    isDisabled = false,
    isHighlighted = false,
    tabIndex,
    testID,
    onClick,
    onBlur,
    onFocus,
    onMouseLeave,
    onMouseMove,
    onPointerDown,
    onPointerEnter,
    onTouchStart,
    onTouchEnd,
    onKeyDown,
    ...rest
  }: BaseIconButtonProps = $props();

  // `size="large"` with `isHighlighted` or `emphasis="moderate"` is invalid (React throws in
  // __DEV__). Surface it as a localhost-only console error; still render the button.
  $effect(() => {
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      if (size === 'large' && (isHighlighted || emphasis === 'moderate')) {
        console.error(
          '[Blade: IconButton]: size "large" is not allowed with isHighlighted true or emphasis "moderate"',
        );
      }
      if (emphasis === 'moderate' && isHighlighted) {
        console.error(
          '[Blade: IconButton]: emphasis "moderate" is not compatible with isHighlighted true — moderate already provides its own highlighted-background style',
        );
      }
    }
  });

  const cvaClasses = $derived(getIconButtonClasses({ emphasis, size, isHighlighted }));
  const styledProps = $derived(getStyledPropsClasses(rest));
  const combinedClasses = $derived(
    [cvaClasses, ...(styledProps.classes ?? [])].filter(Boolean).join(' '),
  );

  const accessibilityAttrs = $derived(
    makeAccessible({
      ...accessibilityProps,
      label: accessibilityLabel ?? accessibilityProps?.label,
    }),
  );

  const metaAttrs = $derived(metaAttribute({ name: MetaConstants.IconButton, testID }));
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));

  function handleClick(event: MouseEvent): void {
    if (!isDisabled) {
      onClick?.(event);
    }
  }

  function handleBlur(event: FocusEvent): void {
    if (!isDisabled) {
      onBlur?.(event);
    }
  }

  function handleFocus(event: FocusEvent): void {
    if (!isDisabled) {
      onFocus?.(event);
    }
  }

  function handleMouseLeave(event: MouseEvent): void {
    if (!isDisabled) {
      onMouseLeave?.(event);
    }
  }

  function handleMouseMove(event: MouseEvent): void {
    if (!isDisabled) {
      onMouseMove?.(event);
    }
  }

  function handlePointerDown(event: PointerEvent): void {
    if (!isDisabled) {
      onPointerDown?.(event);
    }
  }

  function handlePointerEnter(event: PointerEvent): void {
    if (!isDisabled) {
      onPointerEnter?.(event);
    }
  }

  function handleTouchStart(event: TouchEvent): void {
    if (!isDisabled) {
      onTouchStart?.(event);
    }
  }

  function handleTouchEnd(event: TouchEvent): void {
    if (!isDisabled) {
      onTouchEnd?.(event);
    }
  }

  function handleKeyDown(event: KeyboardEvent): void {
    if (!isDisabled) {
      onKeyDown?.(event);
    }
  }
</script>

<button
  type="button"
  class={combinedClasses}
  disabled={isDisabled || undefined}
  tabindex={tabIndex}
  {...accessibilityAttrs}
  {...metaAttrs}
  {...analyticsAttrs}
  onclick={handleClick}
  onblur={handleBlur}
  onfocus={handleFocus}
  onmouseleave={handleMouseLeave}
  onmousemove={handleMouseMove}
  onpointerdown={handlePointerDown}
  onpointerenter={handlePointerEnter}
  ontouchstart={handleTouchStart}
  ontouchend={handleTouchEnd}
  onkeydown={handleKeyDown}
>
  <Icon {size} color="currentColor" />
</button>
