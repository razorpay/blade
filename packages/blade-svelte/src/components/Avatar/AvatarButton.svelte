<script lang="ts">
  import { makeAccessible, type AriaRoles } from '@razorpay/blade-core/utils';
  import {
    getAvatarButtonClasses,
    getAvatarTemplateClasses,
    avatarIconSizeTokens,
    avatarTextSizeMapping,
    getButtonTextColorToken,
  } from '@razorpay/blade-core/styles';
  import BaseText from '../Typography/BaseText/BaseText.svelte';
  import Heading from '../Typography/Heading/Heading.svelte';
  import type { TextColors } from '../Typography/BaseText/types';
  import type { IconColor } from '../Icons/types';
  import type { AvatarButtonProps } from './types';

  // Prevent tree-shaking
  const templateClasses = getAvatarTemplateClasses();

  let {
    size = 'medium',
    variant = 'circle',
    color = 'neutral',
    icon: Icon,
    imgProps,
    children,
    href,
    target,
    rel,
    onClick,
    isSelected,
    onBlur,
    onFocus,
    onMouseLeave,
    onMouseMove,
    onMouseDown,
    onPointerDown,
    onPointerEnter,
    onTouchStart,
    onTouchEnd,
  }: AvatarButtonProps = $props();

  const isLink = $derived(Boolean(href));
  const isInteractive = $derived(Boolean(onClick || isLink));
  const elementTag = $derived(isInteractive ? (isLink ? 'a' : 'button') : 'div');
  const defaultRel = $derived(target === '_blank' ? 'noreferrer noopener' : undefined);

  // Color tokens for icon and text
  const iconColorToken = $derived(
    getButtonTextColorToken({
      property: 'icon',
      variant: 'secondary',
      color,
      state: 'default',
    }) as IconColor,
  );

  const textColorToken = $derived(
    getButtonTextColorToken({
      property: 'text',
      variant: 'secondary',
      color,
      state: 'default',
    }) as TextColors,
  );

  // Icon size
  const iconSize = $derived(avatarIconSizeTokens[size]);

  // Text size
  const textSize = $derived(avatarTextSizeMapping[size]);

  // CSS classes
  const btnClasses = $derived(
    getAvatarButtonClasses({
      size,
      variant,
      color,
      isInteractive,
      isSelected: isSelected ?? false,
    }),
  );

  // Accessibility
  const a11yAttrs = $derived(
    makeAccessible({
      role: (isInteractive ? (isLink ? 'link' : 'button') : 'presentation') as AriaRoles,
    }),
  );

  // Event handlers
  function handleClick(event: MouseEvent): void {
    if (onClick) {
      onClick(event);
    }
  }

  function handleBlur(event: FocusEvent): void {
    onBlur?.(event);
  }

  function handleFocus(event: FocusEvent): void {
    onFocus?.(event);
  }

  function handleMouseLeave(event: MouseEvent): void {
    onMouseLeave?.(event);
  }

  function handleMouseMove(event: MouseEvent): void {
    onMouseMove?.(event);
  }

  function handleMouseDown(event: MouseEvent): void {
    onMouseDown?.(event);
  }

  function handlePointerDown(event: PointerEvent): void {
    onPointerDown?.(event);
  }

  function handlePointerEnter(event: PointerEvent): void {
    onPointerEnter?.(event);
  }

  function handleTouchStart(event: TouchEvent): void {
    onTouchStart?.(event);
  }

  function handleTouchEnd(event: TouchEvent): void {
    onTouchEnd?.(event);
  }
</script>

<svelte:element
  this={elementTag}
  class={btnClasses}
  href={isLink ? href : undefined}
  target={isLink ? target : undefined}
  rel={isLink ? (rel ?? defaultRel) : undefined}
  {...a11yAttrs}
  onclick={handleClick}
  onblur={handleBlur}
  onfocus={handleFocus}
  onmouseleave={handleMouseLeave}
  onmousemove={handleMouseMove}
  onmousedown={handleMouseDown}
  onpointerdown={handlePointerDown}
  onpointerenter={handlePointerEnter}
  ontouchstart={handleTouchStart}
  ontouchend={handleTouchEnd}
>
  <div class={templateClasses.btnContent}>
    {#if Icon}
      <Icon size={iconSize} color={iconColorToken} />
    {/if}

    {#if imgProps?.src}
      <img
        src={imgProps.src}
        alt={imgProps.alt}
        srcset={imgProps.srcSet}
        crossorigin={imgProps.crossOrigin}
        referrerpolicy={imgProps.referrerPolicy}
      />
    {/if}

    {#if children}
      {#if size === 'xlarge'}
        <Heading size="medium" weight="semibold" color={textColorToken}>
          {children}
        </Heading>
      {:else}
        <BaseText
          as="span"
          color={textColorToken}
          fontSize={textSize === 'xsmall' ? 75 : textSize === 'small' ? 100 : 200}
          lineHeight={textSize === 'xsmall' ? 75 : textSize === 'small' ? 100 : 200}
          fontFamily="text"
          fontWeight="semibold"
        >
          {children}
        </BaseText>
      {/if}
    {/if}
  </div>
</svelte:element>
