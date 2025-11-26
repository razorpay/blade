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
    <Divider marginY="spacing.2" variant="normal" thickness="thick" />
  </Box>
);
```

### Divider with Different Styles and Variants

This example demonstrates divider styles (solid/dashed), variants (normal/subtle/muted), and thickness options.

```tsx
import { Divider, Box, Text } from '@razorpay/blade/components';

const DividerVariantsExample = () => (
  <Box>
    <Text>Dashed divider</Text>
    <Divider dividerStyle="dashed" marginY="spacing.2" />

    <Text>Subtle variant with thick thickness</Text>
    <Divider variant="subtle" thickness="thick" marginY="spacing.2" />

    <Text>Dashed with normal variant</Text>
    <Divider dividerStyle="dashed" variant="normal" thickness="thicker" marginY="spacing.2" />
  </Box>
);
```
