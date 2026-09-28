# BottomBar

## Component Name

BottomBar

## Description

BottomBar is a bar fixed to the bottom of the screen. It holds the main actions of a mobile screen, for example "Cancel" and "Continue" buttons. It stays visible when the page scrolls.

## Usage Guidelines

- Use BottomBar for the primary actions of a mobile screen or flow.
- Keep 1 or 2 actions. Use `isFullWidth` on buttons.
- Give an `accessibilityLabel` that tells what the actions are for.
- Do not use BottomBar for navigation between app sections. Use `BottomNav` for that.

## TypeScript Types

```typescript
type BottomBarProps = {
  /**
   * BottomBar content. Usually action buttons.
   */
  children: React.ReactNode;
  /**
   * zIndex of BottomBar
   * @default 100
   */
  zIndex?: number;
  /**
   * Accessible label for the BottomBar region
   */
  accessibilityLabel?: string;
} & StyledPropsBlade &
  TestID &
  DataAnalyticsAttribute;
```

## Examples

### BottomBar with Two Actions

```tsx
import React from 'react';
import { BottomBar, Button, Box, Heading, Text } from '@razorpay/blade/components';

function CheckoutScreen(): React.ReactElement {
  return (
    <Box minHeight="400px" padding="spacing.4">
      <Heading size="medium">Review order</Heading>
      <Text marginTop="spacing.2" color="surface.text.gray.muted">
        Check your items before you pay.
      </Text>
      <BottomBar accessibilityLabel="Order actions">
        <Button variant="secondary" isFullWidth>
          Cancel
        </Button>
        <Button isFullWidth>Continue</Button>
      </BottomBar>
    </Box>
  );
}

export default CheckoutScreen;
```

### BottomBar with Single Action

```tsx
import React from 'react';
import { BottomBar, Button } from '@razorpay/blade/components';

function SingleActionBar(): React.ReactElement {
  return (
    <BottomBar accessibilityLabel="Payment actions">
      <Button isFullWidth size="large" onClick={() => console.log('pay')}>
        Pay Now
      </Button>
    </BottomBar>
  );
}

export default SingleActionBar;
```
