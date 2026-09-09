<script lang="ts">
  import { makeAccessible, makeAnalyticsAttribute, metaAttribute, MetaConstants, type AriaRoles } from '@razorpay/blade-core/utils';
  import { useInteraction } from '../../../utils/useInteraction';
  import BaseText from '../../Typography/BaseText/BaseText.svelte';
  import type { TextColors } from '../../Typography/BaseText/types';
  import { getStyledPropsClasses } from '@razorpay/blade-core/utils';
  import { getBaseLinkClasses, getBaseLinkContentClasses, getBaseLinkTemplateClasses, getLinkColorToken, getLinkTextSizes, getLinkIconSizeMap, type ActionStatesType } from '@razorpay/blade-core/styles';
  import type { IconColor } from '../../Icons/types';
  import type { BaseLinkProps } from './types';

  // Get template classes via function call to prevent Svelte tree-shaking
  const linkClasses = getBaseLinkTemplateClasses();

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
      iconSize: getLinkIconSizeMap()[size],
      
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

  // Content-span classes. Opacity is applied here (not on the outer
  // element) so the focus ring on the anchor/button is not dimmed.
  const contentClasses = $derived(getBaseLinkContentClasses({ opacity }));


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
  const combinedClasses = $derived.by(() => {
    const classes = [
      baseLinkClasses,
      'focus-ring-parent', // Focus ring utility from theme.css
    ];
    if (styledProps.classes) {
      classes.push(...styledProps.classes);
    }
    return classes.filter(Boolean).join(' ');
  });
  
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
  class={combinedClasses}
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
  <span class={contentClasses + ' focus-ring-child'}>
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

