## Component Name

Indicator

## Description

Indicators are visual elements that describe the condition of an entity. They are used to convey semantic meaning, such as statuses and semantical categories. Indicators can appear with or without text labels and in different emphasis levels (subtle or intense). They provide visual feedback to users through color-coded dot indicators and can be combined with other components through absolute positioning.

## TypeScript Types

The following types define the props that the Indicator component accepts. These types should be used when implementing the Indicator component in your application.

```typescript
type IndicatorProps = {
  /**
   * Sets the color tone
   *
   * @default neutral
   */
  color?: FeedbackColors | 'primary';

  /**
   * Sets the emphasis of the indicator
   *
   * If set to intense it will show a background circle
   *
   * @default subtle
   */
  emphasis?: 'subtle' | 'intense';

  /**
   * Size of the indicator
   *
   * @default medium
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * A text label to show alongside the indicator dot
   */
  children?: StringChildrenType;
  /**
   * a11y label for screen readers
   */
  accessibilityLabel?: string;
} & TestID &
  DataAnalyticsAttribute &
  StyledPropsBlade;
```

Where:
- `FeedbackColors` is a union type of possible feedback colors
- `StringChildrenType` represents text content that can be passed as children
- `TestID` provides test identifiers for testing frameworks
- `DataAnalyticsAttribute` adds data attributes for analytics tracking
- `StyledPropsBlade` includes styled-system props for flexible styling

## Example

This example demonstrates different variations of the Indicator component showing positive, negative, and notice states with different emphasis levels and text options.

```tsx
import { Indicator, Box } from '@razorpay/blade/components';

function IndicatorExample() {
  return (
    <Box display="flex" flexDirection="row" gap="spacing.4" alignItems="center">
      {/* Basic usage with text */}
      <Indicator accessibilityLabel="Status positive" color="positive" size="medium">
        Success
      </Indicator>

      {/* Without text */}
      <Indicator accessibilityLabel="Status negative" color="negative" />

      {/* With intense emphasis */}
      <Indicator accessibilityLabel="Status notice" color="notice" emphasis="intense" />
    </Box>
  );
}
```
