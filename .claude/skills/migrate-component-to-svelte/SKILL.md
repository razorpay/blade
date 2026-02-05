---
name: migrate-component-to-svelte
description: Migrate React components to Svelte in the blade-svelte package following Blade's two-layer architecture pattern with Base components, proper exports, Storybook stories, and type definitions
argument-hint: [ComponentName]
allowed-tools: Bash, Write, Read, Glob, Edit, TodoWrite, AskUserQuestion
---

# Migrate Component to Svelte

Create a new Svelte component in the blade-svelte package following the established two-layer component architecture pattern.

## Component Name

Component name: **$ARGUMENTS**

If no component name is provided via $ARGUMENTS, ask the user for the component name first.

## Migration Context: React to Svelte

**IMPORTANT:** Blade is migrating components from the React library (`packages/blade/`) to Svelte (`packages/blade-svelte/`).

### Step 0A: Examine Reference Svelte Components (REQUIRED)

**ALWAYS** start by examining existing migrated Svelte components to understand the established patterns:

1. **Read a Similar Svelte Component:**

   If migrating an **interactive component** (button-like, clickable):
   - Read `packages/blade-svelte/src/components/Button/Button.svelte`
   - Read `packages/blade-svelte/src/components/Button/BaseButton/BaseButton.svelte`
   - Read `packages/blade-svelte/src/components/Button/BaseButton/types.ts`

   If migrating a **display/text component**:
   - Read `packages/blade-svelte/src/components/Typography/Text/Text.svelte`
   - Read `packages/blade-svelte/src/components/Typography/BaseText/BaseText.svelte`

   If migrating a **link-like component**:
   - Read `packages/blade-svelte/src/components/Link/Link.svelte`
   - Read `packages/blade-svelte/src/components/Link/BaseLink/BaseLink.svelte`

   If migrating a **component with dependencies**:
   - Read `packages/blade-svelte/src/components/Amount/Amount.svelte`

2. **Understand the Patterns:**
   - How props are destructured with `$props()`
   - How classes are generated with `$derived()`
   - How interaction states are managed
   - How accessibility attributes are applied
   - How analytics attributes are extracted
   - How the public wrapper passes props to Base component

3. **Use as Template:**
   - Copy the structure from the most similar component
   - Adapt the prop types to match your component's React API
   - Follow the same naming conventions
   - Use the same utility functions

### Step 0B: Examine the React Component (REQUIRED)

Before implementing the Svelte version, **ALWAYS** check if the component exists in the React library:

1. **Locate React Component:**
   ```bash
   ls packages/blade/src/components/$ARGUMENTS/
   ```

2. **Read React Component Files:**
   - **Props/Types:** `packages/blade/src/components/$ARGUMENTS/types.ts` or `$ARGUMENTS.tsx`
   - **Implementation:** `packages/blade/src/components/$ARGUMENTS/$ARGUMENTS.tsx`
   - **Base Component:** `packages/blade/src/components/$ARGUMENTS/Base$ARGUMENTS/Base$ARGUMENTS.tsx`
   - **Stories (CRITICAL - Read Completely):** `packages/blade/src/components/$ARGUMENTS/$ARGUMENTS.stories.tsx`
     - **Read the ENTIRE stories file** to identify ALL exported stories
     - List each story name (e.g., Default, PrimaryButton, SecondaryButton, ButtonAsLink)
     - Document what each story demonstrates (e.g., "shows all sizes", "shows all colors with disabled states")
     - Note any complex story templates that show multiple variants
     - Identify story parameters and descriptions
     - **You MUST replicate ALL these stories in Svelte**
   - **Documentation:** `packages/blade/src/components/$ARGUMENTS/docs/`

3. **Extract React API:**
   - List all props and their types
   - Document default values
   - Identify variants/enums (variant, color, size, etc.)
   - Note required vs optional props
   - Check accessibility requirements
   - Review event handlers
   - Examine sub-components or variants (e.g., IconButton for Button)

4. **Analyze React Stories (REQUIRED):**
   - Create a comprehensive list of ALL stories from the React stories file
   - For each story, document:
     * Story name
     * What variants/props it demonstrates
     * Any special layout or structure
     * Story description/documentation
   - Plan how to replicate each story in Svelte
   - Identify any stories that need custom templates (showing all sizes, all colors, etc.)

4. **Maintain API Compatibility:**
   ✅ **DO:**
   - Keep identical prop names (isDisabled, isFullWidth, isLoading, etc.)
   - Keep identical enum values ('primary', 'secondary', 'xsmall', 'small', etc.)
   - Support same StyledPropsBlade props
   - Support same event handlers (onClick, onBlur, onFocus, etc.)
   - Support same accessibility attributes (aria-*, role, accessibilityLabel)
   - Support same variant/color combinations

   ❌ **DON'T:**
   - Change prop names or values
   - Remove props that exist in React
   - Change default values
   - Modify component behavior unless it's a bug fix

### React to Svelte Translation Guide

**React Pattern → Svelte Pattern:**

| React | Svelte |
|-------|--------|
| `useState()` | `$state()` |
| `useMemo()`, `useCallback()` | `$derived`, `$derived.by()` |
| `useEffect()` | `$effect()` |
| `React.ReactNode` | `Snippet \| string` |
| `children: ReactNode` | `children?: Snippet \| string` |
| `styled-components` | CSS classes from blade-core |
| `Platform.Select<{web: ..., native: ...}>` | Web-only types (MouseEvent, FocusEvent) |
| `React.MouseEvent<HTMLElement>` | `MouseEvent` |
| `GestureResponderEvent` (React Native) | Not applicable |

**Example Prop Migration:**

```typescript
// React (packages/blade/src/components/Button/types.ts)
type ButtonCommonProps = {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  isDisabled?: boolean;
  onClick?: Platform.Select<{
    native: (event: GestureResponderEvent) => void;
    web: (event: React.MouseEvent<HTMLButtonElement>) => void;
  }>;
}

// Svelte (packages/blade-svelte/src/components/Button/BaseButton/types.ts)
export interface BaseButtonProps extends StyledPropsBlade {
  children?: Snippet | string;
  variant?: 'primary' | 'secondary' | 'tertiary';  // ✅ Same values
  size?: 'xsmall' | 'small' | 'medium' | 'large';  // ✅ Same values
  isDisabled?: boolean;  // ✅ Same prop name
  onClick?: (event: MouseEvent) => void;  // ✅ Web-only, simpler type
}
```

## Pre-Implementation Questions

Before creating the component, gather the following information from the user using AskUserQuestion:

1. **Component Complexity**: Is this a simple component (like Button, Text) or a complex component (like Accordion)?
2. **Component Props**: What are the main props this component should accept apart from the common ones?
3. **Variants**: Does this component have multiple variants or styles (e.g., primary/secondary)?
4. **Interactive State**: Does it need interaction states (hover, focus, pressed, disabled)?
5. **Base Component Dependencies**: Does it use other Base components (BaseText, BaseSpinner, etc.)?

## Two-Layer Architecture Pattern

All Blade Svelte components follow a consistent two-layer pattern:

### Layer 1: Base Component (Implementation Layer)

- Contains all logic, state management, and interaction handling
- Uses Svelte 5 runes (`$state`, `$derived`, `$effect`)
- Handles accessibility via blade-core utilities
- Applies class-based styling from blade-core
- Located in: `BaseComponentName/BaseComponentName.svelte`

### Layer 2: Public Wrapper (API Layer)

- Thin wrapper around Base component
- Handles analytics attributes via `makeAnalyticsAttribute()`
- Passes props down to Base component
- Provides clean public API
- Located in: `ComponentName.svelte`

## Implementation Steps

Follow these steps in order:

### Step 1: Create Directory Structure

Create the following directory structure in `packages/blade-svelte/src/components/`:

```
ComponentName/
├── ComponentName.svelte              # Public wrapper component
├── ComponentName.stories.svelte       # Storybook stories
├── BaseComponentName/                 # Base implementation folder
│   ├── BaseComponentName.svelte       # Core implementation
│   ├── index.ts                       # Base component exports
│   └── types.ts                       # Base component type definitions
├── index.ts                           # Public exports
└── types.ts                           # Public type definitions
```

### Step 2: Define Type Definitions

**IMPORTANT: All types must have JSDoc comments!**

All exported props and components must have comprehensive JSDoc documentation following these patterns:

**Create `BaseComponentName/types.ts`:**

```typescript
import type { Snippet } from 'svelte';
import type { StyledPropsBlade, AccessibilityProps } from '@razorpay/blade-core/utils';

export interface BaseComponentNameProps extends StyledPropsBlade {
  /**
   * Content of the component
   *
   * Supports both string content and Svelte snippets for custom rendering
   */
  children?: Snippet | string;

  /**
   * Size variant of the component
   *
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Whether the component is disabled
   *
   * When disabled, user interactions are prevented and component appears in disabled state
   *
   * @default false
   */
  isDisabled?: boolean;

  /**
   * **Only applicable on mobile devices**
   *
   * Controls visibility behavior on mobile viewports
   *
   * @default false
   */
  isMobileOnly?: boolean;

  /**
   * Click handler
   *
   * Called when the component is clicked (only if not disabled)
   */
  onClick?: (event: MouseEvent) => void;

  /**
   * Accessibility properties for screen readers and assistive technologies
   */
  accessibilityProps?: AccessibilityProps;

  /**
   * Test ID for automated testing
   *
   * Used to identify component in test suites
   */
  testID?: string;

  // Event handlers
  /**
   * Focus event handler
   */
  onFocus?: (event: FocusEvent) => void;

  /**
   * Blur event handler
   */
  onBlur?: (event: FocusEvent) => void;

  /**
   * Mouse enter event handler
   */
  onMouseEnter?: (event: MouseEvent) => void;

  /**
   * Mouse leave event handler
   */
  onMouseLeave?: (event: MouseEvent) => void;

  // Analytics attributes
  /**
   * Analytics tracking attributes
   *
   * Use data-analytics-* props for tracking component interactions
   */
  [key: `data-analytics-${string}`]: string;
}
```

**JSDoc Best Practices:**
- ✅ Add description for every prop
- ✅ Use `@default` for optional props with default values
- ✅ Add context with additional paragraph if behavior is complex
- ✅ Mark platform-specific props with "Only applicable on X"
- ✅ Explain when handlers are called (e.g., "only if not disabled")
- ✅ Use consistent terminology across all components

**Create `BaseComponentName/index.ts`:**

```typescript
export { default as BaseComponentName } from './BaseComponentName.svelte';
export type { BaseComponentNameProps } from './types';
```

**Create `types.ts` (public types):**

```typescript
import type { Snippet } from 'svelte';
import type { StyledPropsBlade } from '@razorpay/blade-core/utils';
import type { BaseComponentNameProps } from './BaseComponentName/types';

export type ComponentNameProps = BaseComponentNameProps & {
  /**
   * Content of the component
   */
  children?: Snippet | string;

  /**
   * Variant style
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary';

  /**
   * Color theme
   * @default 'primary'
   */
  color?: 'primary' | 'white' | 'positive' | 'negative';

  // Add any public-only props here
} & StyledPropsBlade;
```

**Create `index.ts` (public exports):**

```typescript
export { default as ComponentName } from './ComponentName.svelte';
export type { ComponentNameProps } from './types';
export { BaseComponentName } from './BaseComponentName';
export type { BaseComponentNameProps } from './BaseComponentName';
```

### Step 3: Create Base Component Implementation

**Create `BaseComponentName/BaseComponentName.svelte`:**

**IMPORTANT: Use an existing Svelte component as a template!**

Before writing from scratch, copy a similar component and adapt it:
- For interactive components → Copy `BaseButton.svelte` structure
- For display components → Copy `BaseText.svelte` structure
- For link-like components → Copy `BaseLink.svelte` structure

Key patterns to follow:

1. **Import utilities from blade-core:**

```typescript
import {
  makeAccessible,
  makeAnalyticsAttribute,
  metaAttribute,
  MetaConstants,
  getStyledPropsClasses,
  type AriaRoles
} from '@razorpay/blade-core/utils';
```

2. **Use Svelte 5 runes for state management:**

```typescript
let currentInteraction = $state<'default' | 'hover' | 'focus' | 'disabled'>('default');
let isPressed = $state(false);

const computedValue = $derived(someCalculation(props));

const derivedValue = $derived.by(() => {
  return complexCalculation();
});

$effect(() => {
  // Side effects
});
```

3. **Use `useInteraction()` hook for interaction states:**

```typescript
import { useInteraction } from '../../../utils/useInteraction';

const {
  onMouseEnter: handleMouseEnterInteraction,
  onMouseLeave: handleMouseLeaveInteraction,
  onFocus: handleFocusInteraction,
  onBlur: handleBlurInteraction,
} = useInteraction(
  () => currentInteraction,
  (state) => {
    currentInteraction = state;
  },
);
```

4. **Generate classes from blade-core (NEVER inline styles):**

```typescript
import { getComponentClasses, getComponentTemplateClasses } from '@razorpay/blade-core/styles';

// Get template classes via function to prevent tree-shaking
const templateClasses = getComponentTemplateClasses();

const classes = $derived(
  getComponentClasses({
    variant,
    size,
    isDisabled,
    // ... other props
  }),
);

const styledProps = $derived(getStyledPropsClasses(rest));

const combinedClasses = $derived(() => {
  const classArray = [classes, 'focus-ring-parent'];
  if (styledProps.classes) {
    classArray.push(...styledProps.classes);
  }
  return classArray.filter(Boolean).join(' ');
});
```

5. **Apply accessibility attributes:**

```typescript
const accessibilityAttrs = $derived(
  makeAccessible({
    role: 'button' as AriaRoles,
    disabled: isDisabled,
    label: accessibilityProps?.label,
    describedBy: accessibilityProps?.describedBy,
  }),
);

const metaAttrs = metaAttribute({
  name: MetaConstants.ComponentName,
  testID,
});

const analyticsAttrs = makeAnalyticsAttribute(rest);
```

6. **Event handlers with disabled checks:**

```typescript
function handleClick(event: MouseEvent): void {
  if (onClick && !isDisabled) {
    onClick(event);
  }
}

function handleFocus(event: FocusEvent): void {
  if (!isDisabled) {
    handleFocusInteraction();
  }
  onFocus?.(event);
}
```

7. **Template with `svelte:element` for dynamic elements:**

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
  onmouseenter={handleMouseEnter}
  onmouseleave={handleMouseLeave}
>
  {#if typeof children === 'string'}
    {children}
  {:else if children && typeof children === 'function'}
    {@render children()}
  {/if}
</svelte:element>
```

### Step 4: Create Public Wrapper Component

**Create `ComponentName.svelte`:**

```svelte
<script lang="ts">
  import BaseComponentName from './BaseComponentName/BaseComponentName.svelte';
  import type { ComponentNameProps } from './types';
  import { makeAnalyticsAttribute } from '@razorpay/blade-core/utils';

  let {
    children,
    variant = 'primary',
    color = 'primary',
    size = 'medium',
    isDisabled = false,
    onClick,
    testID,
    onFocus,
    onBlur,
    onMouseEnter,
    onMouseLeave,
    ...rest
  }: ComponentNameProps = $props();

  // Extract analytics attributes
  const analyticsAttrs = makeAnalyticsAttribute(rest);

  // Build accessibility props
  const accessibilityProps = $derived({
    label: rest['aria-label'],
    describedBy: rest['aria-describedby'],
  });
</script>

<BaseComponentName
  {children}
  {variant}
  {color}
  {size}
  {isDisabled}
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

### Step 5: Create Storybook Stories

**Story Migration Requirements:**
- Replicate ALL stories from React stories file (analyzed in Step 0B)
- Match story names from React component
- Preserve what each story demonstrates (e.g., all sizes, all colors with disabled states)
- Create custom story templates for complex demos (use Svelte #each, conditionals)

**Create `ComponentName.stories.svelte`:**

```svelte
<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ComponentName from './ComponentName.svelte';

  const { Story } = defineMeta({
    title: 'Components/ComponentName',
    component: ComponentName,
    tags: ['autodocs'],
    args: {
      children: 'Component Text',
      variant: 'primary',
      color: 'primary',
      size: 'medium',
      isDisabled: false,
    },
    argTypes: {
      variant: {
        control: { type: 'select' },
        options: ['primary', 'secondary'],
        description: 'Visual variant of the component',
      },
      color: {
        control: { type: 'select' },
        options: ['primary', 'white', 'positive', 'negative'],
        description: 'Color theme',
      },
      size: {
        control: { type: 'select' },
        options: ['small', 'medium', 'large'],
        description: 'Size of the component',
      },
      isDisabled: {
        control: { type: 'boolean' },
        description: 'Whether component is disabled',
      },
      children: {
        control: { type: 'text' },
        description: 'Content of the component',
      },
    },
  });
</script>

<Story name="Playground" />

<Story name="Primary">
  <ComponentName variant="primary">
    Primary Component
  </ComponentName>
</Story>

<Story name="Secondary">
  <ComponentName variant="secondary">
    Secondary Component
  </ComponentName>
</Story>

<Story name="Sizes">
  <div style="display: flex; gap: 1rem; align-items: center;">
    <ComponentName size="small">Small</ComponentName>
    <ComponentName size="medium">Medium</ComponentName>
    <ComponentName size="large">Large</ComponentName>
  </div>
</Story>

<Story name="Disabled">
  <ComponentName isDisabled>
    Disabled Component
  </ComponentName>
</Story>
```

### Step 6: Update Component Index

**Update `packages/blade-svelte/src/components/index.ts`:**

Add these lines to export the new component:

```typescript
// ComponentName
export { default as ComponentName } from './ComponentName/ComponentName.svelte';
export { default as BaseComponentName } from './ComponentName/BaseComponentName/BaseComponentName.svelte';
```

### Step 7: Validation and Testing

After creating all files, run these commands:

1. **Type check:**

```bash
cd packages/blade-svelte && npm run svelte-check
```

2. **Build the package:**

```bash
cd packages/blade-svelte && npm run build
```

3. **Run Storybook:**

```bash
cd packages/blade-svelte && npm run storybook
```

4. **Verify in Storybook:**
   - Navigate to `http://localhost:6006`
   - Find "Components/ComponentName" in the sidebar
   - Test all variants and interactions
   - Check accessibility in the accessibility panel

## Key Patterns to Remember

1. ✅ **Two-layer architecture**: Always create both Base and Public components
2. ✅ **Svelte 5 runes**: Use `$state`, `$derived`, `$effect` for reactivity
3. ✅ **Class-based styling**: Never use inline styles, always use blade-core classes
4. ✅ **Accessibility first**: Use `makeAccessible()` and proper ARIA attributes
5. ✅ **Template classes**: Call `get*TemplateClasses()` functions to prevent tree-shaking
6. ✅ **TypeScript strict**: All components must be fully typed
7. ✅ **Event handlers**: Always check `isDisabled` before executing handlers
8. ✅ **Analytics support**: Extract and apply analytics attributes from rest props
9. ✅ **Snippets for children**: Support both string and Snippet types
10. ✅ **Interaction states**: Use `useInteraction()` hook for consistent state management

## Documentation Requirements

### Component-Level JSDoc (REQUIRED)

All exported components must have JSDoc comments with usage examples:

**Pattern for Public Components:**

```typescript
/**
 * ComponentName
 *
 * Brief 1-2 line description of what the component does and its primary purpose in the design system.
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
 * <ComponentName variant="primary" size="medium">
 *   Example Content
 * </ComponentName>
 * ```
 *
 * ----
 *
 * Checkout {@link https://blade.razorpay.com/?path=/docs/components-componentname ComponentName Documentation}
 */
```

**Example from Button:**

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
```

### JSDoc Checklist

Before completing a component, verify:

- [ ] All props have JSDoc descriptions
- [ ] Optional props have `@default` tags
- [ ] Complex behaviors are explained with additional paragraphs
- [ ] Platform-specific props marked (e.g., "Only applicable on mobile")
- [ ] Public component has usage example in JSDoc
- [ ] Event handler descriptions explain when they're called
- [ ] Analytics attributes documented

## CSS Architecture and Styling (CRITICAL)

### CSS Location Rules

**ALL CSS MUST GO IN BLADE-CORE, NOT BLADE-SVELTE**

- ✅ **DO:** Place all CSS in `packages/blade-core/src/styles/`
- ❌ **DON'T:** Create CSS files in `packages/blade-svelte/`

### CSS Module Structure

**Create CSS in blade-core following this pattern:**

```
packages/blade-core/src/styles/
├── ComponentName/
│   ├── componentname.module.css    # Component-specific styles
│   └── componentname.ts             # CVA wrapper
├── utilities.module.css             # Global utility classes
├── utilities.ts                     # Utility class exports
└── theme.css                        # Design tokens
```

### Class Variance Authority (CVA) Pattern

**Step 1: Create CSS Module** (`packages/blade-core/src/styles/ComponentName/componentname.module.css`):

```css
.base {
  border-radius: var(--border-radius-medium);
  padding: var(--spacing-4) var(--spacing-8);
  font-family: var(--font-family-text);
  transition: all 0.2s ease;
}

.base .container {
  display: flex;
  gap: var(--spacing-4);
  align-items: center;
}

/* Size variants */
.small {
  padding: var(--spacing-2) var(--spacing-4);
  font-size: var(--font-size-75);
}

.medium {
  padding: var(--spacing-3) var(--spacing-6);
  font-size: var(--font-size-100);
}

.large {
  padding: var(--spacing-4) var(--spacing-8);
  font-size: var(--font-size-200);
}

/* Visual variants */
.primary {
  background-color: var(--colors-interactive-background-primary-normal);
  color: var(--colors-interactive-foreground-primary-normal);

  &:hover {
    background-color: var(--colors-interactive-background-primary-highlighted);
  }

  &:active {
    background-color: var(--colors-interactive-background-primary-faded);
  }
}

.secondary {
  background-color: var(--colors-interactive-background-secondary-normal);
  color: var(--colors-interactive-foreground-secondary-normal);

  &:hover {
    background-color: var(--colors-interactive-background-secondary-highlighted);
  }
}

/* State variants - Use [disabled] selector, not classes */
.base[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}
```

**Step 2: Create CVA Wrapper** (`packages/blade-core/src/styles/ComponentName/componentname.ts`):

```typescript
import { cva } from 'class-variance-authority';
import styles from './componentname.module.css';

export const getComponentNameClasses = cva(styles.base, {
  variants: {
    size: {
      small: styles.small,
      medium: styles.medium,
      large: styles.large,
    },
    variant: {
      primary: styles.primary,
      secondary: styles.secondary,
    },
    isDisabled: {
      true: '', // Handled by [disabled] attribute selector
      false: '',
    },
  },
  defaultVariants: {
    size: 'medium',
    variant: 'primary',
    isDisabled: false,
  },
});

// Export template classes via function to prevent tree-shaking
export const getComponentNameTemplateClasses = () => {
  return {
    container: styles.container,
    // Add other template classes here
  };
};
```

**Step 3: Use in Svelte Component:**

```svelte
<script lang="ts">
  import { getComponentNameClasses, getComponentNameTemplateClasses } from '@razorpay/blade-core/styles';

  let { variant, size, isDisabled, ...rest }: ComponentProps = $props();

  // Get template classes via function
  const templateClasses = getComponentNameTemplateClasses();

  // Generate component classes reactively
  const classes = $derived(
    getComponentNameClasses({ variant, size, isDisabled })
  );
</script>

<button class={classes} disabled={isDisabled}>
  <div class={templateClasses.container}>
    Content
  </div>
</button>
```

### CSS Best Practices

1. **Use [disabled] Attribute Selector**
   - ✅ **DO:** Style disabled state with `[disabled]` selector
   - ❌ **DON'T:** Add/remove disabled classes dynamically

   ```css
   /* CORRECT */
   .base[disabled] {
     opacity: 0.6;
     cursor: not-allowed;
   }

   /* WRONG - Don't do this */
   .disabled {
     opacity: 0.6;
   }
   ```

2. **SCSS Syntax with Nested Selectors**
   - Use SCSS features (nesting, `&` parent selector)
   - Use CSS variables for all token values

   ```css
   .primary {
     background: var(--colors-primary);

     &:hover {
       background: var(--colors-primary-highlighted);
     }

     &:focus {
       outline: 2px solid var(--colors-primary);
     }
   }
   ```

3. **Global Utility Classes**
   - Layout utilities (margin, padding, display) go in `packages/blade-core/src/styles/utilities.ts`
   - Never put layout utilities in component-specific CSS

   ```typescript
   // In blade-core/src/styles/utilities.ts
   export const layoutClasses = {
     'm-2': 'margin: var(--spacing-2)',
     'p-4': 'padding: var(--spacing-4)',
     'flex': 'display: flex',
     // etc.
   };
   ```

4. **No Inline Styles**
   - ❌ **NEVER** use `style` attribute or `style:` directive
   - ✅ **ALWAYS** use CSS classes

## Utility Functions (CRITICAL RULES)

### Where to Place Utilities

**ALWAYS place utilities in blade-core, NEVER in blade-svelte:**

- ✅ **DO:** `packages/blade-core/src/utils/utilityName/index.ts`
- ❌ **DON'T:** `packages/blade-svelte/src/utils/`

### Before Adding a Utility

**ALWAYS check if it exists first:**

1. Check `packages/blade-core/src/utils/` directory
2. Search for similar function names
3. If unsure, **ASK FOR CONFIRMATION** before creating new utility
4. If it exists in React (`packages/blade/src/utils/`), migrate it to blade-core first

### Example Utility Migration

If you need a utility like `makeBorderSize`:

1. **Check:** Does it exist in `packages/blade-core/src/utils/makeBorderSize/`?
2. **If NO:** Check if it exists in `packages/blade/src/utils/makeBorderSize/`
3. **If YES in React:** Migrate it to blade-core first (ask user for confirmation)
4. **If NO anywhere:** Create in blade-core (ask user for confirmation)

## Interactive Workflow (REQUIRED)

### Ask for Confirmation

**ALWAYS ask user before:**

1. Creating new utility functions
2. Migrating dependencies (e.g., Icon component needs)
3. Making architectural decisions
4. Deviating from React API
5. Adding CSS patterns not seen in existing components

### Discuss Approach First

**Before writing code:**

1. Explain your implementation approach
2. Show which template component you'll use
3. List any dependencies that need migration
4. Wait for user confirmation
5. Only write code after approval

### WYSIWYG Philosophy

**"What You See Is What You Get"**

- Compound components should visually match their structure
- No magic abstractions that hide component composition
- If React has `<Card><CardHeader /></Card>`, Svelte should too
- Don't add props that internally do non-intuitive things

## Svelte-Specific Anti-Patterns

### DON'T Use createEventDispatcher

❌ **WRONG:**
```svelte
<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  function handleClick() {
    dispatch('click', { data });
  }
</script>
```

✅ **CORRECT:**
```svelte
<script lang="ts">
  let { onClick }: { onClick?: (event: MouseEvent) => void } = $props();

  function handleClick(event: MouseEvent) {
    onClick?.(event);
  }
</script>
```

**Reason:** Prop-based callbacks maintain API compatibility with React and are more explicit.

## Important Notes

- **Blade Core Dependency**: All styling and utilities come from `@razorpay/blade-core`
- **CSS in blade-core**: Never create CSS in blade-svelte, always in blade-core
- **Check before adding**: Always check if utilities exist before creating new ones
- **Ask for confirmation**: When unsure, always ask the user
- **No Icon Component Yet**: Icon support is placeholder until Icon component is implemented
- **External Svelte**: Svelte is externalized in build; don't bundle it
- **Preserve Module Structure**: Build uses `preserveModules: true` for tree-shaking
- **Export Pattern**: Export both default component and Base component from index

## Reference Examples

### Svelte Components (Already Migrated) - USE THESE AS TEMPLATES!

**These are working, production-ready components. Copy their structure and adapt to your needs.**

#### Button (Interactive Component Template)
**Use this template for:** Clickable components, interactive controls, buttons, toggles

Key files to read and copy:
- [Button.svelte](packages/blade-svelte/src/components/Button/Button.svelte) - Public wrapper pattern
- [BaseButton.svelte](packages/blade-svelte/src/components/Button/BaseButton/BaseButton.svelte) - Interaction states, event handlers
- [types.ts](packages/blade-svelte/src/components/Button/BaseButton/types.ts) - Prop interface pattern
- [Button.stories.svelte](packages/blade-svelte/src/components/Button/Button.stories.svelte) - Story structure

**Shows:** Interaction states, useInteraction() hook, disabled handling, loading state, icon positioning

#### Typography/Text (Display Component Template)
**Use this template for:** Text components, labels, static display elements

Key files to read and copy:
- [Text.svelte](packages/blade-svelte/src/components/Typography/Text/Text.svelte) - Simple wrapper
- [BaseText.svelte](packages/blade-svelte/src/components/Typography/BaseText/BaseText.svelte) - Text rendering patterns
- [types.ts](packages/blade-svelte/src/components/Typography/BaseText/types.ts) - Typography props

**Shows:** Text color management, size variants, truncation, contrast handling

#### Link (Hybrid Component Template)
**Use this template for:** Components that can be both button and anchor, navigation elements

Key files to read and copy:
- [Link.svelte](packages/blade-svelte/src/components/Link/Link.svelte)
- [BaseLink.svelte](packages/blade-svelte/src/components/Link/BaseLink/BaseLink.svelte)

**Shows:** Dynamic element (`<svelte:element>`), href vs onClick, target/rel handling

#### Amount (Component with Dependencies Template)
**Use this template for:** Components that use other Blade components internally

Key files to read and copy:
- [Amount.svelte](packages/blade-svelte/src/components/Amount/Amount.svelte)
- [BaseAmount.svelte](packages/blade-svelte/src/components/Amount/BaseAmount/BaseAmount.svelte)

**Shows:** Composition with BaseText, formatting utilities, i18nify-js integration

#### Spinner (Simple Component Template)
**Use this template for:** Simple, self-contained components with no interactions

Key files to read and copy:
- [Spinner.svelte](packages/blade-svelte/src/components/Spinner/Spinner.svelte)

**Shows:** Minimal pattern, animation classes, size variants

### How to Use Reference Components

1. **Before writing code**, read the most similar reference component
2. **Copy the file structure** exactly (including folder names)
3. **Copy the import statements** and adapt package names
4. **Copy the prop destructuring** pattern with `$props()`
5. **Copy the class generation** pattern with `$derived()`
6. **Copy the accessibility** pattern with `makeAccessible()`
7. **Adapt the prop types** to match your React component's API
8. **Adapt the rendering logic** to your component's needs

### React Components (Source Library)

For API reference and behavior, examine the React implementation:

- **React Button**: [packages/blade/src/components/Button/](packages/blade/src/components/Button/)
- **React Card**: [packages/blade/src/components/Card/](packages/blade/src/components/Card/)
- **React Input**: [packages/blade/src/components/Input/](packages/blade/src/components/Input/)
- **React Modal**: [packages/blade/src/components/Modal/](packages/blade/src/components/Modal/)
- **React Dropdown**: [packages/blade/src/components/Dropdown/](packages/blade/src/components/Dropdown/)
- **React Tabs**: [packages/blade/src/components/Tabs/](packages/blade/src/components/Tabs/)
- **React Accordion**: [packages/blade/src/components/Accordion/](packages/blade/src/components/Accordion/)

**Complete React Component List:** See [packages/blade/src/components/](packages/blade/src/components/) for 77+ available components

## Completion Checklist

After implementation, verify:

### Migration Verification
- [ ] React component examined and API documented
- [ ] All React props are supported in Svelte version
- [ ] Prop names match exactly (including casing)
- [ ] Enum values match exactly (variant, color, size, etc.)
- [ ] Default values match React defaults
- [ ] Event handlers have same signatures
- [ ] Accessibility attributes match React implementation
- [ ] Sub-components identified and planned (if any)

### Implementation Verification
- [ ] Directory structure follows the two-layer pattern
- [ ] Types are properly defined with JSDoc comments
- [ ] **All props have JSDoc descriptions**
- [ ] **Optional props have @default tags**
- [ ] **Public component has JSDoc with usage example**
- [ ] **Platform-specific props marked in JSDoc**
- [ ] Base component uses Svelte 5 runes correctly
- [ ] Public wrapper handles analytics and passes props
- [ ] **ALL React stories migrated to Svelte stories (not just basic examples)**
- [ ] **Story names match or appropriately adapted from React**
- [ ] Component is exported from `src/components/index.ts`
- [ ] Type checking passes (`npm run svelte-check`)
- [ ] Build succeeds (`npm run build`)
- [ ] Storybook displays component correctly
- [ ] Accessibility attributes are properly applied
- [ ] Event handlers check for disabled state
- [ ] **No inline styles are used (all classes from blade-core)**
- [ ] **CSS created in blade-core/src/styles/, NOT blade-svelte**
- [ ] **CVA pattern used for conditional classes**
- [ ] **[disabled] attribute selector used in CSS (not classes)**
- [ ] **No createEventDispatcher used (prop-based callbacks only)**
- [ ] **All utilities placed in blade-core/utils/ (not blade-svelte)**
- [ ] **Utilities checked for existence before creating new ones**

### Feature Parity Verification
- [ ] All React variants implemented in Svelte
- [ ] **ALL React stories replicated in Svelte Storybook (complete migration, not simplified)**
- [ ] **Complex story templates migrated (all sizes, all colors, etc.)**
- [ ] Visual appearance matches React component
- [ ] Interaction behavior matches React component
- [ ] StyledPropsBlade props work correctly (margin, display, etc.)
- [ ] Component works with all supported color schemes (light/dark)
- [ ] Component works across different brand colors
