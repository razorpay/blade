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

This example demonstrates how to use the Spinner component to indicate a loading state, with a timer that simulates content loading for 3 seconds before displaying a success message.

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
