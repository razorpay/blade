# Quick Reference: Blade Svelte Component Patterns

## CVA & CSS Pattern (CRITICAL)

### CSS Module Structure

**Create in blade-core (NOT blade-svelte):**

```
packages/blade-core/src/styles/ComponentName/
├── componentname.module.css
└── componentname.ts
```

### CSS Module Example

```css
/* componentname.module.css */
.base {
  border-radius: var(--border-radius-medium);
  padding: var(--spacing-4);
  transition: all 0.2s ease;
}

.small {
  padding: var(--spacing-2);
  font-size: var(--font-size-75);
}

.primary {
  background: var(--colors-interactive-background-primary-normal);

  &:hover {
    background: var(--colors-interactive-background-primary-highlighted);
  }
}

/* Use [disabled] selector, not classes */
.base[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}
```

### CVA Wrapper Example

```typescript
// componentname.ts
import { cva } from 'class-variance-authority';
import styles from './componentname.module.css';

export const getComponentNameClasses = cva(styles.base, {
  variants: {
    size: {
      small: styles.small,
      medium: styles.medium,
    },
    variant: {
      primary: styles.primary,
      secondary: styles.secondary,
    },
  },
  defaultVariants: {
    size: 'medium',
    variant: 'primary',
  },
});

export const getComponentNameTemplateClasses = () => ({
  container: styles.container,
});
```

### Using CVA in Svelte

```svelte
<script lang="ts">
  import { getComponentNameClasses } from '@razorpay/blade-core/styles';

  let { variant = 'primary', size = 'medium', isDisabled = false } = $props();

  const classes = $derived(
    getComponentNameClasses({ variant, size })
  );
</script>

<button class={classes} disabled={isDisabled}>
  Content
</button>
```

## Essential Imports

### Base Component Imports
```typescript
import {
  makeAccessible,
  makeAnalyticsAttribute,
  metaAttribute,
  MetaConstants,
  getStyledPropsClasses,
  type AriaRoles,
  type AccessibilityProps,
  type StyledPropsBlade,
} from '@razorpay/blade-core/utils';

import { useInteraction } from '../../../utils/useInteraction';
import type { Snippet } from 'svelte';
```

### Public Component Imports
```typescript
import BaseComponentName from './BaseComponentName/BaseComponentName.svelte';
import type { ComponentNameProps } from './types';
import { makeAnalyticsAttribute } from '@razorpay/blade-core/utils';
```

## Svelte 5 Runes Cheat Sheet

```typescript
// State
let count = $state(0);
let items = $state([]);
let isActive = $state<boolean>(false);

// Derived (simple computation)
const doubled = $derived(count * 2);
const isDisabled = $derived(loading || disabled);

// Derived (complex computation)
const classes = $derived.by(() => {
  const result = [];
  if (isActive) result.push('active');
  if (isDisabled) result.push('disabled');
  return result.join(' ');
});

// Effects (side effects)
$effect(() => {
  if (isDisabled) {
    currentState = 'disabled';
  }
});

// Props
let { prop1, prop2 = 'default', ...rest }: Props = $props();
```

## Class Generation Pattern

```typescript
import {
  getComponentClasses,
  getComponentTemplateClasses,
} from '@razorpay/blade-core/styles';

// ALWAYS call template classes via function to prevent tree-shaking
const templateClasses = getComponentTemplateClasses();

// Generate component classes reactively
const baseClasses = $derived(
  getComponentClasses({
    variant,
    size,
    isDisabled,
    // ... other props
  })
);

// Get styled props classes
const styledProps = $derived(getStyledPropsClasses(rest));

// Combine all classes
const combinedClasses = $derived(() => {
  const classes = [baseClasses, 'focus-ring-parent'];
  if (styledProps.classes) {
    classes.push(...styledProps.classes);
  }
  return classes.filter(Boolean).join(' ');
});
```

## Interaction State Pattern

```typescript
import { useInteraction } from '../../../utils/useInteraction';
import type { ActionStatesType } from '@razorpay/blade-core/styles';

// Create state
let currentInteraction = $state<ActionStatesType>('default');

// Use interaction hook
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

// Update on disabled change
$effect(() => {
  if (isDisabled) {
    currentInteraction = 'disabled';
  } else if (currentInteraction === 'disabled') {
    currentInteraction = 'default';
  }
});

// Event handlers
function handleMouseEnter(event: MouseEvent): void {
  if (!isDisabled) {
    handleMouseEnterInteraction();
  }
  onMouseEnter?.(event);
}
```

## Accessibility Pattern

```typescript
const accessibilityAttrs = $derived(
  makeAccessible({
    role: 'button' as AriaRoles,
    disabled: isDisabled,
    label: accessibilityProps?.label,
    describedBy: accessibilityProps?.describedBy,
    expanded: accessibilityProps?.expanded,
    hasPopup: accessibilityProps?.hasPopup,
  })
);

const metaAttrs = metaAttribute({
  name: MetaConstants.ComponentName,
  testID,
});

const analyticsAttrs = makeAnalyticsAttribute(rest);
```

## Event Handler Pattern

```typescript
// Click handler with disabled check
function handleClick(event: MouseEvent): void {
  if (onClick && !isDisabled) {
    onClick(event);
  }
}

// Focus handler with interaction and callback
function handleFocus(event: FocusEvent): void {
  if (!isDisabled) {
    handleFocusInteraction();
  }
  onFocus?.(event);
}

// Press state handlers
function handleMouseDown(event: MouseEvent): void {
  if (!isDisabled) {
    isPressed = true;
  }
  onMouseDown?.(event);
}

function handleMouseUp(event: MouseEvent): void {
  if (!isDisabled) {
    isPressed = false;
  }
  onMouseUp?.(event);
}
```

## Template Patterns

### Dynamic Element
```svelte
<svelte:element
  this={elementTag}
  class={combinedClasses()}
  {...accessibilityAttrs}
  {...metaAttrs}
  {...analyticsAttrs}
  onclick={handleClick}
  onfocus={handleFocus}
  onblur={handleBlur}
  type={isButton ? type : undefined}
  disabled={isButton && isDisabled ? true : undefined}
>
  <!-- content -->
</svelte:element>
```

### Children Rendering
```svelte
{#if typeof children === 'string'}
  {children}
{:else if children && typeof children === 'function'}
  {@render children()}
{/if}
```

### Conditional Rendering
```svelte
{#if isLoading}
  <div class={templateClasses.loadingSpinner}>
    <BaseSpinner size={spinnerSize} color={spinnerColor} />
  </div>
{/if}
```

## JSDoc Pattern (REQUIRED)

### Props JSDoc
```typescript
export interface BaseComponentProps extends StyledPropsBlade {
  /**
   * Content of the component
   *
   * Supports both string content and Svelte snippets
   */
  children?: Snippet | string;

  /**
   * Visual variant of the component
   *
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary';

  /**
   * **Only applicable on mobile devices**
   *
   * Controls mobile-specific behavior
   *
   * @default false
   */
  isMobileOnly?: boolean;

  /**
   * Click handler
   *
   * Called when component is clicked (only if not disabled)
   */
  onClick?: (event: MouseEvent) => void;
}
```

### Component JSDoc
```typescript
/**
 * ComponentName
 *
 * Brief description of what the component does.
 *
 * ----
 *
 * #### Usage
 *
 * ```svelte
 * <script>
 *   import { ComponentName } from '@razorpay/blade-svelte/components';
 * </script>
 *
 * <ComponentName variant="primary">
 *   Content
 * </ComponentName>
 * ```
 *
 * ----
 *
 * Checkout {@link https://blade.razorpay.com/?path=/docs/components-componentname ComponentName Documentation}
 */
export { default as ComponentName } from './ComponentName.svelte';
```

## Type Definition Pattern

### Base Component Types
```typescript
import type { Snippet } from 'svelte';
import type {
  StyledPropsBlade,
  AccessibilityProps
} from '@razorpay/blade-core/utils';

export interface BaseComponentProps extends StyledPropsBlade {
  children?: Snippet | string;
  size?: 'small' | 'medium' | 'large';
  isDisabled?: boolean;
  onClick?: (event: MouseEvent) => void;
  onFocus?: (event: FocusEvent) => void;
  onBlur?: (event: FocusEvent) => void;
  onMouseEnter?: (event: MouseEvent) => void;
  onMouseLeave?: (event: MouseEvent) => void;
  accessibilityProps?: AccessibilityProps;
  testID?: string;
  id?: string;
  tabIndex?: number;
  [key: `data-analytics-${string}`]: string;
}
```

### Public Component Types
```typescript
import type { BaseComponentProps } from './BaseComponent/types';
import type { StyledPropsBlade } from '@razorpay/blade-core/utils';

export type ComponentProps = BaseComponentProps & {
  variant?: 'primary' | 'secondary';
  color?: 'primary' | 'white' | 'positive' | 'negative';
  // Public-only props
} & StyledPropsBlade;
```

## Export Pattern

### Base Component index.ts
```typescript
export { default as BaseComponent } from './BaseComponent.svelte';
export type { BaseComponentProps } from './types';
```

### Public Component index.ts
```typescript
export { default as Component } from './Component.svelte';
export type { ComponentProps } from './types';
export { BaseComponent } from './BaseComponent';
export type { BaseComponentProps } from './BaseComponent';
```

### Main components index.ts
```typescript
// Component
export { default as Component } from './Component/Component.svelte';
export { default as BaseComponent } from './Component/BaseComponent/BaseComponent.svelte';
```

## Storybook Story Pattern

```svelte
<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Component from './Component.svelte';

  const { Story } = defineMeta({
    title: 'Components/Component',
    component: Component,
    tags: ['autodocs'],
    args: {
      // Default args
      variant: 'primary',
      size: 'medium',
    },
    argTypes: {
      variant: {
        control: { type: 'select' },
        options: ['primary', 'secondary'],
        description: 'Component variant',
      },
      size: {
        control: { type: 'select' },
        options: ['small', 'medium', 'large'],
        description: 'Component size',
      },
    },
  });
</script>

<Story name="Playground" />

<Story name="Variants">
  <div style="display: flex; gap: 1rem;">
    <Component variant="primary">Primary</Component>
    <Component variant="secondary">Secondary</Component>
  </div>
</Story>
```

## Common Derived Values

```typescript
// Element type based on href
const isLink = $derived(Boolean(href));
const isButton = $derived(!isLink);
const elementTag = $derived(isLink ? 'a' : 'button');

// Disabled state
const isDisabled = $derived(loading || disabled);

// Icon-only check
const isIconOnly = $derived(
  Boolean(icon) && (!children || (typeof children === 'string' && children.trim().length === 0))
);

// Text color based on state
const textColor = $derived.by((): TextColors => {
  return getTextColorToken({
    variant,
    color,
    state: currentInteraction,
  }) as TextColors;
});
```

## MetaConstants Reference

Common component names used in `metaAttribute()`:

```typescript
MetaConstants.Button
MetaConstants.Text
MetaConstants.Heading
MetaConstants.Link
MetaConstants.Card
MetaConstants.Input
// ... etc
```

## Validation Pattern (Development Only)

```typescript
$effect(() => {
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    if (!icon && !children) {
      console.error('Component requires either icon or children');
    }
    if (onClick && !isInteractive) {
      console.warn('onClick provided but isInteractive is false');
    }
  }
});
```

## Common Gotchas

1. ❌ **DON'T** create CSS in blade-svelte
   ```
   // WRONG
   packages/blade-svelte/src/components/Button/button.css
   ```

   ✅ **DO** create CSS in blade-core
   ```
   // CORRECT
   packages/blade-core/src/styles/Button/button.module.css
   packages/blade-core/src/styles/Button/button.ts
   ```

2. ❌ **DON'T** use createEventDispatcher
   ```svelte
   <!-- WRONG -->
   <script>
     import { createEventDispatcher } from 'svelte';
     const dispatch = createEventDispatcher();
   </script>
   ```

   ✅ **DO** use prop-based callbacks
   ```svelte
   <!-- CORRECT -->
   <script lang="ts">
     let { onClick }: { onClick?: (e: MouseEvent) => void } = $props();
   </script>
   ```

3. ❌ **DON'T** create utilities in blade-svelte
   ```
   // WRONG
   packages/blade-svelte/src/utils/myUtil.ts
   ```

   ✅ **DO** create utilities in blade-core
   ```
   // CORRECT
   packages/blade-core/src/utils/myUtil/index.ts
   ```

4. ❌ **DON'T** add disabled classes dynamically
   ```css
   /* WRONG */
   .disabled {
     opacity: 0.6;
   }
   ```

   ✅ **DO** use [disabled] attribute selector
   ```css
   /* CORRECT */
   .base[disabled] {
     opacity: 0.6;
   }
   ```

5. ❌ **DON'T** forget JSDoc comments
   ```typescript
   // WRONG - No documentation
   export interface BaseButtonProps {
     variant?: 'primary' | 'secondary';
   }
   ```

   ✅ **DO** add JSDoc for all props
   ```typescript
   // CORRECT
   export interface BaseButtonProps {
     /**
      * Visual variant of the button
      * @default 'primary'
      */
     variant?: 'primary' | 'secondary';
   }
   ```

2. ❌ **DON'T** use inline styles
   ```svelte
   <!-- WRONG -->
   <div style="color: red;">Text</div>
   ```

   ✅ **DO** use blade-core classes
   ```svelte
   <!-- CORRECT -->
   <div class={getComponentClasses()}>Text</div>
   ```

2. ❌ **DON'T** forget to call template class functions
   ```typescript
   // WRONG - may get tree-shaken
   const classes = getButtonTemplateClasses;
   ```

   ✅ **DO** call the function immediately
   ```typescript
   // CORRECT
   const classes = getButtonTemplateClasses();
   ```

3. ❌ **DON'T** forget disabled checks in handlers
   ```typescript
   // WRONG
   function handleClick(event: MouseEvent): void {
     onClick(event);
   }
   ```

   ✅ **DO** check disabled state
   ```typescript
   // CORRECT
   function handleClick(event: MouseEvent): void {
     if (onClick && !isDisabled) {
       onClick(event);
     }
   }
   ```

4. ❌ **DON'T** use regular let for reactive values
   ```typescript
   // WRONG
   let doubled = count * 2;
   ```

   ✅ **DO** use $derived
   ```typescript
   // CORRECT
   const doubled = $derived(count * 2);
   ```

5. ❌ **DON'T** forget optional chaining for callbacks
   ```typescript
   // WRONG - will crash if onFocus is undefined
   onFocus(event);
   ```

   ✅ **DO** use optional chaining
   ```typescript
   // CORRECT
   onFocus?.(event);
   ```
