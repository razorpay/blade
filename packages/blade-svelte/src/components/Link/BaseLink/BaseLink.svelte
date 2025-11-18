<script lang="ts">
  import './baseLink.css';
  import type { Snippet } from 'svelte';
  import { makeAccessible, makeAnalyticsAttribute, metaAttribute, MetaConstants } from '@razorpay/blade-core/utils';

  // Icon component type - placeholder for now
  // TODO: Replace with actual Icon component when available
  type IconComponent = any;

  interface BaseLinkProps {
    children?: Snippet;
    icon?: IconComponent;
    iconPosition?: 'left' | 'right';
    variant?: 'anchor' | 'button';
    href?: string;
    target?: string;
    rel?: string;
    isDisabled?: boolean;
    onClick?: (event: MouseEvent) => void;
    color?: 'primary' | 'white' | 'positive' | 'negative' | 'notice' | 'information' | 'neutral';
    size?: 'xsmall' | 'small' | 'medium' | 'large';
    accessibilityProps?: {
      label?: string;
      describedBy?: string;
    };
    testID?: string;
    htmlTitle?: string;
    opacity?: number;
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
    icon: Icon,
    iconPosition = 'left',
    variant = 'anchor',
    href,
    target,
    rel,
    isDisabled = false,
    onClick,
    color = 'primary',
    size = 'medium',
    accessibilityProps,
    testID,
    htmlTitle,
    opacity,
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
    ...rest
  }: BaseLinkProps = $props();

  // Validation - check if we have either icon or children
  if (import.meta.env.DEV && !Icon && !children) {
    throw new Error('BaseLink: At least one of icon or text is required to render a link.');
  }

  // Interaction state
  let currentInteraction: 'default' | 'hover' | 'focus' | 'disabled' = isDisabled && variant === 'button' ? 'disabled' : 'default';

  // Get color token based on state - reactive
  function getColorToken(element: 'icon' | 'text'): string {
    const state = currentInteraction;
    const map = {
      default: 'normal',
      hover: 'subtle',
      focus: 'normal',
      disabled: 'disabled',
    } as const;

    const stateKey = map[state];
    
    if (color && color !== 'primary') {
      if (color !== 'white') {
        return `var(--interactive-${element}-${color}-${stateKey})`;
      }
      return `var(--interactive-${element}-static-white-${stateKey})`;
    }
    return `var(--interactive-${element}-primary-${stateKey})`;
  }

  // Get text size tokens
  const textSizes = {
    fontSize: {
      xsmall: 'var(--font-size-25)',
      small: 'var(--font-size-75)',
      medium: 'var(--font-size-100)',
      large: 'var(--font-size-200)',
    },
    lineHeight: {
      xsmall: 'var(--line-height-25)',
      small: 'var(--line-height-75)',
      medium: 'var(--line-height-100)',
      large: 'var(--line-height-200)',
    },
  };

  const isButton = variant === 'button';
  
  // Reactive values based on currentInteraction
  const textDecorationLine = !isButton && currentInteraction !== 'default' ? 'underline' : 'none';
  const iconColor = $derived(getColorToken('icon'));
  const textColor = $derived(getColorToken('text'));
  const iconPadding = children ? 'var(--spacing-2)' : 'var(--spacing-0)';
  const defaultRel = target && target === '_blank' ? 'noreferrer noopener' : undefined;

  // Accessibility attributes
  const accessibilityAttrs = makeAccessible({
    role: isButton ? 'button' : 'link',
    disabled: isButton && isDisabled,
    ...accessibilityProps,
  });

  // Meta attributes
  const metaAttrs = metaAttribute({
    name: MetaConstants.Link,
    testID,
  });

  // Analytics attributes
  const analyticsAttrs = makeAnalyticsAttribute(rest);

  // Event handlers
  function handleClick(event: MouseEvent): void {
    if (onClick && !(isButton && isDisabled)) {
      onClick(event);
    }
  }

  function handleFocus(event: FocusEvent): void {
    if (!isDisabled) {
      currentInteraction = 'focus';
    }
    onFocus?.(event);
  }

  function handleBlur(event: FocusEvent): void {
    if (!isDisabled) {
      currentInteraction = 'default';
    }
    onBlur?.(event);
  }

  function handleMouseEnter(): void {
    if (!isDisabled && currentInteraction !== 'focus') {
      currentInteraction = 'hover';
    }
  }

  function handleMouseLeave(event: MouseEvent): void {
    if (!isDisabled) {
      currentInteraction = 'default';
    }
    onMouseLeave?.(event);
  }

  // Computed styles
  const linkClass = `base-link base-link--${variant} base-link--${color} base-link--${size}`;
  const contentClass = 'base-link__content';
  const textClass = `base-link__text base-link__text--${size}`;
</script>

{#if isButton}
  <button
    class={linkClass}
    class:disabled={isButton && isDisabled}
    type="button"
    disabled={isButton && isDisabled}
    title={htmlTitle}
    style="opacity: {opacity ?? 1};"
    {...accessibilityAttrs}
    {...metaAttrs}
    {...analyticsAttrs}
    onclick={handleClick}
    onfocus={handleFocus}
    onblur={handleBlur}
    onmouseenter={handleMouseEnter}
    onmouseleave={handleMouseLeave}
    onmousemove={onMouseMove}
    onpointerdown={onPointerDown}
    onpointerenter={onPointerEnter}
    ontouchstart={onTouchStart}
    ontouchend={onTouchEnd}
    onmousedown={onMouseDown}
    onmouseup={onMouseUp}
  >
    <span class={contentClass}>
      {#if Icon && iconPosition === 'left'}
        <span class="base-link__icon base-link__icon--left" style="padding-right: {iconPadding}; color: {iconColor};">
          <!-- TODO: Render Icon component when available -->
        </span>
      {/if}
      {#if children}
        <span
          class={textClass}
          style="color: {textColor}; text-decoration-line: {textDecorationLine}; font-size: {textSizes.fontSize[size]}; line-height: {textSizes.lineHeight[size]};"
        >
          {@render children()}
        </span>
      {/if}
      {#if Icon && iconPosition === 'right'}
        <span class="base-link__icon base-link__icon--right" style="padding-left: {iconPadding}; color: {iconColor};">
          <!-- TODO: Render Icon component when available -->
        </span>
      {/if}
    </span>
  </button>
{:else}
  <a
    class={linkClass}
    href={href}
    target={target}
    rel={rel ?? defaultRel}
    title={htmlTitle}
    style="opacity: {opacity ?? 1};"
    {...accessibilityAttrs}
    {...metaAttrs}
    {...analyticsAttrs}
    onclick={handleClick}
    onfocus={handleFocus}
    onblur={handleBlur}
    onmouseenter={handleMouseEnter}
    onmouseleave={handleMouseLeave}
    onmousemove={onMouseMove}
    onpointerdown={onPointerDown}
    onpointerenter={onPointerEnter}
    ontouchstart={onTouchStart}
    ontouchend={onTouchEnd}
    onmousedown={onMouseDown}
    onmouseup={onMouseUp}
  >
    <span class={contentClass}>
      {#if Icon && iconPosition === 'left'}
        <span class="base-link__icon base-link__icon--left" style="padding-right: {iconPadding}; color: {iconColor};">
          <!-- TODO: Render Icon component when available -->
        </span>
      {/if}
      {#if children}
        <span
          class={textClass}
          style="color: {textColor}; text-decoration-line: {textDecorationLine}; font-size: {textSizes.fontSize[size]}; line-height: {textSizes.lineHeight[size]};"
        >
          {@render children()}
        </span>
      {/if}
      {#if Icon && iconPosition === 'right'}
        <span class="base-link__icon base-link__icon--right" style="padding-left: {iconPadding}; color: {iconColor};">
          <!-- TODO: Render Icon component when available -->
        </span>
      {/if}
    </span>
  </a>
{/if}

