## Component Name

Badge

## Description

Badges are small, color-coded UI elements used to display concise metadata, designed to draw user attention to important information. They offer visual categorization through different colors, sizes, and emphasis levels, making them ideal for status indicators, counts, or category labels.

## TypeScript Types

The following types represent the props that the Badge component accepts. These types allow you to properly configure the component according to your needs.

```typescript
// Main Badge component props
type BadgeProps = {
  /**
   * Sets the label for the badge.
   */
  children: StringChildrenType;
  /**
   * Sets the color of the badge.
   * @default 'neutral'
   */
  color?: FeedbackColors | 'primary';
  /**
   * Sets the contrast of the badge.
   * @default 'subtle'
   */
  emphasis?: SubtleOrIntense;
  /**
   * Sets the size of the badge.
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Icon to be displayed in the badge.
   * Accepts a component of type `IconComponent` from Blade.
   */
  icon?: IconComponent;
  /**
   * Test ID that can be used to select element in testing environments
   */
  testID?: string;
} & StyledPropsBlade &
  DataAnalyticsAttribute;
```

## Examples

### Badge Usage
This example demonstrates badges with key properties and styling.

```tsx
import React from 'react';
import { Badge, Box, InfoIcon, CheckCircleIcon, WarningIcon } from '@razorpay/blade/components';

const BadgeExample = () => {
  return (
    <Box display="flex" gap="spacing.4">
      <Badge color="primary" emphasis="subtle" icon={InfoIcon} size="small">
        Info
      </Badge>

      <Badge
        color="positive"
        emphasis="intense"
        icon={CheckCircleIcon}
        size="medium"
        data-analytics-section="status"
        testID="success-badge"
      >
        Success
      </Badge>

      <Badge
        color="notice"
        emphasis="subtle"
        icon={WarningIcon}
        size="large"
        marginLeft="spacing.2"
        display="inline-flex"
      >
        Warning
      </Badge>
    </Box>
  );
};

export default BadgeExample;
```
