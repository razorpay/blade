## Component Name

Badge

## Description

Badges are small, color-coded UI elements used to display concise metadata, designed to draw user attention to important information. They offer visual categorization through different colors, sizes, and emphasis levels, making them ideal for status indicators, counts, or category labels.

## Important Constraints

- `children` prop is required and must contain text content
- `icon` prop only accepts `IconComponent`

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

## Usage Guidelines

**Do**

- Use `Badge` for non-interactive, color-coded metadata such as status labels, or category indicators.
- Use semantic `color` values (`positive`, `negative`, `notice`, `information`, `neutral`) to convey meaning — e.g. `positive` for success states, `negative` for errors.
- Use `emphasis="intense"` when the badge needs to stand out prominently (e.g. critical status); use `emphasis="subtle"` for secondary or supportive metadata.
- Keep badge labels short (1–2 words) — the text auto-truncates with a tooltip on overflow.
- Pair an `icon` with the label to reinforce meaning at a glance (e.g. `CheckCircleIcon` with a "Success" badge).
- Use `size="small"` or `size="xsmall"` when embedding badges inside dense UI like table rows or list items; use `size="medium"` or `size="large"` for standalone callouts.

**Don't**

- Don't use `Badge` for interactive elements — use `Tag` (removable/selectable metadata) or `Chip` (user-driven filter/action) instead.
- Don't use `Badge` as a clickable button or link — it is purely informational.
- Don't use icon-only badges without text — `children` (text) is always required.
- Don't use long sentences as badge labels — keep text concise and use title case or sentence case consistently.
- Don't rely solely on `color` to convey meaning — always include a text label (and optionally an icon) for accessibility.
- Don't mix `emphasis="intense"` badges alongside `emphasis="subtle"` for items of equal importance — keep emphasis consistent within the same visual group.

## Examples

### Badge Usage

This example demonstrates badges with key properties and styling.

```tsx
import React from 'react';
import { Badge, Box, InfoIcon, CheckCircleIcon } from '@razorpay/blade/components';

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
        icon={InfoIcon}
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
