## Component Name

Scale

## Description

The Scale component is a motion preset that animates elements by changing their size through CSS scale property. It allows you to enlarge or shrink elements based on user interactions like hover or focus, or through controlled state changes. Scale is perfect for providing subtle feedback when users interact with clickable elements or for highlighting important content.

## TypeScript Types

These types define the props that the Scale component accepts, allowing you to configure how elements scale up or down.

```typescript
type ScaleProps = {
  /**
   * React children to be animated.
   */
  children: React.ReactElement;

  /**
   * Controlled state of scaling. If you want to scale up on hover / focus, etc, checkout `motionTriggers` prop instead.
   *
   * This is when you want to scale up / scale down conditionally
   *
   * With `isHighlighted={true}`, your component will be in scaled state
   * With `isHighlighted={false}`, your component will be in normal state
   */
  isHighlighted?: boolean;

  /**
   * Whether to scale up or scale down the component
   *
   * @default 'scale-up'
   */
  variant?: 'scale-up' | 'scale-down';

  /**
   * Specifies what triggers the animation.
   * Common triggers include:
   * - mount: Animates when component mounts
   * - hover: Animates when component is hovered
   * - tap: Animates when component is tapped/clicked
   * - focus: Animates when component receives focus
   *
   * @default ['hover'] when isHighlighted is not provided
   * @default ['mount'] when isHighlighted is provided
   */
  motionTriggers?: MotionTriggersType[];

  /**
   * Sets whether component should animate in, out, or both.
   * - in: Only animates in, immediately removed on exit
   * - out: Only animates out, immediately appears on enter
   * - inout: Animates both in and out
   *
   * @default 'inout'
   */
  type?: 'in' | 'out' | 'inout';
};
```

## Example

### Basic Usage

This example demonstrates the Scale component's basic functionality with two cards - one that scales up on hover and another that scales down on click, showing different motion triggers and scaling variants.

```tsx
import {
  Scale,
  Card,
  CardBody,
  CardHeader,
  CardHeaderLeading,
  Text,
  Box,
} from '@razorpay/blade/components';

function BasicScaleExample() {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.8">
      {/* Default Scale (scales up on hover) */}
      <Scale motionTriggers={['hover']}>
        <Card width="300px">
          <CardHeader>
            <CardHeaderLeading title="Hover me" />
          </CardHeader>
          <CardBody>
            <Text>This card scales up when you hover over it.</Text>
          </CardBody>
        </Card>
      </Scale>

      {/* Scale down on tap/click */}
      <Scale variant="scale-down" motionTriggers={['tap']}>
        <Card width="300px">
          <CardHeader>
            <CardHeaderLeading title="Click me" />
          </CardHeader>
          <CardBody>
            <Text>This card scales down when you click on it.</Text>
          </CardBody>
        </Card>
      </Scale>
    </Box>
  );
}
```

### Controlled Scaling

This example shows how to implement controlled scaling with a toggle button, demonstrating both scale-up and scale-down variants side by side that respond to state changes rather than direct user interactions.

```tsx
import { useState } from 'react';
import {
  Scale,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardHeaderLeading,
  Text,
} from '@razorpay/blade/components';

function ControlledScaleExample() {
  const [isHighlighted, setIsHighlighted] = useState(false);

  return (
    <Box>
      <Button marginBottom="spacing.6" onClick={() => setIsHighlighted(!isHighlighted)}>
        Toggle Scale
      </Button>

      <Box display="flex" gap="spacing.6">
        {/* Scale up when isHighlighted is true */}
        <Box width="300px">
          <Text marginBottom="spacing.2">Scale Up</Text>
          <Scale isHighlighted={isHighlighted}>
            <Card>
              <CardHeader>
                <CardHeaderLeading title="Controlled Scale Up" />
              </CardHeader>
              <CardBody>
                <Text>This card scales up when the toggle button is clicked.</Text>
              </CardBody>
            </Card>
          </Scale>
        </Box>

        {/* Scale down when isHighlighted is true */}
        <Box width="300px">
          <Text marginBottom="spacing.2">Scale Down</Text>
          <Scale isHighlighted={isHighlighted} variant="scale-down">
            <Card>
              <CardHeader>
                <CardHeaderLeading title="Controlled Scale Down" />
              </CardHeader>
              <CardBody>
                <Text>This card scales down when the toggle button is clicked.</Text>
              </CardBody>
            </Card>
          </Scale>
        </Box>
      </Box>
    </Box>
  );
}
```
