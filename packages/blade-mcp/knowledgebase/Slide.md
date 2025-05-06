## Component Name

Slide

## Description

The Slide component is a motion preset that animates elements by sliding them in from outside the viewport. It creates smooth entrance and exit animations, making elements appear or disappear with a sliding motion. This component is ideal for page transitions, introducing new UI elements, or implementing progressive disclosure patterns.

## TypeScript Types

These types define the props that the Slide component accepts, allowing you to configure how elements slide into and out of view.

```typescript
// Main Slide component props
type SlideProps = {
  /**
   * React children to be animated.
   */
  children: React.ReactElement;

  /**
   * Controls whether the component is visible or not.
   * When used, the component will animate in when true and animate out when false.
   */
  isVisible?: boolean;

  /**
   * Specifies what triggers the animation.
   * - mount: Animates when component mounts
   * - in-view: Animates when component enters the viewport
   * - focus: Animates when component receives focus
   * - on-animate-interactions: Animates based on AnimateInteractions component
   *
   * @default ['mount']
   */
  motionTriggers?: ('mount' | 'in-view' | 'focus' | 'on-animate-interactions')[];

  /**
   * Determines if the component should be unmounted from the DOM when hidden.
   * When false (default), component remains in DOM with opacity 0.
   *
   * @default false
   */
  shouldUnmountWhenHidden?: boolean;

  /**
   * Sets whether component should animate in, out, or both.
   * - in: Only animates in, immediately removed on exit
   * - out: Only animates out, immediately appears on enter
   * - inout: Animates both in and out
   *
   * @default 'inout'
   */
  type?: 'in' | 'out' | 'inout';

  /**
   * Direction from where the component should slide.
   * Can be a single direction for both enter/exit or different directions for each.
   *
   * @default 'bottom'
   */
  direction?:
    | 'top'
    | 'right'
    | 'bottom'
    | 'left'
    | {
        enter: 'top' | 'right' | 'bottom' | 'left';
        exit: 'top' | 'right' | 'bottom' | 'left';
      };

  /**
   * Offset from which the component should slide.
   * The Slide component is meant to animate from outside the viewport.
   *
   * @default
   * direction="right|left" -> 100vw
   * direction="top|bottom" -> 100vh
   */
  fromOffset?: '100vh' | '100vw' | `${number}%`;

  /**
   * Handles delay of animations.
   * Can be a single delay value or different values for enter/exit.
   */
  delay?:
    | keyof Delay
    | {
        enter: keyof Delay;
        exit: keyof Delay;
      };
};
```

## Example

### Basic Usage

This example demonstrates a simple slide animation toggled by a button, showing how to use the Slide component with the isVisible prop to control the animation state.

```tsx
import { useState } from 'react';
import { Slide, Box, Button, Card, CardBody, Text } from '@razorpay/blade/components';

function BasicSlideExample() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <Box padding="spacing.6">
      <Button marginBottom="spacing.4" onClick={() => setIsVisible(!isVisible)}>
        Toggle Slide
      </Button>

      <Slide isVisible={isVisible} direction="bottom">
        <Card width="100%" maxWidth="400px">
          <CardBody>
            <Text>
              This card slides in from the bottom and out to the bottom when the toggle button is
              clicked.
            </Text>
          </CardBody>
        </Card>
      </Slide>
    </Box>
  );
}
```

### Slide In View Example

This example shows how to trigger slide animations when elements enter the viewport during scrolling, with multiple elements sliding from different directions and with varying delays.

```tsx
import {
  Slide,
  Box,
  Card,
  CardBody,
  CardHeader,
  CardHeaderLeading,
  Text,
} from '@razorpay/blade/components';

function SlideInViewExample() {
  return (
    <Box
      height="400px"
      overflow="auto"
      padding="spacing.4"
      backgroundColor="surface.background.gray.subtle"
    >
      <Text marginBottom="spacing.4">Scroll down to see elements slide in</Text>

      {/* Create space to scroll */}
      <Box height="300px" />

      {/* First element that slides in when scrolled into view */}
      <Slide motionTriggers={['in-view']} direction="left">
        <Card marginBottom="spacing.6">
          <CardHeader>
            <CardHeaderLeading title="First Item" />
          </CardHeader>
          <CardBody>
            <Text>This card slides in from the left when scrolled into view</Text>
          </CardBody>
        </Card>
      </Slide>

      {/* Create more space */}
      <Box height="200px" />

      {/* Second element with different animation */}
      <Slide motionTriggers={['in-view']} direction="right" delay="gentle">
        <Card marginBottom="spacing.6">
          <CardHeader>
            <CardHeaderLeading title="Second Item" />
          </CardHeader>
          <CardBody>
            <Text>
              This card slides in from the right with a gentle delay when scrolled into view
            </Text>
          </CardBody>
        </Card>
      </Slide>

      {/* Create more space */}
      <Box height="200px" />

      {/* Third element with another animation style */}
      <Slide motionTriggers={['in-view']} direction="bottom">
        <Card>
          <CardHeader>
            <CardHeaderLeading title="Third Item" />
          </CardHeader>
          <CardBody>
            <Text>This card slides in from the bottom when scrolled into view</Text>
          </CardBody>
        </Card>
      </Slide>
    </Box>
  );
}
```
