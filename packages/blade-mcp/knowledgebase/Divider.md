## Component Name

Divider

## Description

Divider is a visual element used to separate or divide content within a layout. It provides a clear visual distinction between different sections of content, enhancing readability and organization. The component supports both horizontal and vertical orientations, making it versatile for various UI patterns and layout requirements.

## TypeScript Types

The following types represent the props that the Divider component accepts. These allow you to properly configure the component according to your needs.

```typescript
/**
 * Props for the Divider component
 */
type DividerProps = {
  /**
   * The orientation of the divider
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
} & StyledPropsBlade &
  TestID;
```

## Examples

### Horizontal Divider

This example shows the default horizontal divider that separates text sections with vertical spacing.

```tsx
import { Divider, Box, Text } from '@razorpay/blade/components';

const HorizontalDividerExample = () => (
  <Box>
    <Text>Section One</Text>
    <Divider marginY="spacing.3" />
    <Text>Section Two</Text>
  </Box>
);
```

### Vertical Divider

This example demonstrates a vertical divider that separates inline content horizontally within a flex container.

```tsx
import { Divider, Box, Text } from '@razorpay/blade/components';

const VerticalDividerExample = () => (
  <Box display="flex" alignItems="center" height="40px">
    <Text>Left</Text>
    <Divider orientation="vertical" marginX="spacing.4" height="100%" />
    <Text>Right</Text>
  </Box>
);
```

### Styled Divider

This example shows how to customize dividers with different colors and thicknesses to create visual hierarchies.

```tsx
import { Divider, Box, Text } from '@razorpay/blade/components';

const StyledDividerExample = () => (
  <Box>
    <Text>Regular divider below</Text>
    <Divider marginY="spacing.2" />

    <Text>Colored divider below</Text>
    <Divider marginY="spacing.2" borderColor="border.primary" borderWidth="thick" />
  </Box>
);
```
