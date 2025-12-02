<script lang="ts">
  import './baseLink.css';
  import type { Snippet } from 'svelte';
  import { cva } from 'class-variance-authority';
  import { makeAccessible, makeAnalyticsAttribute, metaAttribute, MetaConstants } from '@razorpay/blade-core/utils';
  import { useInteraction } from '../../../utils/useInteraction';
  import type { ActionStatesType } from '../../../types';
  import BaseText from '../../Typography/BaseText/BaseText.svelte';
  import { getColorToken, getTextSizes } from './utils';
  import type { StyledPropsBlade } from '@razorpay/blade-core/utils';
  import { getStyledPropsClasses } from '@razorpay/blade-core/utils';

  // Icon component type - placeholder for now
  // TODO: Replace with actual Icon component when available
  type IconComponent = any;

  interface BaseLinkProps extends StyledPropsBlade {
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
  $effect(() => {
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost' && !Icon && !children) {
      console.error('BaseLink: At least one of icon or text is required to render a link.');
    }
  });

  const isButton = variant === 'button';

  // Create interaction state using $state (must be in .svelte file)
  // Initialize based on current disabled state
  let currentInteraction = $state<'default' | 'hover' | 'focus' | 'disabled'>(
    isButton && isDisabled ? 'disabled' : 'default',
  );

  // Use interaction hook for managing interaction states
  const {
    onMouseEnter: handleMouseEnterInteraction,
    onMouseLeave: handleMouseLeaveInteraction,
    onFocus: handleFocusInteraction,
    onBlur: handleBlurInteraction,
  } = useInteraction(
    () => currentInteraction,
    (state: ActionStatesType) => {
      currentInteraction = state;
    },
  );

  // Update interaction state when disabled prop changes
  $effect(() => {
    const isCurrentlyDisabled = isButton && isDisabled;
    if (isCurrentlyDisabled) {
      currentInteraction = 'disabled';
    } else if (currentInteraction === 'disabled') {
      currentInteraction = 'default';
    }
  });

  // Generate all props reactively - updates when currentInteraction or other args change
  const linkProps = $derived.by(() => {
    const isButton = variant === 'button';
    const textSizes = getTextSizes();

    return {
      // Element props
      as: isButton ? 'button' : 'a',
      elementTag: isButton ? 'button' : 'a',
      type: isButton ? 'button' : undefined,
      disabled: isButton && isDisabled,
      role: isButton ? 'button' : 'link',
      defaultRel: target && target === '_blank' ? 'noreferrer noopener' : undefined,
      
      // Text props for BaseText
      textDecorationLine: !isButton && currentInteraction !== 'default' ? 'underline' : 'none',
      textColorToken: getColorToken({
        variant: variant,
        color,
        element: 'text',
        currentInteraction,
        isDisabled,
      }),
      fontSize: textSizes.fontSize[size],
      lineHeight: textSizes.lineHeight[size],
      
      // Icon props
      iconColor: getColorToken({
        variant,
        color,
        element: 'icon',
        currentInteraction,
        isDisabled,
      }),
      iconSize: size,
      
      // Style props
      cursor: isButton && isDisabled ? 'not-allowed' : 'pointer',
    };
  });

  // Destructure linkProps for cleaner template usage
  // Note: iconColor is computed in linkProps but not destructured since icon rendering is TODO
  // When icon component is implemented, it should use color classes directly
  const {
    elementTag,
    type: elementType,
    disabled: isElementDisabled,
    role: elementRole,
    defaultRel,
    textDecorationLine,
    textColorToken,
    fontSize,
    lineHeight,
  } = $derived(linkProps);

  // CVA definitions for clean variant management
  const linkClass = cva('base-link focus-ring-parent', {
    variants: {
      variant: {
        anchor: 'base-link--anchor',
        button: 'base-link--button',
      },
      size: {
        xsmall: 'base-link--xsmall',
        small: 'base-link--small',
        medium: 'base-link--medium',
        large: 'base-link--large',
      },
      disabled: {
        true: 'cursor-not-allowed',
        false: 'cursor-pointer',
      },
    },
    defaultVariants: {
      variant: 'anchor',
      size: 'medium',
      disabled: false,
    },
  });


  // Accessibility attributes
  const accessibilityAttrs = $derived(
    makeAccessible({
      role: elementRole,
      disabled: isElementDisabled,
      ...accessibilityProps,
    }),
  );

  // Meta attributes
  const metaAttrs = metaAttribute({
    name: MetaConstants.Link,
    testID,
  });

  // Extract all styled props which are global to components
  // Note: getStyledPropsClasses returns both classes and inlineStyles,
  // but we only use classes here - inlineStyles are ignored (not applied)
  // This ensures everything is class-based with no inline styles
  const styledProps = $derived(getStyledPropsClasses(rest));
  
  // Combine classes with styled props classes
  // styledProps.inlineStyles is intentionally ignored to maintain pure class-based styling
  const combinedClasses = $derived(() => {
    const classes = [
      linkClass({
        variant,
        size,
        disabled: isElementDisabled,
      }),
    ];
    if (styledProps.classes) {
      classes.push(...styledProps.classes);
    }
    return classes.filter(Boolean).join(' ');
  });
  
  // Icon color is stored for when icon component is implemented
  // When icon is rendered, it should use the color class directly instead of CSS variable
  // For now, iconColor is available but not used (icon rendering is TODO)
  
  // Analytics attributes (rest after styled props are extracted)
  const analyticsAttrs = makeAnalyticsAttribute(rest);

  // Event handlers
  function handleClick(event: MouseEvent): void {
    if (onClick && !isElementDisabled) {
      onClick(event);
    }
  }

  function handleFocus(event: FocusEvent): void {
    if (!isElementDisabled) {
      handleFocusInteraction();
    }
    onFocus?.(event);
  }

  function handleBlur(event: FocusEvent): void {
    if (!isElementDisabled) {
      handleBlurInteraction();
    }
    onBlur?.(event);
  }

  function handleMouseEnter(): void {
    if (!isElementDisabled) {
      handleMouseEnterInteraction();
    }
  }

  function handleMouseLeave(event: MouseEvent): void {
    if (!isElementDisabled) {
      handleMouseLeaveInteraction();
    }
    onMouseLeave?.(event);
  }

</script>

<svelte:element
  this={elementTag}
  class={combinedClasses()}
  title={htmlTitle}
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
  type={elementType}
  disabled={isElementDisabled || undefined}
  href={!isButton ? href : undefined}
  target={!isButton ? target : undefined}
  rel={!isButton ? (rel ?? defaultRel) : undefined}
>
  <span class="base-link__content focus-ring-child">
    {#if Icon && iconPosition === 'left'}
      <!-- <span class={iconClass({ position: 'left', hasChildren })}> -->
        <!-- TODO: Render Icon component when available -->
      <!-- </span> -->
    {/if}
    {#if children}
      <BaseText
        as="span"
        color={textColorToken}
        fontSize={fontSize}
        lineHeight={lineHeight}
        fontFamily="text"
        fontWeight="regular"
        textDecorationLine={textDecorationLine}
        componentName={MetaConstants.Link}
      >
        {@render children()}
      </BaseText>
    {/if}
    {#if Icon && iconPosition === 'right'}
      <!-- <span class={iconClass({ position: 'right', hasChildren })}> -->
        <!-- TODO: Render Icon component when available -->
      <!-- </span> -->
    {/if}
  </span>
</svelte:element>

