## Component Name

Button

## Description

The Button component is an interactive element for triggering actions. It supports variants, sizes, colors, icons, loading states, and avatar groups on large buttons.

## Important Constraints

- `variant="tertiary"` can only be used with `color="primary"` or `color="white"`
- `avatars` only render on `size="large"` buttons
- `accessibilityLabel` is required for icon-only buttons

## TypeScript Types

```typescript
import type { Snippet } from 'svelte';
import type { StyledPropsBlade } from '@razorpay/blade-core/utils';

type ButtonProps = {
  children?: Snippet | string;
  icon?: IconComponent;
  iconPosition?: 'left' | 'right';
  variant?: 'primary' | 'secondary' | 'tertiary';
  color?: 'primary' | 'white' | 'positive' | 'negative';
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  isDisabled?: boolean;
  isFullWidth?: boolean;
  isLoading?: boolean;
  loadingType?: 'indefinite' | 'definite';
  loadingTimer?: number;
  onLoadingComplete?: () => void;
  avatars?: ButtonAvatar[];
  accessibilityLabel?: string;
  onClick?: (event: MouseEvent) => void;
  role?: string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-controls'?: string;
  'aria-haspopup'?: 'menu' | boolean;
} & StyledPropsBlade;
```

## Usage Guidelines

**Do**

- Use `variant="primary"` for main actions, `"secondary"` for supporting actions, `"tertiary"` for de-emphasized actions
- Use `isLoading` with `loadingType="indefinite"` for async operations
- Use `loadingType="definite"` with `loadingTimer` for timed progress feedback
- Use `accessibilityLabel` for icon-only buttons

**Don't**

- Don't use `variant="tertiary"` with `color="positive"` or `color="negative"`
- Don't pass `avatars` expecting them on non-large sizes

## Example

### Basic variants and loading

```svelte
<script lang="ts">
  import { Button, SearchIcon } from '@razorpay/blade-svelte/components';

  let isProcessing = $state(false);

  function handlePay(): void {
    isProcessing = true;
    setTimeout(() => {
      isProcessing = false;
    }, 2000);
  }
</script>

<Button variant="primary" isFullWidth isLoading={isProcessing} onClick={handlePay}>
  Pay Now
</Button>

<Button variant="secondary" icon={SearchIcon} iconPosition="left">
  Search
</Button>

<Button variant="tertiary" isDisabled>Disabled</Button>
```

### Definite loading with callback

```svelte
<script lang="ts">
  import { Button } from '@razorpay/blade-svelte/components';

  let isDefiniteLoading = $state(false);

  function startLoading(): void {
    isDefiniteLoading = true;
  }

  function handleComplete(): void {
    isDefiniteLoading = false;
  }
</script>

<Button
  size="large"
  loadingType={isDefiniteLoading ? 'definite' : 'indefinite'}
  loadingTimer={isDefiniteLoading ? 2500 : undefined}
  onClick={startLoading}
  onLoadingComplete={handleComplete}
>
  {isDefiniteLoading ? 'Processing' : 'Complete in 2.5s'}
</Button>
```

### Icon-only button

```svelte
<script lang="ts">
  import { Button, CloseIcon } from '@razorpay/blade-svelte/components';
</script>

<Button icon={CloseIcon} accessibilityLabel="Close" size="medium" />
```
