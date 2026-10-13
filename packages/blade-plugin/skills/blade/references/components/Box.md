## Component Name

Box

## Description

Box is a versatile layout primitive component that serves as the foundational building block for creating complex layouts in Blade applications. It provides a comprehensive set of styling and layout properties through a consistent prop-based API, supporting responsive design, flexbox layouts, and styled-system patterns. Box allows developers to create consistent layouts without writing custom CSS while maintaining design system constraints.

## Important Constraints

- `backgroundColor` prop only accepts `transparent`, `surface.background.*`, and `overlay.*` tokens

## Design Guidelines

- Prefer `Card` component instead of this for adding card with shadows. Box component should be primarily used for non-visual layouts (e.g. creating containers, grids, positioning items, etc)

## TypeScript Types

The following types represent the props that the Box component accepts. These types allow you to properly configure the component according to your needs.

```typescript
/**
 * Type for responsive values, allowing different values at different breakpoints
 */
type ResponsiveValue<T> =
  | T
  | {
      base?: T;
      xs?: T;
      s?: T;
      m?: T;
      l?: T;
      xl?: T;
    };

/**
 * Spacing token (e.g. 'spacing.0' to 'spacing.11'), a CSS size string (e.g. '100px', '50%'),
 * or a keyword: 'none' | 'initial' | 'auto' | 'fit-content' | 'max-content' | 'min-content'
 */
type SpacingValueType = `spacing.${number}` | 'none' | 'initial' | 'auto' | 'fit-content' | 'max-content' | 'min-content' | (string & {});

/**
 * Background color token of shape `surface.background.*`, `overlay.background.*`, `feedback.background.*`
 * @example 'surface.background.gray.intense' | 'feedback.background.positive.subtle' | 'transparent'
 */
type BoxBackgroundColor = `surface.background.${string}` | `overlay.background.${string}` | `feedback.background.${string}` | 'transparent';

/**
 * Border color token of shape `surface.border.*`, `popup.border.*`, `interactive.border.*`
 * @example 'surface.border.gray.muted'
 */
type BoxBorderColor = `surface.border.${string}` | `popup.border.${string}` | `interactive.border.${string}`;

type BorderRadiusToken = 'none' | '2xsmall' | 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge' | 'max' | 'round';
type BorderWidthToken = 'none' | 'thinner' | 'thin' | 'thick' | 'thicker';

/**
 * Props for the Box component
 */
type BoxProps = {
  /**
   * The HTML element to render the Box as. Not supported on React Native.
   * @default 'div'
   */
  as?: 'div' | 'section' | 'footer' | 'header' | 'main' | 'aside' | 'nav' | 'span' | 'label';

  /**
   * ID attribute of the Box
   */
  id?: string;

  /**
   * Tab index of the Box
   */
  tabIndex?: number;

  /**
   * The children to render inside the Box
   */
  children?: React.ReactNode | React.ReactNode[];

  /**
   * Flexbox properties
   */
  display?: ResponsiveValue<string>;
  flex?: ResponsiveValue<string | number>;
  flexDirection?: ResponsiveValue<'row' | 'column' | 'row-reverse' | 'column-reverse'>;
  flexWrap?: ResponsiveValue<'nowrap' | 'wrap' | 'wrap-reverse'>;
  flexBasis?: ResponsiveValue<string | number>;
  flexGrow?: ResponsiveValue<number>;
  flexShrink?: ResponsiveValue<number>;
  alignItems?: ResponsiveValue<'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch' | 'start' | 'end' | 'normal'>;
  alignContent?: ResponsiveValue<string>;
  alignSelf?: ResponsiveValue<string>;
  justifyContent?: ResponsiveValue<'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly' | 'start' | 'end' | 'left' | 'right' | 'normal' | 'stretch'>;
  justifyItems?: ResponsiveValue<string>;
  justifySelf?: ResponsiveValue<string>;
  placeItems?: ResponsiveValue<string>;
  placeSelf?: ResponsiveValue<string>;
  order?: ResponsiveValue<number>;
  /**
   * Uses the native gap property
   */
  gap?: ResponsiveValue<SpacingValueType>;
  rowGap?: ResponsiveValue<SpacingValueType>;
  columnGap?: ResponsiveValue<SpacingValueType>;

  /**
   * Grid properties
   */
  grid?: ResponsiveValue<string>;
  gridTemplate?: ResponsiveValue<string>;
  gridTemplateAreas?: ResponsiveValue<string>;
  gridTemplateColumns?: ResponsiveValue<string>;
  gridTemplateRows?: ResponsiveValue<string>;
  gridAutoFlow?: ResponsiveValue<string>;
  gridAutoRows?: ResponsiveValue<string>;
  gridAutoColumns?: ResponsiveValue<string>;
  gridArea?: ResponsiveValue<string>;
  gridColumn?: ResponsiveValue<string>;
  gridRow?: ResponsiveValue<string>;
  gridColumnStart?: ResponsiveValue<string>;
  gridColumnEnd?: ResponsiveValue<string>;
  gridRowStart?: ResponsiveValue<string>;
  gridRowEnd?: ResponsiveValue<string>;

  /**
   * Margin properties
   */
  margin?: ResponsiveValue<SpacingValueType>;
  marginTop?: ResponsiveValue<SpacingValueType>;
  marginRight?: ResponsiveValue<SpacingValueType>;
  marginBottom?: ResponsiveValue<SpacingValueType>;
  marginLeft?: ResponsiveValue<SpacingValueType>;
  marginX?: ResponsiveValue<SpacingValueType>;
  marginY?: ResponsiveValue<SpacingValueType>;

  /**
   * Padding properties
   */
  padding?: ResponsiveValue<SpacingValueType>;
  paddingTop?: ResponsiveValue<SpacingValueType>;
  paddingRight?: ResponsiveValue<SpacingValueType>;
  paddingBottom?: ResponsiveValue<SpacingValueType>;
  paddingLeft?: ResponsiveValue<SpacingValueType>;
  paddingX?: ResponsiveValue<SpacingValueType>;
  paddingY?: ResponsiveValue<SpacingValueType>;

  /**
   * Layout properties
   */
  width?: ResponsiveValue<SpacingValueType>;
  height?: ResponsiveValue<SpacingValueType>;
  minWidth?: ResponsiveValue<SpacingValueType>;
  minHeight?: ResponsiveValue<SpacingValueType>;
  maxWidth?: ResponsiveValue<SpacingValueType>;
  maxHeight?: ResponsiveValue<SpacingValueType>;
  overflow?: ResponsiveValue<'visible' | 'hidden' | 'clip' | 'scroll' | 'auto'>;
  overflowX?: ResponsiveValue<'visible' | 'hidden' | 'clip' | 'scroll' | 'auto'>;
  overflowY?: ResponsiveValue<'visible' | 'hidden' | 'clip' | 'scroll' | 'auto'>;
  textAlign?: ResponsiveValue<'left' | 'right' | 'center' | 'justify' | 'start' | 'end'>;
  whiteSpace?: ResponsiveValue<string>;

  /**
   * Position properties
   */
  position?: ResponsiveValue<'static' | 'relative' | 'absolute' | 'fixed' | 'sticky'>;
  top?: ResponsiveValue<SpacingValueType>;
  right?: ResponsiveValue<SpacingValueType>;
  bottom?: ResponsiveValue<SpacingValueType>;
  left?: ResponsiveValue<SpacingValueType>;
  zIndex?: ResponsiveValue<number>;

  /**
   * Background properties
   */
  backgroundColor?: ResponsiveValue<BoxBackgroundColor>;
  backgroundImage?: ResponsiveValue<string>;
  backgroundSize?: ResponsiveValue<string>;
  backgroundPosition?: ResponsiveValue<string>;
  backgroundOrigin?: ResponsiveValue<string>;
  backgroundRepeat?: ResponsiveValue<string>;
  backdropFilter?: ResponsiveValue<string>;

  /**
   * Border properties. Use tokens for radius, width and color.
   */
  borderRadius?: ResponsiveValue<BorderRadiusToken>;
  borderTopLeftRadius?: ResponsiveValue<BorderRadiusToken>;
  borderTopRightRadius?: ResponsiveValue<BorderRadiusToken>;
  borderBottomRightRadius?: ResponsiveValue<BorderRadiusToken>;
  borderBottomLeftRadius?: ResponsiveValue<BorderRadiusToken>;
  borderWidth?: ResponsiveValue<BorderWidthToken>;
  borderTopWidth?: ResponsiveValue<BorderWidthToken>;
  borderRightWidth?: ResponsiveValue<BorderWidthToken>;
  borderBottomWidth?: ResponsiveValue<BorderWidthToken>;
  borderLeftWidth?: ResponsiveValue<BorderWidthToken>;
  borderColor?: ResponsiveValue<BoxBorderColor>;
  borderTopColor?: ResponsiveValue<`surface.border.${string}`>;
  borderRightColor?: ResponsiveValue<`surface.border.${string}`>;
  borderBottomColor?: ResponsiveValue<`surface.border.${string}`>;
  borderLeftColor?: ResponsiveValue<`surface.border.${string}`>;
  borderStyle?: ResponsiveValue<'none' | 'hidden' | 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset'>;
  borderTopStyle?: ResponsiveValue<string>;
  borderRightStyle?: ResponsiveValue<string>;
  borderBottomStyle?: ResponsiveValue<string>;
  borderLeftStyle?: ResponsiveValue<string>;

  /**
   * Elevation - applies box-shadow based on theme elevation tokens
   */
  elevation?: ResponsiveValue<'none' | 'lowRaised' | 'midRaised' | 'highRaised'>;

  /**
   * Other visual properties
   */
  opacity?: ResponsiveValue<number | string>;
  visibility?: ResponsiveValue<'visible' | 'hidden' | 'collapse'>;
  pointerEvents?: ResponsiveValue<string>;
  transform?: ResponsiveValue<string>;
  transformOrigin?: ResponsiveValue<string>;
  transition?: ResponsiveValue<string>;
  clipPath?: ResponsiveValue<string>;

  /**
   * Event handlers (web only)
   */
  onMouseOver?: React.MouseEventHandler<HTMLElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLElement>;
  onScroll?: React.UIEventHandler<HTMLElement>;

  /**
   * Drag and drop (web only)
   */
  draggable?: boolean;
  onDragStart?: React.DragEventHandler<HTMLElement>;
  onDragEnd?: React.DragEventHandler<HTMLElement>;
  onDragEnter?: React.DragEventHandler<HTMLElement>;
  onDragOver?: React.DragEventHandler<HTMLElement>;
  onDragLeave?: React.DragEventHandler<HTMLElement>;
  onDrop?: React.DragEventHandler<HTMLElement>;

  /**
   * Element timing attribute to track the render performance of the element
   */
  elementtiming?: string;
} & TestID &
  DataAnalyticsAttribute;

/**
 * Type for Box ref
 */
type BoxRefType = HTMLElement;
```

## Usage Guidelines

**Do**

- Use `Box` as the foundational layout primitive for creating flex/grid layouts, spacing, and positioning.
- Use the `as` prop for semantic HTML rendering (`section`, `nav`, `main`, `header`, `footer`, `aside`).
- Use responsive value objects (e.g., `flexDirection={{ base: 'column', m: 'row' }}`) for mobile-first responsive design.
- Use `elevation` prop for visual depth (`lowRaised`, `midRaised`, `highRaised`).
- Use `backgroundColor` only with approved tokens: `transparent`, `surface.background.*`, or `overlay.*`.

**Don't**

- Don't use `Box` as a visual card surface with elevation — use `Card` component instead, which provides built-in header/body/footer structure.
- Don't pass arbitrary color tokens to `backgroundColor` — only `surface.background.*` and `overlay.*` tokens are accepted.
- Don't use `as` prop on React Native — it's only supported on web.
- Don't add custom CSS classes — use Box's prop-based API for all styling.
- Don't nest deeply for simple spacing — prefer `gap`, `padding`, and `margin` props.

## Example

Here are comprehensive examples demonstrating the versatility of the Box component:

### Responsive Layout with Flexbox and Styling

This example demonstrates a responsive layout with flexbox properties, styling, and elevation.

```tsx
import React from 'react';
import { Box, Text, Heading, Button, RazorpayIcon } from '@razorpay/blade/components';

const ResponsiveLayout = () => {
  return (
    <Box
      // Responsive container with padding that changes at different breakpoints
      padding={{ base: 'spacing.3', m: 'spacing.5' }}
      backgroundColor="surface.background.gray.intense"
      borderRadius="large"
      width="100%"
      maxWidth="800px"
      margin={{ base: 'spacing.0', m: 'auto' }}
    >
      <Heading size="large" marginBottom="spacing.5">
        Responsive Layout
      </Heading>

      {/* Responsive grid */}
      <Box
        display="flex"
        flexDirection={{ base: 'column', m: 'row' }}
        flexWrap="wrap"
        gap="spacing.4"
      >
        <Box
          flex={{ base: 1, m: 1 }}
          flexBasis={{ base: '100%', m: '45%' }}
          backgroundColor="surface.background.gray.intense"
          borderRadius="medium"
          padding="spacing.4"
          elevation="lowRaised"
          overflow="hidden"
          position="relative"
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            marginBottom="spacing.3"
          >
            <Heading size="small">Basic Plan</Heading>
            <Box
              backgroundColor="surface.background.primary.subtle"
              padding="spacing.2"
              borderRadius="round"
            >
              <RazorpayIcon size="medium" />
            </Box>
          </Box>

          <Text marginBottom="spacing.3">
            Perfect for individuals and small teams getting started with our platform.
          </Text>

          <Box marginY="spacing.3">
            <Box display="flex" justifyContent="space-between" marginBottom="spacing.2">
              <Text>Storage</Text>
              <Text>10GB</Text>
            </Box>
            <Box display="flex" justifyContent="space-between" marginBottom="spacing.2">
              <Text>Users</Text>
              <Text>Up to 5</Text>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Text>Support</Text>
              <Text>Email</Text>
            </Box>
          </Box>

          <Box marginTop="spacing.4">
            <Button variant="secondary" isFullWidth>
              Choose Plan
            </Button>
          </Box>
        </Box>

        <Box
          flex={{ base: 1, m: 1 }}
          flexBasis={{ base: '100%', m: '45%' }}
          backgroundColor="surface.background.primary.intense"
          borderRadius="medium"
          padding="spacing.4"
          elevation="midRaised"
          overflow="hidden"
          position="relative"
        >
          <Box
            position="absolute"
            top="spacing.2"
            right="spacing.2"
            backgroundColor="surface.background.primary.subtle"
            borderRadius="medium"
            padding="spacing.2"
          >
            <Text size="small" color="interactive.text.primary.normal">
              Popular
            </Text>
          </Box>

          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            marginBottom="spacing.3"
          >
            <Text weight="semibold">Pro Plan</Text>
            <Box
              backgroundColor="surface.background.gray.intense"
              padding="spacing.2"
              borderRadius="round"
            >
              <RazorpayIcon size="medium" color="surface.icon.staticWhite.normal" />
            </Box>
          </Box>

          <Text marginBottom="spacing.3">
            Enhanced features for growing businesses and professional teams.
          </Text>

          <Box marginY="spacing.3">
            <Box display="flex" justifyContent="space-between" marginBottom="spacing.2">
              <Text>Storage</Text>
              <Text>100GB</Text>
            </Box>
            <Box display="flex" justifyContent="space-between" marginBottom="spacing.2">
              <Text>Users</Text>
              <Text>Up to 20</Text>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Text>Support</Text>
              <Text>Priority</Text>
            </Box>
          </Box>

          <Box marginTop="spacing.4">
            <Button variant="primary" isFullWidth>
              Choose Plan
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ResponsiveLayout;
```

### Advanced Positioning and Transformations

This example demonstrates how to use Box with advanced positioning techniques, transformations, and custom styling.

```tsx
import React from 'react';
import { Box, Text, Button } from '@razorpay/blade/components';

const AdvancedPositioningExample = () => {
  return (
    <Box
      // Container for the example
      position="relative"
      height="400px"
      width="100%"
      backgroundColor="surface.background.gray.intense"
      borderRadius="large"
      overflow="hidden"
      padding="spacing.5"
    >
      {/* Background decorative elements */}
      <Box
        position="absolute"
        top="-50px"
        right="-50px"
        width="200px"
        height="200px"
        borderRadius="round"
        backgroundColor="surface.background.primary.subtle"
        clipPath="circle(50% at 50% 50%)"
      />

      <Box
        position="absolute"
        bottom="-30px"
        left="20%"
        width="150px"
        height="150px"
        borderRadius="round"
        backgroundColor="surface.background.cloud.subtle"
        transform="rotate(45deg)"
      />

      {/* Content container */}
      <Box
        position="relative"
        zIndex={1} // Ensures content is above background elements
        display="flex"
        flexDirection="column"
        height="100%"
      >
        <Text variant="body" size="large" marginBottom="spacing.5">
          Advanced positioning example
        </Text>

        {/* Box with transformation */}
        <Box
          backgroundColor="surface.background.gray.subtle"
          borderRadius="medium"
          padding="spacing.4"
          elevation="midRaised"
          marginBottom="spacing.5"
          transform="rotate(-2deg)"
          transformOrigin="center"
        >
          <Text>This box has a slight rotation applied to create visual interest.</Text>
        </Box>

        {/* Overlapping elements */}
        <Box position="relative" height="100px" marginBottom="spacing.4">
          <Box
            position="absolute"
            left="spacing.0"
            top="spacing.0"
            width="80px"
            height="80px"
            backgroundColor="surface.background.primary.intense"
            borderRadius="medium"
            display="flex"
            alignItems="center"
            justifyContent="center"
            zIndex={1}
          >
            <Text>Box 1</Text>
          </Box>

          <Box
            position="absolute"
            left="40px"
            top="20px"
            width="80px"
            height="80px"
            backgroundColor="surface.background.cloud.intense"
            borderRadius="medium"
            display="flex"
            alignItems="center"
            justifyContent="center"
            zIndex={2}
          >
            <Text color="surface.text.onCloud.onIntense">Box 2</Text>
          </Box>

          <Box
            position="absolute"
            left="80px"
            top="40px"
            width="80px"
            height="80px"
            backgroundColor="surface.background.gray.intense"
            borderRadius="medium"
            display="flex"
            alignItems="center"
            justifyContent="center"
            zIndex={3}
          >
            <Text>Box 3</Text>
          </Box>
        </Box>

        {/* Custom shape using clipPath */}
        <Box
          height="80px"
          backgroundColor="surface.background.primary.subtle"
          padding="spacing.4"
          clipPath="polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%)"
          display="flex"
          alignItems="center"
        >
          <Text>Custom shape using clipPath</Text>
        </Box>
      </Box>
    </Box>
  );
};

export default AdvancedPositioningExample;
```

### Responsive Grid Layout with Event Handling

This example demonstrates a responsive grid layout with event handlers.

```tsx
import React, { useState } from 'react';
import { Box, Text, Heading } from '@razorpay/blade/components';

const ResponsiveGridExample = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

  const handleDrop = (e: React.DragEvent, destinationIndex: number) => {
    e.preventDefault();
    if (draggedItem !== null) {
      console.log(`Moved item from index ${draggedItem} to ${destinationIndex}`);
    }
    setDraggedItem(null);
  };

  const gridItems: Array<{
    title: string;
    color:
      | 'surface.background.primary.intense'
      | 'surface.background.cloud.intense'
      | 'surface.background.primary.subtle'
      | 'surface.background.gray.intense'
      | 'surface.background.gray.moderate'
      | 'surface.background.cloud.subtle';
  }> = [
    { title: 'Analytics', color: 'surface.background.primary.intense' },
    { title: 'Customers', color: 'surface.background.cloud.intense' },
    { title: 'Payments', color: 'surface.background.primary.subtle' },
    { title: 'Products', color: 'surface.background.gray.intense' },
    { title: 'Settings', color: 'surface.background.gray.moderate' },
    { title: 'Reports', color: 'surface.background.cloud.subtle' },
  ];

  return (
    <Box
      // Container
      padding="spacing.5"
      backgroundColor="surface.background.gray.intense"
      borderRadius="large"
    >
      <Heading size="large" marginBottom="spacing.5">
        Responsive Grid Layout
      </Heading>

      <Text marginBottom="spacing.4">
        This grid adapts to screen size and supports hover effects and drag-and-drop.
      </Text>

      {/* Grid container */}
      <Box display="flex" flexWrap="wrap" gap="spacing.4">
        {gridItems.map((item, index) => (
          <Box
            key={index}
            // Responsive sizing
            flex={1}
            flexBasis={{ base: '100%', s: 'calc(50% - 8px)', m: 'calc(33.333% - 16px)' }}
            backgroundColor={item.color}
            borderRadius="medium"
            padding="spacing.4"
            // Elevation changes on hover
            elevation={hoveredIndex === index ? 'highRaised' : 'lowRaised'}
            // Transform on hover
            transform={hoveredIndex === index ? 'translateY(-4px)' : 'none'}
            // Drag and drop handlers
            draggable
            onDragStart={(e) => {
              setDraggedItem(index);
              e.dataTransfer.setData('text/plain', index.toString());
            }}
            onDragEnd={() => setDraggedItem(null)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, index)}
            // Mouse event handlers
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <Text
              color={
                item.color.includes('primary.intense') || item.color.includes('gray.intense')
                  ? 'surface.text.staticWhite.normal'
                  : 'surface.text.gray.normal'
              }
              weight="semibold"
            >
              {item.title}
            </Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ResponsiveGridExample;
```
