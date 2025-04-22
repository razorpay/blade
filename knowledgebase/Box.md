## Component Name
Box

## Description
Box is a versatile layout primitive component that serves as the foundational building block for creating complex layouts in Blade applications. It provides a comprehensive set of styling and layout properties through a consistent prop-based API, supporting responsive design, flexbox layouts, and styled-system patterns. Box allows developers to create consistent layouts without writing custom CSS while maintaining design system constraints.

## TypeScript Types
The following types represent the props that the Box component accepts. These types allow you to properly configure the component according to your needs.

```typescript
/**
 * Props for the Box component
 */
type BoxProps = {
  /**
   * The HTML element to render the Box as
   * @default 'div'
   */
  as?: 'div' | 'section' | 'article' | 'main' | 'header' | 'footer' | 'aside' | 'nav' | 'form' | React.ComponentType<any>;

  /**
   * ID attribute of the Box
   */
  id?: string;

  /**
   * The children to render inside the Box
   */
  children?: React.ReactNode;

  /**
   * Flex property - defines how the item will grow or shrink
   * @example "1" | "auto" | "initial" | "none"
   */
  flex?: ResponsiveValue<string | number>;

  /**
   * Flex direction property - defines the direction of the flex items
   * @example "row" | "column" | "row-reverse" | "column-reverse" 
   */
  flexDirection?: ResponsiveValue<string>;

  /**
   * Flex wrap property - defines whether flex items should wrap
   * @example "nowrap" | "wrap" | "wrap-reverse"
   */
  flexWrap?: ResponsiveValue<string>;

  /**
   * Flex basis property - defines the initial main size of a flex item
   */
  flexBasis?: ResponsiveValue<string | number>;

  /**
   * Flex grow property - defines how much a flex item will grow
   */
  flexGrow?: ResponsiveValue<string | number>;

  /**
   * Flex shrink property - defines how much a flex item will shrink
   */
  flexShrink?: ResponsiveValue<string | number>;

  /**
   * Display property - defines the display type of an element
   * @example "flex" | "block" | "inline" | "inline-block" | "grid" | "none"
   */
  display?: ResponsiveValue<string>;

  /**
   * Align items property - defines how flex items are aligned along the cross axis
   * @example "flex-start" | "flex-end" | "center" | "baseline" | "stretch"
   */
  alignItems?: ResponsiveValue<string>;

  /**
   * Align self property - overrides the align-items property for a specific flex item
   */
  alignSelf?: ResponsiveValue<string>;

  /**
   * Justify content property - defines how flex items are aligned along the main axis
   * @example "flex-start" | "flex-end" | "center" | "space-between" | "space-around" | "space-evenly"
   */
  justifyContent?: ResponsiveValue<string>;

  /**
   * Gap property - defines the gap between flex/grid items
   */
  gap?: ResponsiveValue<string>;

  /**
   * Margin properties
   */
  margin?: ResponsiveValue<string>;
  marginTop?: ResponsiveValue<string>;
  marginRight?: ResponsiveValue<string>;
  marginBottom?: ResponsiveValue<string>;
  marginLeft?: ResponsiveValue<string>;
  marginX?: ResponsiveValue<string>;
  marginY?: ResponsiveValue<string>;

  /**
   * Padding properties
   */
  padding?: ResponsiveValue<string>;
  paddingTop?: ResponsiveValue<string>;
  paddingRight?: ResponsiveValue<string>;
  paddingBottom?: ResponsiveValue<string>;
  paddingLeft?: ResponsiveValue<string>;
  paddingX?: ResponsiveValue<string>;
  paddingY?: ResponsiveValue<string>;

  /**
   * Width property
   * @example "100%" | "200px" | "auto" | "fit-content"
   */
  width?: ResponsiveValue<string | number>;

  /**
   * Height property
   * @example "100%" | "200px" | "auto" | "fit-content" 
   */
  height?: ResponsiveValue<string | number>;

  /**
   * Min-width property
   */
  minWidth?: ResponsiveValue<string | number>;

  /**
   * Min-height property
   */
  minHeight?: ResponsiveValue<string | number>;

  /**
   * Max-width property
   */
  maxWidth?: ResponsiveValue<string | number>;

  /**
   * Max-height property
   */
  maxHeight?: ResponsiveValue<string | number>;

  /**
   * Background color property
   * Uses theme color tokens
   * @example "surface.background.gray.intense"
   */
  backgroundColor?: ResponsiveValue<string>;

  /**
   * Border properties
   */
  border?: ResponsiveValue<string>;
  borderTop?: ResponsiveValue<string>;
  borderRight?: ResponsiveValue<string>;
  borderBottom?: ResponsiveValue<string>;
  borderLeft?: ResponsiveValue<string>;
  borderColor?: ResponsiveValue<string>;
  borderRadius?: ResponsiveValue<string>;
  borderStyle?: ResponsiveValue<string>;
  borderWidth?: ResponsiveValue<string>;

  /**
   * Position property
   * @example "static" | "relative" | "absolute" | "fixed" | "sticky"
   */
  position?: ResponsiveValue<string>;

  /**
   * Top, right, bottom, left properties for positioning
   */
  top?: ResponsiveValue<string | number>;
  right?: ResponsiveValue<string | number>;
  bottom?: ResponsiveValue<string | number>;
  left?: ResponsiveValue<string | number>;

  /**
   * Z-index property
   */
  zIndex?: ResponsiveValue<number | string>;

  /**
   * Overflow properties
   */
  overflow?: ResponsiveValue<string>;
  overflowX?: ResponsiveValue<string>;
  overflowY?: ResponsiveValue<string>;

  /**
   * Elevation - applies box-shadow based on theme elevation tokens
   * @example "lowRaised" | "midRaised" | "highRaised"
   */
  elevation?: 'lowRaised' | 'midRaised' | 'highRaised';

  /**
   * Transform property
   */
  transform?: string;

  /**
   * Transform origin property
   */
  transformOrigin?: string;

  /**
   * Clip path property
   */
  clipPath?: string;

  /**
   * Event handlers
   */
  onClick?: React.MouseEventHandler;
  onMouseOver?: React.MouseEventHandler;
  onMouseEnter?: React.MouseEventHandler;
  onMouseLeave?: React.MouseEventHandler;
  onScroll?: React.UIEventHandler;
  onDragStart?: React.DragEventHandler;
  onDragEnd?: React.DragEventHandler;
  onDragEnter?: React.DragEventHandler;
  onDragOver?: React.DragEventHandler;
  onDragLeave?: React.DragEventHandler;
  onDrop?: React.DragEventHandler;
} & TestID & DataAnalyticsAttribute;

/**
 * Type for responsive values, allowing different values at different breakpoints
 */
type ResponsiveValue<T> = T | {
  base?: T;
  s?: T;
  m?: T;
  l?: T;
  xl?: T;
};

/**
 * Type for test ID
 */
type TestID = {
  /**
   * ID used for testing
   */
  testID?: string;
};

/**
 * Type for data analytics attributes
 */
type DataAnalyticsAttribute = {
  /**
   * Data analytics attribute
   */
  'data-analytics'?: string;
};

/**
 * Type for Box ref
 */
type BoxRefType = HTMLElement;
```

## Example
Here are comprehensive examples demonstrating the versatility of the Box component:

### Responsive Layout with Flexbox and Styling

This example demonstrates a responsive card layout with flexbox properties, styling, and elevation.

```tsx
import React from 'react';
import { Box, Text, Heading, Button } from '@razorpay/blade/components';
import { RazorpayIcon } from '@razorpay/blade/components/Icons';

const ResponsiveCardLayout = () => {
  return (
    <Box 
      // Responsive container with padding that changes at different breakpoints
      padding={{ base: 'spacing.3', m: 'spacing.5' }}
      backgroundColor="surface.background.gray.subtle"
      borderRadius="large"
      width="100%"
      maxWidth="800px"
      margin="0 auto"
    >
      <Heading size="large" marginBottom="spacing.5">Responsive Card Layout</Heading>
      
      {/* Responsive card grid */}
      <Box 
        display="flex" 
        flexDirection={{ base: 'column', m: 'row' }}
        flexWrap="wrap"
        gap="spacing.4"
      >
        {/* Card 1 */}
        <Box 
          flex={{ base: 1, m: 1 }}
          flexBasis={{ base: '100%', m: '45%' }}
          backgroundColor="surface.background.gray.normal"
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
              borderRadius="circle"
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
            <Button variant="secondary" isFullWidth>Choose Plan</Button>
          </Box>
        </Box>
        
        {/* Card 2 */}
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
            padding="spacing.1 spacing.2"
          >
            <Text size="small" color="interactive.text.primary.normal">Popular</Text>
          </Box>
          
          <Box 
            display="flex" 
            alignItems="center" 
            justifyContent="space-between"
            marginBottom="spacing.3"
          >
            <Heading size="small" color="surface.text.staticWhite.normal">Pro Plan</Heading>
            <Box 
              backgroundColor="surface.background.gray.intense"
              padding="spacing.2"
              borderRadius="circle"
            >
              <RazorpayIcon size="medium" color="surface.icon.staticWhite.normal" />
            </Box>
          </Box>
          
          <Text marginBottom="spacing.3" color="surface.text.staticWhite.normal">
            Enhanced features for growing businesses and professional teams.
          </Text>
          
          <Box marginY="spacing.3">
            <Box display="flex" justifyContent="space-between" marginBottom="spacing.2">
              <Text color="surface.text.staticWhite.normal">Storage</Text>
              <Text color="surface.text.staticWhite.normal">100GB</Text>
            </Box>
            <Box display="flex" justifyContent="space-between" marginBottom="spacing.2">
              <Text color="surface.text.staticWhite.normal">Users</Text>
              <Text color="surface.text.staticWhite.normal">Up to 20</Text>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Text color="surface.text.staticWhite.normal">Support</Text>
              <Text color="surface.text.staticWhite.normal">Priority</Text>
            </Box>
          </Box>
          
          <Box marginTop="spacing.4">
            <Button variant="primary" isFullWidth>Choose Plan</Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ResponsiveCardLayout;
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
      backgroundColor="surface.background.gray.subtle"
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
        borderRadius="circle"
        backgroundColor="surface.background.primary.subtle"
        clipPath="circle(50% at 50% 50%)"
      />
      
      <Box
        position="absolute"
        bottom="-30px"
        left="20%"
        width="150px"
        height="150px"
        borderRadius="circle"
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
        
        {/* Card with transformation */}
        <Box
          backgroundColor="surface.background.gray.normal"
          borderRadius="medium"
          padding="spacing.4"
          elevation="midRaised"
          marginBottom="spacing.5"
          transform="rotate(-2deg)"
          transformOrigin="center"
        >
          <Text>
            This card has a slight rotation applied to create visual interest.
          </Text>
        </Box>
        
        {/* Overlapping elements */}
        <Box position="relative" height="100px" marginBottom="spacing.4">
          <Box
            position="absolute"
            left="0"
            top="0"
            width="80px"
            height="80px"
            backgroundColor="surface.background.primary.intense"
            borderRadius="medium"
            display="flex"
            alignItems="center"
            justifyContent="center"
            zIndex={1}
          >
            <Text color="surface.text.staticWhite.normal">Box 1</Text>
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
            <Text color="surface.text.staticWhite.normal">Box 3</Text>
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
  
  const gridItems = [
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
      backgroundColor="surface.background.gray.subtle"
      borderRadius="large"
    >
      <Heading size="large" marginBottom="spacing.5">
        Responsive Grid Layout
      </Heading>
      
      <Text marginBottom="spacing.4">
        This grid adapts to screen size and supports hover effects and drag-and-drop.
      </Text>
      
      {/* Grid container */}
      <Box
        display="flex"
        flexWrap="wrap"
        gap="spacing.4"
      >
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
            // Transition for smooth effects
            style={{ transition: 'all 0.2s ease-in-out' }}
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
            // Click handler
            onClick={() => console.log(`Clicked on ${item.title}`)}
          >
            <Text 
              color={
                item.color.includes('primary.intense') || 
                item.color.includes('gray.intense') ? 
                'surface.text.staticWhite.normal' : 'surface.text.gray.normal'
              }
              fontWeight="semibold"
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