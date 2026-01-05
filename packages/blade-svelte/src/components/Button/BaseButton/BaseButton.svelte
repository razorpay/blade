<script lang="ts">
  import { makeAccessible, makeAnalyticsAttribute, metaAttribute, MetaConstants } from '@razorpay/blade-core/utils';
  import { useInteraction } from '../../../utils/useInteraction';
  import BaseText from '../../Typography/BaseText/BaseText.svelte';
  import BaseSpinner from '../../Spinner/BaseSpinner/BaseSpinner.svelte';
  import type { BaseButtonProps } from './types';
  import { getStyledPropsClasses } from '@razorpay/blade-core/utils';
  import {
    getButtonClasses,
    getButtonTemplateClasses,
    getButtonTextColorToken,
    getButtonTextSizes,
    getButtonSpinnerSize,
    type ActionStatesType as ButtonActionStatesType,
    type SpinnerColor,
  } from '@razorpay/blade-core/styles';

  // Get template classes via function call to prevent Svelte tree-shaking
  const buttonClasses = getButtonTemplateClasses();

  let {
    children,
    icon: Icon,
    iconPosition = 'left',
    variant = 'primary',
    color = 'primary',
    size = 'medium',
    isDisabled = false,
    isFullWidth = false,
    isLoading = false,
    href,
    target,
    rel,
    type = 'button',
    id,
    tabIndex,
    accessibilityProps,
    testID,
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
    onKeyDown,
    ...rest
  }: BaseButtonProps = $props();

  // Validation - check if we have either icon or children
  $effect(() => {
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      const hasChildren = children !== undefined && children !== null;
      const hasText = typeof children === 'string' ? children.trim().length > 0 : hasChildren;
      if (!Icon && !hasText) {
        console.error('BaseButton: At least one of icon or text is required to render a button.');
      }
    }
  });

  const isLink = $derived(Boolean(href));
  const isButton = $derived(!isLink);

  // Button cannot be disabled when its rendered as Link
  const disabled = $derived(isLoading || (isDisabled && isButton));

  // Create interaction state using $state
  let currentInteraction = $state<ButtonActionStatesType>(
    disabled ? 'disabled' : 'default',
  );

  // Pressed state for animation
  let isPressed = $state(false);

  // Use interaction hook for managing interaction states
  const {
    onMouseEnter: handleMouseEnterInteraction,
    onMouseLeave: handleMouseLeaveInteraction,
    onFocus: handleFocusInteraction,
    onBlur: handleBlurInteraction,
  } = useInteraction(
    () => currentInteraction,
    (state: ButtonActionStatesType) => {
      currentInteraction = state;
    },
  );

  // Update interaction state when disabled prop changes
  $effect(() => {
    if (disabled) {
      currentInteraction = 'disabled';
    } else if (currentInteraction === 'disabled') {
      currentInteraction = 'default';
    }
  });

  // Get children as string for text rendering
  const childrenString = $derived(
    typeof children === 'string' ? children : undefined,
  );

  // Check if icon-only button
  const isIconOnly = $derived(
    Boolean(Icon) && (!childrenString || childrenString.trim().length === 0),
  );

  // Get text sizes
  const textSizes = getButtonTextSizes();

  // Compute text color token reactively
  const textColorToken = $derived.by(() => {
    return getButtonTextColorToken({
      variant,
      color,
      state: currentInteraction,
      property: 'text',
    });
  });

  // Compute icon color token reactively
  // Note: Currently unused but will be needed when Icon component is implemented
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const iconColorToken = $derived(
    getButtonTextColorToken({
      variant,
      color,
      state: currentInteraction,
      property: 'icon',
    }),
  );

  // Get text sizes
  const fontSize = $derived(textSizes.fontSize[size]);
  const lineHeight = $derived(textSizes.lineHeight[size]);

  // Get spinner size based on button size
  const spinnerSizeMap = getButtonSpinnerSize();
  const spinnerSize = $derived(spinnerSizeMap[size]);

  // Get spinner color - should match button color directly
  // Primary → blue, Negative → red, Positive → green, White → white
  // Spinner doesn't support 'transparent', so use 'primary' as fallback
  const spinnerColor = $derived.by((): SpinnerColor => {
    if (color === 'transparent') {
      return 'primary';
    }
    // Direct mapping: button color → spinner color
    // Button colors: 'primary' | 'white' | 'positive' | 'negative' | 'transparent'
    // Spinner colors: 'primary' | 'white' | 'positive' | 'negative' | 'neutral'
    return color as SpinnerColor;
  });

  // Generate button props reactively
  const buttonProps = $derived.by(() => {
    return {
      // Element props
      as: isLink ? 'a' : 'button',
      elementTag: isLink ? 'a' : 'button',
      elementType: isButton ? type : undefined,
      disabled: isButton && disabled,
      role: isLink ? 'link' : 'button',
      defaultRel: target && target === '_blank' ? 'noreferrer noopener' : undefined,
    };
  });

  // Destructure buttonProps for easier access
  const {
    elementTag,
    elementType,
    disabled: isButtonDisabled,
    role: buttonRole,
    defaultRel,
  } = $derived(buttonProps);

  // Generate BaseButton classes from blade-core
  const baseButtonClasses = $derived(
    getButtonClasses({
      variant,
      color,
      size,
      isDisabled: isButtonDisabled,
      isFullWidth,
      isIconOnly,
    }),
  );

  // Extract styled props
  const styledProps = $derived(getStyledPropsClasses(rest));

  // Combine classes for button element
  const combinedClasses = $derived(() => {
    const classes = [
      baseButtonClasses,
      isLoading ? buttonClasses.loading : '',
      'focus-ring-parent',
    ];
    if (styledProps.classes) {
      classes.push(...styledProps.classes);
    }
    return classes.filter(Boolean).join(' ');
  });

  // Animated content wrapper classes (for scale animation)
  const animatedContentClasses = $derived(() => {
    const classes = [
      buttonClasses.animatedContent,
      isPressed ? buttonClasses.pressed : '',
    ];
    return classes.filter(Boolean).join(' ');
  });

  // Accessibility attributes
  const accessibilityAttrs = $derived(
    makeAccessible({
      role: accessibilityProps?.role ?? buttonRole,
      disabled: isButtonDisabled,
      label: accessibilityProps?.label,
      describedBy: accessibilityProps?.describedBy,
      expanded: accessibilityProps?.expanded,
      hasPopup: accessibilityProps?.hasPopup,
    }),
  );

  // Meta attributes
  const metaAttrs = metaAttribute({
    name: MetaConstants.Button,
    testID,
  });

  // Analytics attributes
  const analyticsAttrs = makeAnalyticsAttribute(rest);

  // Event handlers
  function handleClick(event: MouseEvent): void {
    if (onClick && !isButtonDisabled) {
      onClick(event);
    }
  }

  function handleFocus(event: FocusEvent): void {
    if (!isButtonDisabled) {
      handleFocusInteraction();
    }
    onFocus?.(event);
  }

  function handleBlur(event: FocusEvent): void {
    if (!isButtonDisabled) {
      handleBlurInteraction();
    }
    onBlur?.(event);
  }

  function handleMouseEnter(): void {
    if (!isButtonDisabled) {
      handleMouseEnterInteraction();
    }
  }

  function handleMouseLeave(event: MouseEvent): void {
    if (!isButtonDisabled) {
      handleMouseLeaveInteraction();
    }
    onMouseLeave?.(event);
  }

  function handleMouseDown(event: MouseEvent): void {
    if (!isButtonDisabled) {
      isPressed = true;
    }
    onMouseDown?.(event);
  }

  function handleMouseUp(event: MouseEvent): void {
    if (!isButtonDisabled) {
      isPressed = false;
    }
    onMouseUp?.(event);
  }

  function handlePointerDown(event: PointerEvent): void {
    if (!isButtonDisabled) {
      isPressed = true;
    }
    onPointerDown?.(event);
  }

  function handleTouchStart(event: TouchEvent): void {
    if (!isButtonDisabled) {
      isPressed = true;
    }
    onTouchStart?.(event);
  }

  function handleTouchEnd(event: TouchEvent): void {
    if (!isButtonDisabled) {
      isPressed = false;
    }
    onTouchEnd?.(event);
  }

  function handleKeyDown(event: KeyboardEvent): void {
    if (!isButtonDisabled) {
      if (event.key === ' ' || event.key === 'Enter') {
        isPressed = true;
      }
    }
    onKeyDown?.(event);
  }

  function handleKeyUp(event: KeyboardEvent): void {
    if (!isButtonDisabled) {
      if (event.key === ' ' || event.key === 'Enter') {
        isPressed = false;
      }
    }
  }
</script>

<svelte:element
  this={elementTag}
  class={combinedClasses()}
  {id}
  {...accessibilityAttrs}
  {...metaAttrs}
  {...analyticsAttrs}
  onclick={handleClick}
  onfocus={handleFocus}
  onblur={handleBlur}
  onmouseenter={handleMouseEnter}
  onmouseleave={handleMouseLeave}
  onmousemove={onMouseMove}
  onmousedown={handleMouseDown}
  onmouseup={handleMouseUp}
  onpointerdown={handlePointerDown}
  onpointerenter={onPointerEnter}
  ontouchstart={handleTouchStart}
  ontouchend={handleTouchEnd}
  onkeydown={handleKeyDown}
  onkeyup={handleKeyUp}
  type={elementType}
  disabled={isButtonDisabled || undefined}
  href={isLink ? href : undefined}
  target={isLink ? target : undefined}
  rel={isLink ? (rel ?? defaultRel) : undefined}
  {tabIndex}
>
  <div class={animatedContentClasses()}>
    {#if isLoading}
      <div class={buttonClasses.loadingSpinner}>
        <BaseSpinner
          size={spinnerSize}
          color={spinnerColor}
          accessibilityLabel="Loading"
        />
      </div>
    {/if}
    <span class={buttonClasses.content + (isLoading ? ' ' + buttonClasses.loading : '') + ' focus-ring-child'}>
      {#if Icon && iconPosition === 'left'}
        <span class={buttonClasses.icon}>
          <!-- TODO: Render Icon component when available -->
          <!-- <Icon size={iconSize} color={iconColorToken} /> -->
        </span>
      {/if}
      {#if childrenString}
        <BaseText
          as="span"
          color={textColorToken}
          fontSize={fontSize}
          lineHeight={lineHeight}
          fontFamily="text"
          fontWeight="medium"
          textAlign="center"
          componentName={MetaConstants.Button}
        >
          {childrenString}
        </BaseText>
      {:else if children && typeof children === 'function'}
        <BaseText
          as="span"
          color={textColorToken}
          fontSize={fontSize}
          lineHeight={lineHeight}
          fontFamily="text"
          fontWeight="medium"
          textAlign="center"
          componentName={MetaConstants.Button}
        >
          {@render children()}
        </BaseText>
      {/if}
      {#if Icon && iconPosition === 'right'}
        <span class={buttonClasses.icon}>
          <!-- TODO: Render Icon component when available -->
          <!-- <Icon size={iconSize} color={iconColorToken} /> -->
        </span>
      {/if}
    </span>
  </div>
</svelte:element>
