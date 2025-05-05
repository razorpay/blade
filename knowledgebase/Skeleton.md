## Component Name

Skeleton

## Description

The Skeleton component is a placeholder UI element that displays a pulsing animation while content is loading. It mimics the structure and appearance of the final content to create a smoother perceived loading experience. Skeletons reduce the perception of loading time and provide users with a visual indication of the layout before the actual content appears.

## TypeScript Types

These types define the props that the Skeleton component accepts, allowing you to configure how the loading placeholders appear.

```typescript
type SkeletonProps = {
  /**
   * Sets the width of the skeleton.
   * Can be any valid CSS width value or responsive object.
   */
  width?: string | number | ResponsiveValue<string | number>;

  /**
   * Sets the maximum width of the skeleton.
   * Can be any valid CSS max-width value or responsive object.
   */
  maxWidth?: string | number | ResponsiveValue<string | number>;

  /**
   * Sets the minimum width of the skeleton.
   * Can be any valid CSS min-width value or responsive object.
   */
  minWidth?: string | number | ResponsiveValue<string | number>;

  /**
   * Sets the height of the skeleton.
   * Can be any valid CSS height value or responsive object.
   */
  height?: string | number | ResponsiveValue<string | number>;

  /**
   * Sets the maximum height of the skeleton.
   * Can be any valid CSS max-height value or responsive object.
   */
  maxHeight?: string | number | ResponsiveValue<string | number>;

  /**
   * Sets the minimum height of the skeleton.
   * Can be any valid CSS min-height value or responsive object.
   */
  minHeight?: string | number | ResponsiveValue<string | number>;

  /**
   * Sets the border radius of the skeleton.
   * @default 'medium'
   */
  borderRadius?: BorderRadiusToken;

  /**
   * Unique identifier for testing purposes.
   */
  testID?: string;
} & StyledPropsBlade &
  Partial<FlexboxProps>;
```

## Example

### Basic Usage

This example shows a simple implementation of multiple Skeleton elements with varying widths and heights to create a text-like loading placeholder.

```tsx
import { Skeleton, Box } from '@razorpay/blade/components';

function BasicSkeletonExample() {
  return (
    <Box padding="spacing.4">
      {/* Simple skeleton line */}
      <Skeleton width="100%" height="24px" borderRadius="medium" marginBottom="spacing.4" />

      {/* Shorter skeleton line */}
      <Skeleton width="60%" height="20px" borderRadius="medium" marginBottom="spacing.4" />

      {/* Even shorter skeleton line */}
      <Skeleton width="40%" height="20px" borderRadius="medium" />
    </Box>
  );
}
```

### Card With Loading State

This example demonstrates how to use Skeleton components within a card to create a realistic loading state that mimics the actual content's structure, with a toggle button to switch between loading and loaded states.

```tsx
import { useState, useEffect } from 'react';
import {
  Skeleton,
  Box,
  Card,
  CardHeader,
  CardBody,
  CardHeaderLeading,
  Button,
  Text,
  Divider,
} from '@razorpay/blade/components';

function CardLoadingExample() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Box maxWidth="400px">
      <Button marginBottom="spacing.4" onClick={() => setIsLoading((prev) => !prev)}>
        Toggle Loading State
      </Button>

      <Card>
        {isLoading ? (
          <Box padding="spacing.6">
            {/* Header skeleton */}
            <Box marginBottom="spacing.4">
              <Skeleton width="70%" height="24px" borderRadius="medium" marginBottom="spacing.3" />
              <Skeleton width="40%" height="16px" borderRadius="medium" />
            </Box>

            <Divider marginY="spacing.4" />

            {/* Content skeleton */}
            <Box>
              <Skeleton width="100%" height="16px" borderRadius="medium" marginBottom="spacing.3" />
              <Skeleton width="100%" height="16px" borderRadius="medium" marginBottom="spacing.3" />
              <Skeleton width="60%" height="16px" borderRadius="medium" />
            </Box>
          </Box>
        ) : (
          <>
            <CardHeader>
              <CardHeaderLeading title="Payment Pages" subtitle="Automated Receipts Enabled" />
            </CardHeader>
            <CardBody>
              <Text>
                Razorpay Payment Pages is the easiest way to accept payments with a custom-branded
                online store. Accept international and domestic payments with automated payment
                receipts.
              </Text>
            </CardBody>
          </>
        )}
      </Card>
    </Box>
  );
}
```
