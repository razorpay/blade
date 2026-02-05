# React to Svelte Migration Guide

This guide covers the process of migrating Blade components from React to Svelte while maintaining API compatibility and feature parity.

## Migration Philosophy

**Goal:** Create Svelte components that are API-compatible with React components but leverage Svelte's reactivity model and simpler syntax.

**Principles:**
1. **API Compatibility:** Props, types, and behavior should match the React version
2. **Simplification:** Use Svelte's built-in reactivity instead of hooks
3. **Class-based Styling:** Replace styled-components with CSS classes from blade-core
4. **Type Safety:** Maintain strict TypeScript throughout
5. **Accessibility:** Preserve all a11y features from React

## Step-by-Step Migration Process

### 1. Analyze the React Component

**Examine these files:**
```bash
# Main component
packages/blade/src/components/[Component]/[Component].tsx

# Types
packages/blade/src/components/[Component]/types.ts

# Base component (if exists)
packages/blade/src/components/[Component]/Base[Component]/Base[Component].tsx

# Stories
packages/blade/src/components/[Component]/[Component].stories.tsx

# Documentation
packages/blade/src/components/[Component]/docs/
```

**Document:**
- All props and their types
- Default values for each prop
- Variant options (variant, color, size, etc.)
- Event handlers
- Sub-components or compound components
- Accessibility requirements
- Platform-specific code (web vs native)

### 2. Map React Patterns to Svelte

#### State Management

**React:**
```typescript
const [count, setCount] = useState(0);
const [isActive, setIsActive] = useState(false);
```

**Svelte:**
```typescript
let count = $state(0);
let isActive = $state(false);
```

#### Computed Values

**React:**
```typescript
const doubled = useMemo(() => count * 2, [count]);

const classes = useMemo(() => {
  return getButtonClasses({ variant, size });
}, [variant, size]);
```

**Svelte:**
```typescript
const doubled = $derived(count * 2);

const classes = $derived(
  getButtonClasses({ variant, size })
);
```

#### Effects

**React:**
```typescript
useEffect(() => {
  if (isDisabled) {
    setCurrentState('disabled');
  }
}, [isDisabled]);
```

**Svelte:**
```typescript
$effect(() => {
  if (isDisabled) {
    currentState = 'disabled';
  }
});
```

#### Children

**React:**
```typescript
type Props = {
  children?: React.ReactNode;
}

// Usage
<Component>{children}</Component>
```

**Svelte:**
```typescript
type Props = {
  children?: Snippet | string;
}

// Usage in template
{#if typeof children === 'string'}
  {children}
{:else if children}
  {@render children()}
{/if}
```

#### Event Handlers

**React:**
```typescript
type Props = {
  onClick?: React.MouseEvent<HTMLButtonElement> => void;
  onFocus?: React.FocusEvent<HTMLButtonElement> => void;
}

// Platform.Select for cross-platform
onClick?: Platform.Select<{
  native: (event: GestureResponderEvent) => void;
  web: (event: React.MouseEvent<HTMLButtonElement>) => void;
}>;
```

**Svelte (Web-only):**
```typescript
type Props = {
  onClick?: (event: MouseEvent) => void;
  onFocus?: (event: FocusEvent) => void;
}

// No Platform.Select needed - Svelte is web-only
```

### 3. Translate Props Interface

#### Example: Button Component

**React (`packages/blade/src/components/Button/types.ts`):**
```typescript
type ButtonCommonProps = {
  children?: React.ReactNode;
  icon?: IconComponent;
  iconPosition?: 'left' | 'right';
  variant?: 'primary' | 'secondary' | 'tertiary';
  color?: 'primary' | 'white' | 'positive' | 'negative';
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  isDisabled?: boolean;
  isFullWidth?: boolean;
  isLoading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  href?: string;
  target?: string;
  rel?: string;
  accessibilityLabel?: string;
  onClick?: Platform.Select<{
    native: (event: GestureResponderEvent) => void;
    web: (event: React.MouseEvent<HTMLButtonElement>) => void;
  }>;
  onBlur?: Platform.Select<{
    native: (event: NativeSyntheticEvent<TextInputFocusEventData>) => void;
    web: (event: React.FocusEvent<HTMLButtonElement>) => void;
  }>;
  ...StyledPropsBlade;
  ...DataAnalyticsAttribute;
  ...TestID;
};

export type ButtonProps =
  | (ButtonCommonProps & { icon?: undefined; children: StringChildrenType })
  | (ButtonCommonProps & { icon: IconComponent; children?: StringChildrenType });
```

**Svelte (`packages/blade-svelte/src/components/Button/BaseButton/types.ts`):**
```typescript
export interface BaseButtonProps extends StyledPropsBlade {
  children?: Snippet | string;
  icon?: IconComponent;
  iconPosition?: 'left' | 'right';
  variant?: 'primary' | 'secondary' | 'tertiary';
  color?: 'primary' | 'white' | 'positive' | 'negative';
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  isDisabled?: boolean;
  isFullWidth?: boolean;
  isLoading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  href?: string;
  target?: string;
  rel?: string;
  accessibilityLabel?: string;
  onClick?: (event: MouseEvent) => void;
  onBlur?: (event: FocusEvent) => void;
  onFocus?: (event: FocusEvent) => void;
  onMouseEnter?: (event: MouseEvent) => void;
  onMouseLeave?: (event: MouseEvent) => void;
  onMouseDown?: (event: MouseEvent) => void;
  onMouseUp?: (event: MouseEvent) => void;
  testID?: string;
  id?: string;
  accessibilityProps?: AccessibilityProps;
  [key: `data-analytics-${string}`]: string;
}
```

**Key Changes:**
- `React.ReactNode` → `Snippet | string`
- `Platform.Select<{web: ..., native: ...}>` → Direct web type (e.g., `MouseEvent`)
- Remove React Native types
- Keep all prop names identical
- Keep all enum values identical
- Keep default values identical

### 4. Replace Styled Components with CSS Classes

**React (styled-components):**
```typescript
import styled from 'styled-components';
import { getStyledProps } from '~components/Box/styledProps';

const StyledButton = styled.button<ButtonProps>`
  ${(props) => getButtonStyles(props)}
`;

const Button = (props: ButtonProps) => {
  const styledProps = getStyledProps(props);
  return (
    <StyledButton {...styledProps}>
      {children}
    </StyledButton>
  );
};
```

**Svelte (CSS classes):**
```svelte
<script lang="ts">
  import { getButtonClasses } from '@razorpay/blade-core/styles';
  import { getStyledPropsClasses } from '@razorpay/blade-core/utils';

  let { variant, size, isDisabled, ...rest }: ButtonProps = $props();

  const buttonClasses = $derived(
    getButtonClasses({ variant, size, isDisabled })
  );

  const styledProps = $derived(getStyledPropsClasses(rest));

  const combinedClasses = $derived(() => {
    return [buttonClasses, styledProps.classes].filter(Boolean).join(' ');
  });
</script>

<button class={combinedClasses()}>
  {children}
</button>
```

### 5. Translate Component Logic

#### Interaction State

**React:**
```typescript
const [currentInteraction, setCurrentInteraction] = useState<ActionStatesType>('default');

const handleMouseEnter = () => {
  if (!isDisabled) {
    setCurrentInteraction('hover');
  }
};

const handleMouseLeave = () => {
  if (!isDisabled) {
    setCurrentInteraction('default');
  }
};

const handleFocus = () => {
  if (!isDisabled) {
    setCurrentInteraction('focus');
  }
};

const handleBlur = () => {
  if (!isDisabled) {
    setCurrentInteraction('default');
  }
};
```

**Svelte (with useInteraction hook):**
```typescript
import { useInteraction } from '../../../utils/useInteraction';

let currentInteraction = $state<ActionStatesType>('default');

const {
  onMouseEnter: handleMouseEnterInteraction,
  onMouseLeave: handleMouseLeaveInteraction,
  onFocus: handleFocusInteraction,
  onBlur: handleBlurInteraction,
} = useInteraction(
  () => currentInteraction,
  (state) => { currentInteraction = state; },
);

function handleMouseEnter(event: MouseEvent): void {
  if (!isDisabled) {
    handleMouseEnterInteraction();
  }
  onMouseEnter?.(event);
}

function handleFocus(event: FocusEvent): void {
  if (!isDisabled) {
    handleFocusInteraction();
  }
  onFocus?.(event);
}
```

#### Conditional Rendering

**React:**
```typescript
return (
  <button>
    {isLoading && <Spinner />}
    {icon && iconPosition === 'left' && <Icon />}
    {children}
    {icon && iconPosition === 'right' && <Icon />}
  </button>
);
```

**Svelte:**
```svelte
<button>
  {#if isLoading}
    <Spinner />
  {/if}
  {#if icon && iconPosition === 'left'}
    <Icon />
  {/if}
  {#if typeof children === 'string'}
    {children}
  {:else if children}
    {@render children()}
  {/if}
  {#if icon && iconPosition === 'right'}
    <Icon />
  {/if}
</button>
```

### 6. Migrate Storybook Stories

**React (`Component.stories.tsx`):**
```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'tertiary'],
    },
  },
};

export default meta;

export const Primary: StoryObj<typeof Button> = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
  },
};
```

**Svelte (`Component.stories.svelte`):**
```svelte
<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Button from './Button.svelte';

  const { Story } = defineMeta({
    title: 'Components/Button',
    component: Button,
    tags: ['autodocs'],
    args: {
      variant: 'primary',
    },
    argTypes: {
      variant: {
        control: { type: 'select' },
        options: ['primary', 'secondary', 'tertiary'],
      },
    },
  });
</script>

<Story name="Primary" args={{ children: 'Primary Button' }} />
```

### 7. Handle Platform-Specific Code

**React (with Platform.Select):**
```typescript
import { Platform } from '@razorpay/blade-core/utils';

const fontSize = Platform.select({
  web: '16px',
  native: 14,
});

const onClick = Platform.select({
  web: (event: React.MouseEvent) => { /* ... */ },
  native: (event: GestureResponderEvent) => { /* ... */ },
});
```

**Svelte (web-only):**
```typescript
// No Platform.select needed - Svelte is web-only
const fontSize = '16px';

const onClick = (event: MouseEvent) => { /* ... */ };
```

## Common Patterns Reference

### Prop Destructuring

**React:**
```typescript
const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  ...rest
}: ButtonProps) => {
  // ...
};
```

**Svelte:**
```typescript
let {
  children,
  variant = 'primary',
  size = 'medium',
  ...rest
}: ButtonProps = $props();
```

### Forwarding Refs

**React:**
```typescript
const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  return <button ref={ref} {...props} />;
});
```

**Svelte (use bind:this):**
```svelte
<script lang="ts">
  let buttonElement: HTMLButtonElement | undefined = $state();

  // Expose to parent if needed
  export function focus() {
    buttonElement?.focus();
  }
</script>

<button bind:this={buttonElement}>...</button>
```

### Context

**React:**
```typescript
const ThemeContext = createContext<Theme | null>(null);

const Button = () => {
  const theme = useContext(ThemeContext);
  // ...
};
```

**Svelte:**
```typescript
import { getContext } from 'svelte';

const theme = getContext<Theme>('theme');
```

## Testing Considerations

### React Tests
React components have extensive tests:
- `Component.web.test.tsx` - DOM/web tests
- `Component.native.test.tsx` - React Native tests
- `Component.ssr.test.tsx` - Server-side rendering

### Svelte Tests (Future)
Svelte components should eventually have:
- Unit tests with Vitest + @testing-library/svelte
- Snapshot tests for rendering
- Accessibility tests

## Checklist for Each Migration

- [ ] React component analyzed and documented
- [ ] All props mapped to Svelte equivalents
- [ ] Type definitions created with identical API
- [ ] Styled-components replaced with CSS classes
- [ ] React hooks replaced with Svelte runes
- [ ] Platform-specific code removed (keep web-only)
- [ ] Event handlers adapted to web types
- [ ] Interaction states implemented
- [ ] Accessibility preserved
- [ ] Storybook stories migrated
- [ ] All React variants covered
- [ ] Visual appearance matches React
- [ ] Behavior matches React
- [ ] Build and type-check pass

## Tips

1. **Start with Simple Components:** Button, Link, Spinner are good starting points
2. **Reference Existing Migrations:** Look at already-migrated components
3. **Maintain API Compatibility:** Users should be able to swap React for Svelte seamlessly
4. **Simplify Where Possible:** Svelte doesn't need as much boilerplate as React
5. **Test Thoroughly:** Verify all props, variants, and interactions work
6. **Document Differences:** Note any intentional deviations from React API

## Resources

- [Svelte 5 Runes Documentation](https://svelte.dev/docs/runes)
- [Blade React Components](../../../packages/blade/src/components/)
- [Blade Svelte Components](../../../packages/blade-svelte/src/components/)
- [Blade Core Utilities](../../../packages/blade-core/src/utils/)
- [Migration Rules](.cursor/rules/svelte-migration.mdc)
