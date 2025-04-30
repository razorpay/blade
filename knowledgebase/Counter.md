## Component Name

Counter

## Description

Counter is a visual indicator that displays numerical values, tallies, or counts within a specific context. It provides a compact way to show non-interactive numerical data, with customizable appearance through size, color, and emphasis variations. Counters are useful for displaying notification counts, item quantities, or status indicators throughout an interface.

## TypeScript Types

The following types represent the props that the Counter component accepts. These allow you to properly configure the component according to your needs.

```typescript
/**
 * Props for the Counter component
 */
type CounterProps = {
  /**
   * The numerical value to display
   */
  value: number;

  /**
   * Maximum value to display before showing a "+" suffix
   * If value exceeds max, it will display "{max}+"
   * @example max={99} with value={120} would display "99+"
   */
  max?: number;

  /**
   * Visual color of the counter
   * @default "neutral"
   */
  color?: 'positive' | 'negative' | 'notice' | 'information' | 'neutral' | 'primary';

  /**
   * Visual emphasis/intensity of the counter
   * @default "subtle"
   */
  emphasis?: 'subtle' | 'intense';

  /**
   * Size of the counter
   * @default "medium"
   */
  size?: 'small' | 'medium' | 'large';
} & StyledPropsBlade &
  TestID;
```

## Example

```tsx
import React from 'react';
import { Counter, Box, Text } from '@razorpay/blade/components';

const CounterExample = () => {
  return (
    <Box padding="spacing.4">
      <Text marginBottom="spacing.4">Counter Component Examples</Text>

      <Box display="flex" flexWrap="wrap" gap="spacing.4">
        <Counter value={8} size="small" color="primary" />
        <Counter value={24} size="medium" color="positive" />
        <Counter value={42} size="small" color="negative" emphasis="intense" />
        <Counter value={1000} max={99} color="negative" emphasis="subtle" size="large" />
      </Box>
    </Box>
  );
};

export default CounterExample;
```
