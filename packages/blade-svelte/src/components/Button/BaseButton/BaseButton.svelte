<script lang="ts">
  import { makeAccessible, makeAnalyticsAttribute, metaAttribute, MetaConstants, getTokenCSSVariable, type AriaRoles } from '@razorpay/blade-core/utils';
  import { useInteraction } from '../../../utils/useInteraction';
  import BaseText from '../../Typography/BaseText/BaseText.svelte';
  import AvatarGroup from '../../Avatar/AvatarGroup.svelte';
  import Avatar from '../../Avatar/Avatar.svelte';
  import type { BaseButtonProps } from './types';
  import type { TextColors } from '../../Typography/BaseText/types';
  import { getStyledPropsClasses } from '@razorpay/blade-core/utils';
  import {
    getButtonClasses,
    getButtonTemplateClasses,
    getButtonTextColorToken,
    getButtonProgressOverlayColorToken,
    getButtonTextSizes,
    getButtonIconSize,
    getButtonIconOnlySize,
    type ActionStatesType as ButtonActionStatesType,
  } from '@razorpay/blade-core/styles';
  import type { IconColor } from '../../Icons/types';

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
    loadingType = 'indefinite',
    loadingTimer,
    onLoadingComplete,
    avatars,
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

  const isIndefiniteLoading = $derived(loadingType === 'indefinite' && isLoading);
  const hasDefiniteLoading = $derived(loadingType === 'definite' && Boolean(loadingTimer));
  const isAnyLoading = $derived(isIndefiniteLoading || hasDefiniteLoading);

  // Button cannot be disabled when rendered as a Link
  const disabled = $derived(isAnyLoading || (isDisabled && isButton));

  // Create interaction state using $state
  let currentInteraction = $state<ButtonActionStatesType>('default');

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

  // Live announcement for screen readers — track previous isLoading value
  let liveAnnouncement = $state('');
  let prevIsLoading = $state(isLoading);

  $effect(() => {
    if (isLoading && !prevIsLoading) {
      liveAnnouncement = 'Started loading';
    } else if (!isLoading && prevIsLoading) {
      liveAnnouncement = 'Stopped loading';
    }
    prevIsLoading = isLoading;
  });

  // Get children as string for text rendering
  const childrenString = $derived(
    typeof children === 'string' ? children : undefined,
  );

  // Check if children has any content (string or Snippet)
  const hasChildren = $derived(
    (typeof children === 'string' && children.trim().length > 0) ||
    (typeof children === 'function')  // Snippet is a function
  );

  // Check if icon-only button
  const isIconOnly = $derived(
    Boolean(Icon) && !hasChildren,
  );

  // Whether to show the avatar group (large size only, not during indefinite loading)
  const showAvatars = $derived(
    size === 'large' && Boolean(avatars?.length) && !isIndefiniteLoading,
  );

  // Get text sizes
  const textSizes = getButtonTextSizes();

  // Compute text color token reactively
  const textColorToken = $derived.by((): TextColors => {
    return getButtonTextColorToken({
      variant,
      color,
      state: currentInteraction,
      property: 'text',
    }) as TextColors;
  });

  // Compute icon color token reactively
  const iconColorToken = $derived.by((): IconColor => {
    return getButtonTextColorToken({
      variant,
      color,
      state: currentInteraction,
      property: 'icon',
    }) as IconColor;
  });

  // Resolve definite loading overlay color to CSS variable value
  const progressOverlayColor = $derived(
    getTokenCSSVariable(getButtonProgressOverlayColorToken({ variant, color })),
  );

  // Get icon size maps
  const buttonIconSizeMap = getButtonIconSize();
  const buttonIconOnlySizeMap = getButtonIconOnlySize();

  // Compute icon size based on button size and whether it's icon-only
  const iconSize = $derived(
    isIconOnly ? buttonIconOnlySizeMap[size] : buttonIconSizeMap[size]
  );

  // Get text sizes
  const fontSize = $derived(textSizes.fontSize[size]);
  const lineHeight = $derived(textSizes.lineHeight[size]);

  // Generate button props reactively
  const buttonProps = $derived.by(() => {
    return {
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

  // Combine classes — only add `loading` class for indefinite (hides content)
  const combinedClasses = $derived(() => {
    const classes = [
      baseButtonClasses,
      isIndefiniteLoading ? buttonClasses.loading : '',
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
      role: (accessibilityProps?.role ?? buttonRole) as AriaRoles,
      disabled: isButtonDisabled,
      busy: isAnyLoading,
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

  function handleProgressEnd(): void {
    onLoadingComplete?.();
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
  {#if hasDefiniteLoading}
    <div class={buttonClasses.progressOverlay}>
      <div
        class={buttonClasses.progressFill}
        style:--btn-progress-duration="{loadingTimer}ms"
        style:--btn-progress-color={progressOverlayColor}
        onanimationend={handleProgressEnd}
      ></div>
    </div>
  {/if}

  <!-- Visually hidden polite live region for loading announcements -->
  <span
    aria-live="polite"
    style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0"
  >{liveAnnouncement}</span>

  <div class={animatedContentClasses()}>
    {#if isIndefiniteLoading}
      <div class={buttonClasses.dotsLoader}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    {/if}
    <span class={buttonClasses.content + (isIndefiniteLoading ? ' ' + buttonClasses.loading : '') + ' focus-ring-child'}>
      {#if Icon && iconPosition === 'left'}
        <span class={buttonClasses.icon + (hasChildren ? ' ' + buttonClasses.iconLeft : '')}>
          <Icon size={iconSize} color={iconColorToken} />
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
        <span class={buttonClasses.icon + (hasChildren ? ' ' + buttonClasses.iconRight : '')}>
          <Icon size={iconSize} color={iconColorToken} />
        </span>
      {/if}
      {#if showAvatars && avatars}
        <span class={buttonClasses.avatarGroupWrapper}>
          <AvatarGroup size="large">
            {#each avatars as avatarItem}
              <Avatar name={avatarItem.name} src={avatarItem.src} alt={avatarItem.alt} />
            {/each}
          </AvatarGroup>
        </span>
      {/if}
    </span>
  </div>
</svelte:element>
