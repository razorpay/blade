# Example: Card Component

> ⚠️ **IMPORTANT: This is a hypothetical example**
>
> Card has **not been migrated yet**. This example shows how Card *would* be implemented following Blade patterns.
>
> **For real, production examples of migrated components, see:**
> - [Button-example.md](Button-example.md) - ✅ Actually migrated, production-ready
>
> Use this as a reference for planning future migrations, but always refer to actually migrated components for accurate patterns.

This is a complete example of implementing a Card component following the blade-svelte patterns.

## Directory Structure

```
Card/
├── Card.svelte
├── Card.stories.svelte
├── BaseCard/
│   ├── BaseCard.svelte
│   ├── index.ts
│   └── types.ts
├── index.ts
└── types.ts
```

## CSS Implementation in blade-core (REQUIRED FIRST)

Before implementing the Svelte component, create the CSS in blade-core:

### File: packages/blade-core/src/styles/Card/card.module.css

```css
.base {
  border-radius: var(--border-radius-large);
  background-color: var(--colors-surface-background-level1-normal);
  transition: all 0.2s ease;
  overflow: hidden;
}

/* Elevation variants */
.elevationNone {
  box-shadow: none;
}

.elevationLow {
  box-shadow: var(--elevation-lowRaised);
}

.elevationMedium {
  box-shadow: var(--elevation-midRaised);
}

.elevationHigh {
  box-shadow: var(--elevation-highRaised);
}

/* Padding variants */
.paddingNone {
  padding: 0;
}

.paddingSmall {
  padding: var(--spacing-4);
}

.paddingMedium {
  padding: var(--spacing-6);
}

.paddingLarge {
  padding: var(--spacing-8);
}

/* Background color variants */
.backgroundSurface {
  background-color: var(--colors-surface-background-level1-normal);
}

.backgroundBackground {
  background-color: var(--colors-surface-background-level2-normal);
}

.backgroundOverlay {
  background-color: var(--colors-overlay-background-normal);
}

/* Interactive state */
.interactive {
  cursor: pointer;

  &:hover {
    box-shadow: var(--elevation-highRaised);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus {
    outline: 2px solid var(--colors-interactive-border-primary-normal);
    outline-offset: 2px;
  }
}

/* Template classes */
.container {
  width: 100%;
  height: 100%;
}
```

### File: packages/blade-core/src/styles/Card/card.ts

```typescript
import { cva } from 'class-variance-authority';
import styles from './card.module.css';
import type { ActionStatesType } from '../types';

export const getCardClasses = cva(styles.base, {
  variants: {
    elevation: {
      none: styles.elevationNone,
      low: styles.elevationLow,
      medium: styles.elevationMedium,
      high: styles.elevationHigh,
    },
    padding: {
      none: styles.paddingNone,
      small: styles.paddingSmall,
      medium: styles.paddingMedium,
      large: styles.paddingLarge,
    },
    backgroundColor: {
      surface: styles.backgroundSurface,
      background: styles.backgroundBackground,
      overlay: styles.backgroundOverlay,
    },
    isInteractive: {
      true: styles.interactive,
      false: '',
    },
    state: {
      default: '',
      hover: '',
      focus: '',
      disabled: '',
    },
  },
  defaultVariants: {
    elevation: 'low',
    padding: 'medium',
    backgroundColor: 'surface',
    isInteractive: false,
    state: 'default',
  },
});

export const getCardTemplateClasses = () => ({
  container: styles.container,
});

export type { ActionStatesType as CardActionStatesType };
```

## File: BaseCard/types.ts

```typescript
import type { Snippet } from 'svelte';
import type {
  StyledPropsBlade,
  AccessibilityProps
} from '@razorpay/blade-core/utils';

export interface BaseCardProps extends StyledPropsBlade {
  /**
   * Content of the card
   */
  children?: Snippet | string;

  /**
   * Card elevation (shadow depth)
   * @default 'low'
   */
  elevation?: 'none' | 'low' | 'medium' | 'high';

  /**
   * Padding inside the card
   * @default 'medium'
   */
  padding?: 'none' | 'small' | 'medium' | 'large';

  /**
   * Background color variant
   * @default 'surface'
   */
  backgroundColor?: 'surface' | 'background' | 'overlay';

  /**
   * Whether the card is interactive (clickable/hoverable)
   * @default false
   */
  isInteractive?: boolean;

  /**
   * Click handler (only works when isInteractive is true)
   */
  onClick?: (event: MouseEvent) => void;

  /**
   * Accessibility properties
   */
  accessibilityProps?: AccessibilityProps;

  /**
   * Test ID for testing
   */
  testID?: string;

  /**
   * Element ID
   */
  id?: string;

  // Event handlers
  onFocus?: (event: FocusEvent) => void;
  onBlur?: (event: FocusEvent) => void;
  onMouseEnter?: (event: MouseEvent) => void;
  onMouseLeave?: (event: MouseEvent) => void;

  // Analytics attributes
  [key: `data-analytics-${string}`]: string;
}
```

## File: BaseCard/BaseCard.svelte

```svelte
<script lang="ts">
  import {
    makeAccessible,
    makeAnalyticsAttribute,
    metaAttribute,
    MetaConstants,
    getStyledPropsClasses,
    type AriaRoles
  } from '@razorpay/blade-core/utils';
  import { useInteraction } from '../../../utils/useInteraction';
  import type { BaseCardProps } from './types';
  import {
    getCardClasses,
    getCardTemplateClasses,
    type ActionStatesType as CardActionStatesType,
  } from '@razorpay/blade-core/styles';

  // Get template classes via function call to prevent Svelte tree-shaking
  const cardClasses = getCardTemplateClasses();

  let {
    children,
    elevation = 'low',
    padding = 'medium',
    backgroundColor = 'surface',
    isInteractive = false,
    onClick,
    id,
    accessibilityProps,
    testID,
    onFocus,
    onBlur,
    onMouseEnter,
    onMouseLeave,
    ...rest
  }: BaseCardProps = $props();

  // Validation
  $effect(() => {
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      if (onClick && !isInteractive) {
        console.warn(
          'BaseCard: onClick handler provided but isInteractive is false. Set isInteractive={true} to enable click handling.'
        );
      }
    }
  });

  // Determine element tag based on interactivity
  const elementTag = $derived(isInteractive ? 'button' : 'div');

  // Create interaction state using $state
  let currentInteraction = $state<CardActionStatesType>('default');

  // Use interaction hook for managing interaction states
  const {
    onMouseEnter: handleMouseEnterInteraction,
    onMouseLeave: handleMouseLeaveInteraction,
    onFocus: handleFocusInteraction,
    onBlur: handleBlurInteraction,
  } = useInteraction(
    () => currentInteraction,
    (state: CardActionStatesType) => {
      currentInteraction = state;
    },
  );

  // Generate Card classes from blade-core
  const baseCardClasses = $derived(
    getCardClasses({
      elevation,
      padding,
      backgroundColor,
      isInteractive,
      state: currentInteraction,
    }),
  );

  // Extract styled props
  const styledProps = $derived(getStyledPropsClasses(rest));

  // Combine classes for card element
  const combinedClasses = $derived(() => {
    const classes = [baseCardClasses];
    if (isInteractive) {
      classes.push('focus-ring-parent');
    }
    if (styledProps.classes) {
      classes.push(...styledProps.classes);
    }
    return classes.filter(Boolean).join(' ');
  });

  // Accessibility attributes
  const accessibilityAttrs = $derived(
    makeAccessible({
      role: isInteractive ? ('button' as AriaRoles) : undefined,
      label: accessibilityProps?.label,
      describedBy: accessibilityProps?.describedBy,
    }),
  );

  // Meta attributes
  const metaAttrs = metaAttribute({
    name: MetaConstants.Card,
    testID,
  });

  // Analytics attributes
  const analyticsAttrs = makeAnalyticsAttribute(rest);

  // Event handlers
  function handleClick(event: MouseEvent): void {
    if (onClick && isInteractive) {
      onClick(event);
    }
  }

  function handleFocus(event: FocusEvent): void {
    if (isInteractive) {
      handleFocusInteraction();
    }
    onFocus?.(event);
  }

  function handleBlur(event: FocusEvent): void {
    if (isInteractive) {
      handleBlurInteraction();
    }
    onBlur?.(event);
  }

  function handleMouseEnter(event: MouseEvent): void {
    if (isInteractive) {
      handleMouseEnterInteraction();
    }
    onMouseEnter?.(event);
  }

  function handleMouseLeave(event: MouseEvent): void {
    if (isInteractive) {
      handleMouseLeaveInteraction();
    }
    onMouseLeave?.(event);
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
  type={isInteractive ? 'button' : undefined}
>
  {#if typeof children === 'string'}
    {children}
  {:else if children && typeof children === 'function'}
    {@render children()}
  {/if}
</svelte:element>
```

## File: BaseCard/index.ts

```typescript
export { default as BaseCard } from './BaseCard.svelte';
export type { BaseCardProps } from './types';
```

## File: types.ts

```typescript
import type { Snippet } from 'svelte';
import type { StyledPropsBlade } from '@razorpay/blade-core/utils';
import type { BaseCardProps } from './BaseCard/types';

export type CardProps = BaseCardProps & {
  /**
   * Content of the card
   */
  children?: Snippet | string;

  /**
   * Card elevation (shadow depth)
   * @default 'low'
   */
  elevation?: 'none' | 'low' | 'medium' | 'high';

  /**
   * Padding inside the card
   * @default 'medium'
   */
  padding?: 'none' | 'small' | 'medium' | 'large';

  /**
   * Background color variant
   * @default 'surface'
   */
  backgroundColor?: 'surface' | 'background' | 'overlay';

  /**
   * Whether the card is interactive (clickable/hoverable)
   * @default false
   */
  isInteractive?: boolean;

  /**
   * Click handler
   */
  onClick?: (event: MouseEvent) => void;
} & StyledPropsBlade;
```

## File: index.ts

```typescript
/**
 * Card
 *
 * Cards are containers for grouping related content and actions.
 *
 * ----
 *
 * #### Usage
 *
 * ```svelte
 * <script>
 *   import { Card } from '@razorpay/blade-svelte/components';
 * </script>
 *
 * <Card elevation="medium" padding="large">
 *   Card Content
 * </Card>
 * ```
 *
 * ----
 *
 * Checkout {@link https://blade.razorpay.com/?path=/docs/components-card Card Documentation}
 */
export { default as Card } from './Card.svelte';
export type { CardProps } from './types';
export { BaseCard } from './BaseCard';
export type { BaseCardProps } from './BaseCard';
```

## File: Card.svelte

```svelte
<script lang="ts">
  import BaseCard from './BaseCard/BaseCard.svelte';
  import type { CardProps } from './types';
  import { makeAnalyticsAttribute } from '@razorpay/blade-core/utils';

  let {
    children,
    elevation = 'low',
    padding = 'medium',
    backgroundColor = 'surface',
    isInteractive = false,
    onClick,
    testID,
    onFocus,
    onBlur,
    onMouseEnter,
    onMouseLeave,
    ...rest
  }: CardProps = $props();

  // Extract analytics attributes
  const analyticsAttrs = makeAnalyticsAttribute(rest);

  // Build accessibility props
  const accessibilityProps = $derived({
    label: rest['aria-label'],
    describedBy: rest['aria-describedby'],
  });
</script>

<BaseCard
  {children}
  {elevation}
  {padding}
  {backgroundColor}
  {isInteractive}
  {onClick}
  {testID}
  {onFocus}
  {onBlur}
  {onMouseEnter}
  {onMouseLeave}
  {accessibilityProps}
  {...rest}
  {...analyticsAttrs}
/>
```

## File: Card.stories.svelte

```svelte
<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Card from './Card.svelte';
  import Text from '../Typography/Text/Text.svelte';
  import Heading from '../Typography/Heading/Heading.svelte';

  const { Story } = defineMeta({
    title: 'Components/Card',
    component: Card,
    tags: ['autodocs'],
    args: {
      elevation: 'low',
      padding: 'medium',
      backgroundColor: 'surface',
      isInteractive: false,
    },
    argTypes: {
      elevation: {
        control: { type: 'select' },
        options: ['none', 'low', 'medium', 'high'],
        description: 'Shadow depth of the card',
      },
      padding: {
        control: { type: 'select' },
        options: ['none', 'small', 'medium', 'large'],
        description: 'Internal padding',
      },
      backgroundColor: {
        control: { type: 'select' },
        options: ['surface', 'background', 'overlay'],
        description: 'Background color variant',
      },
      isInteractive: {
        control: { type: 'boolean' },
        description: 'Whether card is clickable/hoverable',
      },
    },
  });
</script>

<Story name="Playground">
  {#snippet default(args)}
    <Card {...args}>
      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        <Heading size="medium">Card Title</Heading>
        <Text>This is example card content. Cards can contain any content.</Text>
      </div>
    </Card>
  {/snippet}
</Story>

<Story name="Basic">
  <Card>
    <div style="padding: 1rem;">
      <Heading size="small">Simple Card</Heading>
      <Text>Basic card with default settings</Text>
    </div>
  </Card>
</Story>

<Story name="Elevations">
  <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
    <Card elevation="none">
      <Text>None</Text>
    </Card>
    <Card elevation="low">
      <Text>Low</Text>
    </Card>
    <Card elevation="medium">
      <Text>Medium</Text>
    </Card>
    <Card elevation="high">
      <Text>High</Text>
    </Card>
  </div>
</Story>

<Story name="Padding Variants">
  <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
    <Card padding="none">
      <div style="background: rgba(255,0,0,0.1);">
        <Text>None</Text>
      </div>
    </Card>
    <Card padding="small">
      <div style="background: rgba(255,0,0,0.1);">
        <Text>Small</Text>
      </div>
    </Card>
    <Card padding="medium">
      <div style="background: rgba(255,0,0,0.1);">
        <Text>Medium</Text>
      </div>
    </Card>
    <Card padding="large">
      <div style="background: rgba(255,0,0,0.1);">
        <Text>Large</Text>
      </div>
    </Card>
  </div>
</Story>

<Story name="Interactive">
  <Card
    isInteractive
    onClick={(e) => console.log('Card clicked!', e)}
  >
    <div style="padding: 1rem;">
      <Heading size="small">Clickable Card</Heading>
      <Text>Hover or click me!</Text>
    </div>
  </Card>
</Story>

<Story name="Background Variants">
  <div style="display: flex; flex-direction: column; gap: 1rem;">
    <Card backgroundColor="surface">
      <Text>Surface Background</Text>
    </Card>
    <Card backgroundColor="background">
      <Text>Background Background</Text>
    </Card>
    <Card backgroundColor="overlay">
      <Text>Overlay Background</Text>
    </Card>
  </div>
</Story>
```

## Update: src/components/index.ts

Add these exports:

```typescript
// Card
export { default as Card } from './Card/Card.svelte';
export { default as BaseCard } from './Card/BaseCard/BaseCard.svelte';
```

## Key Patterns Demonstrated

1. ✅ **Two-layer architecture**: Separate Base and Public components
2. ✅ **CVA Pattern**: CSS modules in blade-core with Class Variance Authority
3. ✅ **Conditional interactivity**: `elementTag` changes based on `isInteractive`
4. ✅ **Interaction states**: Only manage states when `isInteractive` is true
5. ✅ **Validation**: Warns if onClick is provided without isInteractive
6. ✅ **Snippets**: Supports both string and Snippet children
7. ✅ **Classes from blade-core**: Uses `getCardClasses()` and CVA pattern
8. ✅ **Styled props**: Properly extracts and applies styled props
9. ✅ **Accessibility**: Proper role and ARIA attributes
10. ✅ **Analytics**: Extracts analytics attributes in wrapper
11. ✅ **Component JSDoc**: Usage example in index.ts export
12. ✅ **Storybook**: Comprehensive stories showing all variants

## Important Notes

### CSS Architecture
This example demonstrates the complete CSS architecture pattern:
- All CSS is in `blade-core/src/styles/Card/` (NOT in blade-svelte)
- CVA (Class Variance Authority) for conditional classes
- CSS modules with `.module.css` extension
- Design tokens via CSS variables (`var(--spacing-4)`, etc.)

### Inline Styles in Stories
The Storybook stories use inline styles for layout purposes:
```svelte
<div style="display: flex; flex-direction: column; gap: 0.5rem;">
```

**Note:** While inline styles are generally discouraged in component implementation, they are **acceptable in Storybook stories** for demonstration and layout purposes only. Production component code should never use inline styles - always use classes from blade-core.
