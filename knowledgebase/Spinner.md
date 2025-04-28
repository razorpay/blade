## Component Name

Spinner

## Description

A Spinner is an element with a looping animation that indicates loading is in progress. It provides visual feedback to users when content is being loaded or when an action is being processed, helping to improve user experience during wait times.

## TypeScript Types

These types define the props that the Spinner component and its subcomponents accept, allowing you to configure the component when using it in your application.

```typescript
// Main component props
type SpinnerProps = {
  /**
   * Sets the color of the spinner.
   *
   * @default 'neutral'
   */
  color?: 'primary' | 'neutral' | 'white';
  /**
   * Sets the label of the spinner.
   */
  label?: string;
  /**
   * Sets the position of the label.
   *
   * @default 'right'
   */
  labelPosition?: 'right' | 'bottom';
  /**
   * Sets the size of the spinner.
   *
   * @default 'medium'
   */
  size?: 'medium' | 'large' | 'xlarge';
  /**
   * Sets the aria-label for web & accessibilityLabel react-native.
   *
   * @default 'Loading'
   */
  accessibilityLabel?: string;
} & TestID &
  StyledPropsBlade;

// Token types
type SpinnerDimensions = {
  medium: 16;
  large: 20;
  xlarge: 24;
};

// Motion configuration
type SpinnerMotion = {
  duration: DurationString;
  easing: EasingString;
};
```

## Example

### Basic Usage

```tsx
import { useState, useEffect } from 'react';
import { Spinner, Text, Box } from '@razorpay/blade/components';

function LoadingExample() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading state for 3 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Box>
      {isLoading ? (
        <Spinner accessibilityLabel="Loading content" color="primary" />
      ) : (
        <Text>Content loaded successfully!</Text>
      )}
    </Box>
  );
}
```

### Spinner with Different Sizes, Colors and Labels

```tsx
import { Spinner, Box } from '@razorpay/blade/components';

function SpinnerVariationsExample() {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.4">
      {/* Medium spinner (default) with neutral color */}
      <Spinner
        size="medium"
        color="neutral"
        label="Loading data"
        accessibilityLabel="Loading data"
      />

      {/* Large spinner with primary color */}
      <Spinner
        size="large"
        color="primary"
        label="Processing payment"
        labelPosition="right"
        accessibilityLabel="Processing payment"
      />

      {/* Extra large spinner with white color on dark background */}
      <Box
        backgroundColor="surface.background.gray.intense"
        padding="spacing.4"
        borderRadius="medium"
      >
        <Spinner
          size="xlarge"
          color="white"
          label="Uploading files"
          labelPosition="bottom"
          accessibilityLabel="Uploading files"
        />
      </Box>
    </Box>
  );
}
```

### Integration with Other Components

```tsx
import { useState } from 'react';
import { Spinner, Button, Box, Text } from '@razorpay/blade/components';

function LoadingButtonExample() {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    // Simulate an API call
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <Box display="flex" flexDirection="column" gap="spacing.4" alignItems="flex-start">
      <Button onClick={handleClick} disabled={isLoading}>
        {isLoading ? (
          <>
            <Spinner size="medium" color="white" accessibilityLabel="Submitting form" />
            <Text marginLeft="spacing.2">Submitting...</Text>
          </>
        ) : (
          'Submit Form'
        )}
      </Button>

      {/* Inline spinner with text beside it */}
      <Box display="flex" alignItems="center">
        <Spinner size="medium" color="primary" accessibilityLabel="Loading orders" />
        <Text marginLeft="spacing.3">Loading your recent orders...</Text>
      </Box>
    </Box>
  );
}
```
