<script lang="ts">
  import './baseLink.css';
  import type { Snippet } from 'svelte';
  import { cva } from 'class-variance-authority';
  import { makeAccessible, makeAnalyticsAttribute, metaAttribute, MetaConstants } from '@razorpay/blade-core/utils';
  import { useInteraction } from '../../../utils/useInteraction';
  import type { ActionStatesType, ColorType } from '../../../types';

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

  const isButton = variant === 'button';
  const disabled = isButton && isDisabled;

  // Create interaction state using $state (must be in .svelte file)
  let currentInteraction = $state<'default' | 'hover' | 'focus' | 'disabled'>(
    disabled ? 'disabled' : 'default',
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
    if (disabled) {
      currentInteraction = 'disabled';
    } else if (currentInteraction === 'disabled') {
      currentInteraction = 'default';
    }
  });

  // Get color token based on state - reactive
  function getColorToken(element: 'icon' | 'text'): string {
    const state = currentInteraction;
    const map: Record<ActionStatesType, ColorType> = {
      default: 'normal',
      hover: 'subtle',
      focus: 'normal',
      disabled: 'disabled',
    };

    const stateKey = map[state];
    
    if (color && color !== 'primary') {
      if (color !== 'white') {
        return `var(--interactive-${element}-${color}-${stateKey})`;
      }
      return `var(--interactive-${element}-static-white-${stateKey})`;
    }
    return `var(--interactive-${element}-primary-${stateKey})`;
  }

  // Reactive values based on currentInteraction - must use $derived to be reactive
  const hasTextDecoration = $derived(!isButton && currentInteraction !== 'default');
  const iconColor = $derived(getColorToken('icon'));
  const textColor = $derived(getColorToken('text'));
  const defaultRel = target && target === '_blank' ? 'noreferrer noopener' : undefined;

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

  const textClass = cva('base-link__text', {
    variants: {
      size: {
        xsmall: 'base-link__text--xsmall',
        small: 'base-link__text--small',
        medium: 'base-link__text--medium',
        large: 'base-link__text--large',
      },
      decoration: {
        underline: 'base-link--text--underline',
        none: '',
      },
    },
    defaultVariants: {
      size: 'medium',
      decoration: 'none',
    },
  });

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
    if (onClick && !disabled) {
      onClick(event);
    }
  }

  function handleFocus(event: FocusEvent): void {
    if (!disabled) {
      handleFocusInteraction();
    }
    onFocus?.(event);
  }

  function handleBlur(event: FocusEvent): void {
    if (!disabled) {
      handleBlurInteraction();
    }
    onBlur?.(event);
  }

  function handleMouseEnter(): void {
    if (!disabled) {
      handleMouseEnterInteraction();
    }
  }

  function handleMouseLeave(event: MouseEvent): void {
    if (!disabled) {
      handleMouseLeaveInteraction();
    }
    onMouseLeave?.(event);
  }

  const elementTag = $derived(isButton ? 'button' : 'a');

</script>

<svelte:element
  this={elementTag}
  class={linkClass({
    variant,
    color,
    size,
    disabled,
  })}
  style="--icon-color: {iconColor}; --text-color: {textColor};"
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
  type={isButton ? 'button' : undefined}
  disabled={isButton ? disabled : undefined}
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
     <!-- TODO: Move this to Text Component once we have typegraphy in place -->
      <span
        class={textClass({
          size,
          decoration: hasTextDecoration ? 'underline' : 'none',
        })}
        style="color: {textColor};"
      >
        {@render children()}
      </span>
    {/if}
    {#if Icon && iconPosition === 'right'}
      <!-- <span class={iconClass({ position: 'right', hasChildren })}> -->
        <!-- TODO: Render Icon component when available -->
      <!-- </span> -->
    {/if}
  </span>
</svelte:element>

