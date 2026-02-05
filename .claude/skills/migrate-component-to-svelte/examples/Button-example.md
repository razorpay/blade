# Example: Button Component (Production Code)

> ✅ **This is a REAL, migrated component**
>
> Button has been successfully migrated to Svelte. This example shows the **actual production code** from the blade-svelte package.
>
> Use this as the primary reference when migrating new components.

This is the complete, production-ready implementation of the Button component following all blade-svelte patterns.

## Directory Structure

```
Button/
├── Button.svelte                    # Public wrapper
├── Button.stories.svelte             # Storybook stories
├── BaseButton/
│   ├── BaseButton.svelte             # Core implementation
│   ├── index.ts                      # Base exports
│   └── types.ts                      # Base types
├── index.ts                          # Public exports
└── types.ts                          # Public types
```

## CSS Implementation in blade-core (REQUIRED FIRST)

Before implementing the Svelte component, CSS was created in blade-core:

### File: packages/blade-core/src/styles/Button/button.module.css

```css
/* Button Base Styles */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border: none;
  outline: none;
  text-decoration: none;
  overflow: hidden;
  border-radius: var(--border-radius-medium);
  border-style: solid;
  transition-property: background-color, border-color, box-shadow, transform;
  transition-timing-function: var(--easing-standard);
  transition-duration: var(--duration-xquick);
  font-family: var(--font-family-text);
  font-weight: var(--font-weight-medium);
  text-align: center;
  cursor: pointer;
  user-select: none;

  &[disabled] {
    cursor: not-allowed;
  }

  &:focus-visible:not([disabled]) {
    outline: 1px solid var(--surface-background-primary-subtle);
    box-shadow: 0px 0px 0px 4px var(--surface-border-primary-muted);
  }
}

/* Variants */
.primary {
  border-width: 0;
}

.secondary {
  border-width: var(--border-width-thin);
}

.tertiary {
  border-width: 0;
}

/* Sizes */
.xsmall {
  min-height: 28px;
  padding-left: var(--spacing-3);
  padding-right: var(--spacing-3);
  padding-top: 0;
  padding-bottom: 0;
}

.small {
  min-height: 32px;
  padding-left: var(--spacing-4);
  padding-right: var(--spacing-4);
  padding-top: 0;
  padding-bottom: 0;
}

.medium {
  min-height: 36px;
  padding-left: var(--spacing-6);
  padding-right: var(--spacing-6);
  padding-top: 0;
  padding-bottom: 0;
}

.large {
  min-height: 48px;
  padding-left: var(--spacing-6);
  padding-right: var(--spacing-6);
  padding-top: 0;
  padding-bottom: 0;
}

/* Icon-only buttons */
.icon-only {
  padding: 0;
  width: auto;
  height: auto;

  &.xsmall {
    width: 28px;
    height: 28px;
  }

  &.small {
    width: 32px;
    height: 32px;
  }

  &.medium {
    width: 36px;
    height: 36px;
  }

  &.large {
    width: 48px;
    height: 48px;
  }
}

/* Full width */
.full-width {
  width: 100%;
}

/* Template classes */
.animated-content {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform var(--duration-xquick) var(--easing-standard);
}

.pressed {
  transform: scale(0.97);
}

.content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
}

.loading {
  opacity: 0;
  pointer-events: none;
}

.loading-spinner {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon {
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### File: packages/blade-core/src/styles/Button/button.ts

```typescript
import { cva } from 'class-variance-authority';
// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './button.module.css';

export type ButtonVariants = {
  variant?: 'primary' | 'secondary' | 'tertiary';
  color?: 'primary' | 'white' | 'positive' | 'negative' | 'transparent';
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  isDisabled?: boolean;
  isFullWidth?: boolean;
  isIconOnly?: boolean;
};

export type ActionStatesType = 'default' | 'hover' | 'focus' | 'disabled';

export const getButtonClasses = cva(styles.btn, {
  variants: {
    variant: {
      primary: styles.primary,
      secondary: styles.secondary,
      tertiary: styles.tertiary,
    },
    size: {
      xsmall: styles.xsmall,
      small: styles.small,
      medium: styles.medium,
      large: styles.large,
    },
    isFullWidth: {
      true: styles.fullWidth,
      false: '',
    },
    isIconOnly: {
      true: styles.iconOnly,
      false: '',
    },
    isDisabled: {
      true: '',
      false: '',
    },
  },
  compoundVariants: [
    // Add color-specific classes dynamically via getButtonBackgroundColorToken
  ],
  defaultVariants: {
    variant: 'primary',
    size: 'medium',
    isFullWidth: false,
    isIconOnly: false,
    isDisabled: false,
  },
});

export const getButtonTemplateClasses = () => ({
  animatedContent: styles.animatedContent,
  pressed: styles.pressed,
  content: styles.content,
  loading: styles.loading,
  loadingSpinner: styles.loadingSpinner,
  icon: styles.icon,
});

// Text color token getter (simplified for example)
export function getButtonTextColorToken({
  variant,
  color,
  state,
}: {
  variant: string;
  color: string;
  state: ActionStatesType;
  property: string;
}): string {
  // Implementation generates design token strings
  return `interactive.foreground.${color}.${state}`;
}

export const getButtonTextSizes = () => ({
  fontSize: {
    xsmall: '75',
    small: '75',
    medium: '100',
    large: '200',
  },
  lineHeight: {
    xsmall: '100',
    small: '100',
    medium: '100',
    large: '100',
  },
});

export const getButtonSpinnerSize = () => ({
  xsmall: 'small',
  small: 'small',
  medium: 'medium',
  large: 'medium',
});
```

## File: BaseButton/types.ts

```typescript
import type { Snippet } from 'svelte';
import type { StyledPropsBlade } from '@razorpay/blade-core/utils';

// Icon component type - placeholder for now
export type IconComponent = unknown;

export interface BaseButtonProps extends StyledPropsBlade {
  /**
   * Content of the button
   *
   * Supports both string content and Svelte snippets
   */
  children?: Snippet | string;

  /**
   * Icon to display in the button
   *
   * Accepts an icon component from Blade
   */
  icon?: IconComponent;

  /**
   * Position of the icon relative to the button text
   *
   * @default 'left'
   */
  iconPosition?: 'left' | 'right';

  /**
   * Button variant that defines the visual style
   *
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'tertiary';

  /**
   * Color theme of the button
   *
   * Note: Not all color and variant combinations are valid
   *
   * @default 'primary'
   */
  color?: 'primary' | 'white' | 'positive' | 'negative' | 'transparent';

  /**
   * Size of the button
   *
   * @default 'medium'
   */
  size?: 'xsmall' | 'small' | 'medium' | 'large';

  /**
   * Whether the button is disabled
   *
   * When disabled, user interactions are prevented
   *
   * @default false
   */
  isDisabled?: boolean;

  /**
   * Whether the button should take the full width of its container
   *
   * @default false
   */
  isFullWidth?: boolean;

  /**
   * Whether the button is in a loading state
   *
   * Shows spinner and prevents interaction
   *
   * @default false
   */
  isLoading?: boolean;

  /**
   * URL to navigate to
   *
   * When provided, button renders as an anchor tag
   */
  href?: string;

  /**
   * Target for link navigation
   */
  target?: string;

  /**
   * Rel attribute for link navigation
   */
  rel?: string;

  /**
   * Button type for form submission
   *
   * @default 'button'
   */
  type?: 'button' | 'reset' | 'submit';

  /**
   * Element ID
   */
  id?: string;

  /**
   * Tab index for keyboard navigation
   */
  tabIndex?: number;

  /**
   * Accessibility properties for screen readers
   */
  accessibilityProps?: {
    label?: string;
    describedBy?: string;
    expanded?: boolean;
    hasPopup?: 'menu';
    role?: string;
  };

  /**
   * Test ID for automated testing
   *
   * Used to identify component in test suites
   */
  testID?: string;

  // Event handlers
  /**
   * Click event handler
   *
   * Called when button is clicked (only if not disabled)
   */
  onClick?: (event: MouseEvent) => void;

  /**
   * Blur event handler
   */
  onBlur?: (event: FocusEvent) => void;

  /**
   * Focus event handler
   */
  onFocus?: (event: FocusEvent) => void;

  /**
   * Mouse leave event handler
   */
  onMouseLeave?: (event: MouseEvent) => void;

  /**
   * Mouse move event handler
   */
  onMouseMove?: (event: MouseEvent) => void;

  /**
   * Mouse down event handler
   */
  onMouseDown?: (event: MouseEvent) => void;

  /**
   * Mouse up event handler
   */
  onMouseUp?: (event: MouseEvent) => void;

  /**
   * Pointer down event handler
   */
  onPointerDown?: (event: PointerEvent) => void;

  /**
   * Pointer enter event handler
   */
  onPointerEnter?: (event: PointerEvent) => void;

  /**
   * Touch start event handler
   */
  onTouchStart?: (event: TouchEvent) => void;

  /**
   * Touch end event handler
   */
  onTouchEnd?: (event: TouchEvent) => void;

  /**
   * Key down event handler
   */
  onKeyDown?: (event: KeyboardEvent) => void;

  // Analytics attributes
  /**
   * Analytics tracking attributes
   *
   * Use data-analytics-* props for tracking button interactions
   */
  [key: `data-analytics-${string}`]: string;
}
```

## File: BaseButton/BaseButton.svelte

```svelte
<script lang="ts">
  import {
    makeAccessible,
    makeAnalyticsAttribute,
    metaAttribute,
    MetaConstants,
    getStyledPropsClasses,
    type AriaRoles,
  } from '@razorpay/blade-core/utils';
  import { useInteraction } from '../../../utils/useInteraction';
  import BaseText from '../../Typography/BaseText/BaseText.svelte';
  import BaseSpinner from '../../Spinner/BaseSpinner/BaseSpinner.svelte';
  import type { BaseButtonProps } from './types';
  import type { TextColors } from '../../Typography/BaseText/types';
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
  let currentInteraction = $state<ButtonActionStatesType>(disabled ? 'disabled' : 'default');

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
  const childrenString = $derived(typeof children === 'string' ? children : undefined);

  // Check if icon-only button
  const isIconOnly = $derived(
    Boolean(Icon) && (!childrenString || childrenString.trim().length === 0),
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

  // Get text sizes
  const fontSize = $derived(textSizes.fontSize[size]);
  const lineHeight = $derived(textSizes.lineHeight[size]);

  // Get spinner size based on button size
  const spinnerSizeMap = getButtonSpinnerSize();
  const spinnerSize = $derived(spinnerSizeMap[size]);

  // Get spinner color
  const spinnerColor = $derived.by((): SpinnerColor => {
    if (color === 'transparent') {
      return 'primary';
    }
    return color as SpinnerColor;
  });

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
  const { elementTag, elementType, disabled: isButtonDisabled, role: buttonRole, defaultRel } = $derived(buttonProps);

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
    const classes = [buttonClasses.animatedContent, isPressed ? buttonClasses.pressed : ''];
    return classes.filter(Boolean).join(' ');
  });

  // Accessibility attributes
  const accessibilityAttrs = $derived(
    makeAccessible({
      role: (accessibilityProps?.role ?? buttonRole) as AriaRoles,
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
        <BaseSpinner size={spinnerSize} color={spinnerColor} accessibilityLabel="Loading" />
      </div>
    {/if}
    <span
      class={buttonClasses.content + (isLoading ? ' ' + buttonClasses.loading : '') + ' focus-ring-child'}
    >
      {#if Icon && iconPosition === 'left'}
        <span class={buttonClasses.icon}>
          <!-- TODO: Render Icon component when available -->
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
        </span>
      {/if}
    </span>
  </div>
</svelte:element>
```

## File: BaseButton/index.ts

```typescript
export { default as BaseButton } from './BaseButton.svelte';
export type { BaseButtonProps } from './types';
```

## File: types.ts

```typescript
import type { Snippet } from 'svelte';
import type { StyledPropsBlade } from '@razorpay/blade-core/utils';
import type { BaseButtonProps } from './BaseButton/types';

export type ButtonProps = BaseButtonProps & {
  /**
   * The content of the button
   */
  children?: Snippet | string;

  /**
   * Icon to display in the button
   *
   * Accepts an icon component from Blade
   */
  icon?: BaseButtonProps['icon'];

  /**
   * Position of the icon relative to the button text
   *
   * @default 'left'
   */
  iconPosition?: 'left' | 'right';

  /**
   * Button variant that defines the visual style
   *
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'tertiary';

  /**
   * Color theme of the button
   *
   * Note: Not all color and variant combinations are valid
   *
   * @default 'primary'
   */
  color?: 'primary' | 'white' | 'positive' | 'negative';

  /**
   * Size of the button
   *
   * @default 'medium'
   */
  size?: 'xsmall' | 'small' | 'medium' | 'large';

  /**
   * Whether the button is disabled
   *
   * @default false
   */
  isDisabled?: boolean;

  /**
   * Whether the button should take the full width of its container
   *
   * @default false
   */
  isFullWidth?: boolean;

  /**
   * Whether the button is in a loading state
   *
   * @default false
   */
  isLoading?: boolean;

  /**
   * The accessible label for the button
   *
   * Required for icon-only buttons
   */
  accessibilityLabel?: string;

  /**
   * Function called when the button is clicked
   */
  onClick?: (event: MouseEvent) => void;

  /**
   * Accessibility role for the button
   */
  role?: string;

  /**
   * aria-describedby attribute
   */
  'aria-describedby'?: string;

  /**
   * aria-expanded attribute
   */
  'aria-expanded'?: boolean;

  /**
   * aria-haspopup attribute
   */
  'aria-haspopup'?: 'menu' | boolean;
} & StyledPropsBlade;
```

## File: Button.svelte

```svelte
<script lang="ts">
  import BaseButton from './BaseButton/BaseButton.svelte';
  import type { ButtonProps } from './types';
  import { makeAnalyticsAttribute } from '@razorpay/blade-core/utils';

  let {
    children,
    icon,
    iconPosition = 'left',
    isDisabled = false,
    isFullWidth = false,
    isLoading = false,
    href,
    target,
    rel,
    onClick,
    size = 'medium',
    type = 'button',
    variant = 'primary',
    color = 'primary',
    accessibilityLabel,
    role,
    testID,
    onBlur,
    onFocus,
    onMouseLeave,
    onMouseMove,
    onMouseDown,
    onPointerDown,
    onPointerEnter,
    onTouchStart,
    onTouchEnd,
    ...rest
  }: ButtonProps = $props();

  // Extract analytics attributes
  const analyticsAttrs = makeAnalyticsAttribute(rest);

  // Build accessibility props
  const accessibilityProps = $derived({
    label: accessibilityLabel,
    describedBy: rest['aria-describedby'],
    expanded: rest['aria-expanded'],
    hasPopup: rest['aria-haspopup'],
    role,
  });
</script>

<BaseButton
  {...(icon ? { icon, children } : { children })}
  {...rest}
  {...analyticsAttrs}
  {href}
  {target}
  {rel}
  {accessibilityProps}
  {iconPosition}
  {color}
  {isDisabled}
  {isFullWidth}
  {onClick}
  {size}
  {type}
  {variant}
  {isLoading}
  {testID}
  {onBlur}
  {onFocus}
  {onMouseLeave}
  {onMouseMove}
  {onMouseDown}
  {onPointerDown}
  {onPointerEnter}
  {onTouchStart}
  {onTouchEnd}
/>
```

## File: index.ts

```typescript
/**
 * Button
 *
 * Buttons allow users to take actions and make choices with a single tap.
 *
 * ----
 *
 * #### Usage
 *
 * ```svelte
 * <script>
 *   import { Button } from '@razorpay/blade-svelte/components';
 * </script>
 *
 * <Button variant="primary" onClick={() => console.log('clicked')}>
 *   Click Me
 * </Button>
 * ```
 *
 * ----
 *
 * Checkout {@link https://blade.razorpay.com/?path=/docs/components-button Button Documentation}
 */
export { default as Button } from './Button.svelte';
export type { ButtonProps } from './types';
export { BaseButton } from './BaseButton';
export type { BaseButtonProps } from './BaseButton';
```

## Update: src/components/index.ts

Add these exports:

```typescript
// Button
export { default as Button } from './Button/Button.svelte';
export { default as BaseButton } from './Button/BaseButton/BaseButton.svelte';
```

## Key Patterns Demonstrated

1. ✅ **Two-layer architecture**: Separate Base and Public components
2. ✅ **CVA Pattern**: CSS modules in blade-core with Class Variance Authority
3. ✅ **Dynamic element**: `<svelte:element this={elementTag}>` for button vs anchor
4. ✅ **Interaction states**: Complete state machine (default, hover, focus, disabled)
5. ✅ **Press animation**: Visual feedback with scale transform
6. ✅ **Loading state**: Spinner overlay with opacity transition
7. ✅ **Icon support**: Placeholder for future Icon component
8. ✅ **Validation**: Development-only console warnings
9. ✅ **Snippets**: Supports both string and Snippet children
10. ✅ **Classes from blade-core**: Uses `getButtonClasses()` and CVA pattern
11. ✅ **Styled props**: Properly extracts and applies styled props
12. ✅ **Accessibility**: Comprehensive ARIA attributes and keyboard support
13. ✅ **Analytics**: Extracts analytics attributes in wrapper
14. ✅ **Component JSDoc**: Usage example in index.ts export
15. ✅ **All event handlers**: Complete event coverage with disabled checks
16. ✅ **Composition**: Uses BaseText and BaseSpinner components

## Advanced Patterns Shown

### 1. Dynamic Element Type
```typescript
const isLink = $derived(Boolean(href));
const isButton = $derived(!isLink);
const elementTag = $derived(isLink ? 'a' : 'button');
```

### 2. Press State Animation
```typescript
let isPressed = $state(false);

function handleMouseDown(event: MouseEvent): void {
  if (!isButtonDisabled) {
    isPressed = true;
  }
  onMouseDown?.(event);
}
```

### 3. Loading Overlay
```svelte
{#if isLoading}
  <div class={buttonClasses.loadingSpinner}>
    <BaseSpinner size={spinnerSize} color={spinnerColor} />
  </div>
{/if}
```

### 4. Text Color from State
```typescript
const textColorToken = $derived.by((): TextColors => {
  return getButtonTextColorToken({
    variant,
    color,
    state: currentInteraction,
    property: 'text',
  }) as TextColors;
});
```

### 5. Keyboard Event Handling
```typescript
function handleKeyDown(event: KeyboardEvent): void {
  if (!isButtonDisabled) {
    if (event.key === ' ' || event.key === 'Enter') {
      isPressed = true;
    }
  }
  onKeyDown?.(event);
}
```

## Important Notes

### Why This is the Best Reference

1. **Actually Migrated**: This is real, production code
2. **Complete Coverage**: Shows all patterns needed for complex components
3. **Well-Tested**: Already in use and validated
4. **Comprehensive**: Handles all edge cases (loading, disabled, link mode, press states)
5. **Follows All Guidelines**: Demonstrates every pattern from the skill

### CSS Architecture

This example demonstrates the complete CSS architecture:
- All CSS is in `blade-core/src/styles/Button/` (NOT in blade-svelte)
- CVA (Class Variance Authority) for conditional classes
- CSS modules with `.module.css` extension
- Design tokens via CSS variables (`var(--spacing-4)`, etc.)
- `[disabled]` attribute selector for disabled state
- SCSS nesting with `&` parent selector

### Component Composition

Button uses other Blade components:
- `BaseText` for text rendering with dynamic color
- `BaseSpinner` for loading state
- Both are composed as Svelte components, not imported as dependencies
