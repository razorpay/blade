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
   * Sets the orientation of divider
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';

  /**
   * Sets the style of divider
   * @default 'solid'
   */
  dividerStyle?: 'solid' | 'dashed';

  /**
   * Sets the variant of divider
   * @default 'muted'
   */
  variant?: 'normal' | 'subtle' | 'muted';

  /**
   * Sets the thickness of divider
   * @default 'thin'
   */
  thickness?: 'thinner' | 'thin' | 'thick' | 'thicker';

  /**
   * Sets the height of divider. Divider uses Flex by default, use height only when parent is not flex.
   */
  height?: CSSObject['height'];

  /**
   * Sets the width of divider. Divider uses Flex by default, use width only when parent is not flex.
   */
  width?: CSSObject['width'];
} & StyledPropsBlade &
  TestID;
```

## Examples

This example demonstrates all the key features of the Divider component including orientation, style variants, thickness options, and custom dimensions.

```tsx
import { Divider, Box, Text } from '@razorpay/blade/components';

const DividerExample = () => (
  <Box>
    {/* Default horizontal divider */}
    <Text>Section One</Text>
    <Divider marginY="spacing.3" />

    {/* Dashed style with variants */}
    <Text>Section Two</Text>
    <Divider dividerStyle="dashed" variant="subtle" marginY="spacing.3" />

    {/* Thick divider */}
    <Text>Section Three</Text>
    <Divider variant="normal" thickness="thick" marginY="spacing.3" />

    {/* Vertical divider in flex container */}
    <Box display="flex" alignItems="center">
      <Text>Left</Text>
      <Divider orientation="vertical" marginX="spacing.4" height="100%" />
      <Text>Right</Text>
    </Box>
  </Box>
);
```
