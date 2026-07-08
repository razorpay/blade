## Component Name

IconButton

## Description

The IconButton component provides an accessible way to trigger actions using only icons. It is designed for interfaces where space is limited or when a visual-only control is preferred, such as close buttons for modals, action buttons in cards, or compact toolbar controls. IconButton maintains proper accessibility with required labels while offering various visual styles.

## Important Constraints

- `size="large"` is not allowed with `isHighlighted={true}`

## TypeScript Types

The following types represent the props that the IconButton component accepts. These allow you to properly configure the component according to your needs.

```typescript
/**
 * Props for the IconButton component
 */
type IconButtonProps = {
  /**
   * The icon to display
   * Accepts an icon component from Blade
   */
  icon: IconComponent;

  /**
   * Size of the IconButton
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Visual emphasis of the IconButton
   * @default 'intense'
   */
  emphasis?: 'intense' | 'subtle';

  /**
   * Whether the IconButton is disabled
   * @default false
   */
  isDisabled?: boolean;

  /**
   * Accessible label for the IconButton
   * Required for accessibility
   */
  accessibilityLabel: string;

  /**
   * Function called when the IconButton is clicked
   */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
} & StyledPropsBlade &
  DataAnalyticsAttribute;

/**
 * Type for icon components
 */
type IconComponent = React.ComponentType<{
  size?: 'small' | 'medium' | 'large';
  color?: string;
}>;
```

## Usage Guidelines

**Do**

- Use `IconButton` for icon-only actions in space-constrained interfaces (close buttons, card actions, toolbars).
- Always provide a meaningful `accessibilityLabel` (e.g., "Close dialog", "Edit profile") — it's required.
- Use `emphasis="subtle"` for less prominent actions and `"intense"` (default) for primary icon actions.
- Use appropriate size relative to surrounding content: `"small"` in dense UI, `"large"` for prominent actions.

**Don't**

- Don't use `IconButton` when text + icon would be clearer — use `Button` with an icon instead.
- Don't use generic labels like "Button" for `accessibilityLabel` — describe the action specifically.
- Don't combine `size="large"` with `isHighlighted={true}` — this combination is not supported.
- Don't use `IconButton` for navigation — use `Link` with an icon instead.

## Examples

### Basic IconButton Usage

This example demonstrates the basic usage of the IconButton component with different variations of size, emphasis, and state.

```tsx
import React from 'react';
import { IconButton, Box, Text, CloseIcon, EditIcon, InfoIcon } from '@razorpay/blade/components';

const IconButtonBasicExample = () => {
  return (
    <Box padding="spacing.5">
      <Box
        backgroundColor="surface.background.gray.subtle"
        padding="spacing.4"
        borderRadius="medium"
      >
        <Box display="flex" gap="spacing.4">
          {/* Default */}
          <IconButton
            icon={CloseIcon}
            accessibilityLabel="Close dialog"
            onClick={() => console.log('Close clicked')}
          />

          {/* With size and emphasis */}
          <IconButton
            icon={EditIcon}
            size="small"
            emphasis="subtle"
            accessibilityLabel="Edit item"
            onClick={() => console.log('Edit clicked')}
          />

          {/* Disabled state */}
          <IconButton
            icon={InfoIcon}
            isDisabled
            accessibilityLabel="Information"
            onClick={() => console.log('Info clicked')}
            data-analytics="info-click"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default IconButtonBasicExample;
```
