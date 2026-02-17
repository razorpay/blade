<script lang="ts">
  import type { Snippet, Component } from 'svelte';
  import { makeAccessible, makeAnalyticsAttribute, metaAttribute, MetaConstants, type AriaRoles } from '@razorpay/blade-core/utils';
  import { useInteraction } from '../../../utils/useInteraction';
  import BaseText from '../../Typography/BaseText/BaseText.svelte';
  import type { TextColors } from '../../Typography/BaseText/types';
  import type { StyledPropsBlade } from '@razorpay/blade-core/utils';
  import { getStyledPropsClasses } from '@razorpay/blade-core/utils';
  import { getBaseLinkClasses, getBaseLinkTemplateClasses, getLinkColorToken, getLinkTextSizes, type ActionStatesType } from '@razorpay/blade-core/styles';
  import type { IconProps, IconColor } from '../../Icons/types';

  // Get template classes via function call to prevent Svelte tree-shaking
  const linkClasses = getBaseLinkTemplateClasses();

  // Icon component type - Svelte component that accepts IconProps
  type IconComponent = Component<IconProps>;

  interface BaseLinkProps extends StyledPropsBlade {
    children?: Snippet | string;
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

  // Use $derived for reactivity when props change
  const isButton = $derived(variant === 'button');

  // Check if children has any content (string or Snippet)
  const hasChildren = $derived(
    (typeof children === 'string' && children.trim().length > 0) ||
    (typeof children === 'function')  // Snippet is a function
  );

  // Create interaction state using $state (must be in .svelte file)
  // Initialize based on current disabled state
  let currentInteraction = $state<'default' | 'hover' | 'focus' | 'disabled'>('default');

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
    const isCurrentlyDisabled = (variant === 'button') && isDisabled;
    if (isCurrentlyDisabled) {
      currentInteraction = 'disabled';
    } else if (currentInteraction === 'disabled') {
      currentInteraction = 'default';
    }
  });

  // Generate all props reactively - updates when currentInteraction or other args change
  const linkProps = $derived.by(() => {
    const isButton = variant === 'button';
    const textSizes = getLinkTextSizes();

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
      textColorToken: getLinkColorToken({
        variant: variant,
        color,
        element: 'text',
        currentInteraction: currentInteraction as ActionStatesType,
        isDisabled,
      }) as TextColors,
      fontSize: textSizes.fontSize[size],
      lineHeight: textSizes.lineHeight[size],
      
      // Icon props
      iconColor: getLinkColorToken({
        variant,
        color,
        element: 'icon',
        currentInteraction: currentInteraction as ActionStatesType,
        isDisabled,
      }) as IconColor,
      iconSize: size as IconProps['size'],
      
      // Style props
      cursor: isButton && isDisabled ? 'not-allowed' : 'pointer',
    };
  });

  // Destructure linkProps for cleaner template usage
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
    iconColor,
    iconSize,
  } = $derived(linkProps);

  // Generate BaseLink classes from blade-core (single source of truth)
  // Everything is class-based - no inline styles or data attributes
  const baseLinkClasses = $derived(
    getBaseLinkClasses({
      variant,
      size,
      isDisabled: isElementDisabled,
    }),
  );


  // Accessibility attributes
  const accessibilityAttrs = $derived(
    makeAccessible({
      role: elementRole as AriaRoles,
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
      baseLinkClasses,
      'focus-ring-parent', // Focus ring utility from theme.css
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
  <span class={linkClasses.content + ' focus-ring-child'}>
    {#if Icon && iconPosition === 'left'}
      <span class={linkClasses.icon + (hasChildren ? ' ' + linkClasses.iconLeft : '')}>
        <Icon size={iconSize} color={iconColor} />
      </span>
    {/if}
    {#if children}
      <BaseText
        as="span"
        color={textColorToken}
        fontSize={fontSize}
        lineHeight={lineHeight}
        fontFamily="text"
        fontWeight="medium"
        textDecorationLine={textDecorationLine as 'none' | 'line-through' | 'underline'}
        componentName={MetaConstants.Link}
      >
        {#if typeof children === 'string'}
          {children}
        {:else}
          {@render children()}
        {/if}
      </BaseText>
    {/if}
    {#if Icon && iconPosition === 'right'}
      <span class={linkClasses.icon + (hasChildren ? ' ' + linkClasses.iconRight : '')}>
        <Icon size={iconSize} color={iconColor} />
      </span>
    {/if}
  </span>
</svelte:element>

