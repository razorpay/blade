## Component Name

AnimateInteractions

## Description

AnimateInteractions is a component that allows you to animate child components based on interactions with the parent element. It acts similar to the CSS pattern `.parent:hover .child {}`, enabling effects like revealing elements, adding movement, or scaling components when a user interacts with a container.

## TypeScript Types

The following types represent the props that the AnimateInteractions component accepts. These types allow you to properly configure the component according to your needs.

```typescript
// Type for motion triggers used in entry/exit animations
type MotionTriggerEntryExitType = 'mount' | 'in-view' | 'focus' | 'on-animate-interactions';

// Full motion triggers type including interactive triggers
type MotionTriggersType = MotionTriggerEntryExitType | 'hover' | 'tap';

type AnimateInteractionsProps = {
  /**
   * The child element to be wrapped by AnimateInteractions.
   * Child components using 'on-animate-interactions' in their motionTriggers
   * will animate when the parent AnimateInteractions is triggered.
   */
  children: React.ReactElement;

  /**
   * Determines what interactions will trigger the animations of children.
   *
   * Possible values:
   * - 'hover': Animations trigger when the parent is hovered
   * - 'focus': Animations trigger when the parent receives focus
   * - 'tap': Animations trigger when the parent is tapped/clicked
   * - 'mount': Animations trigger when the component mounts
   * - 'in-view': Animations trigger when the component enters the viewport
   *
   * @default ['hover']
   */
  motionTriggers?: MotionTriggersType[];
};
```

## Examples

### Basic Card with Animated Buttons

This example shows a card that reveals action buttons when hovered.

```tsx
import React from 'react';
import {
  AnimateInteractions,
  Move,
  Card,
  CardBody,
  Box,
  Heading,
  Text,
  Button,
  ExternalLinkIcon,
} from '@razorpay/blade/components';

const AnimatedCardExample = () => {
  return (
    <AnimateInteractions motionTriggers={['hover']}>
      <Card width="400px" padding="spacing.0" backgroundColor="surface.background.gray.moderate">
        <CardBody>
          <Box overflow="auto">
            <Box padding="spacing.6">
              <Heading as="h2" weight="regular">
                Payment Pages
              </Heading>
              <Heading marginY="spacing.4" size="large" as="h3">
                Accept payments{' '}
                <Heading size="large" as="span" color="surface.text.primary.normal">
                  without coding on a custom branded store
                </Heading>
              </Heading>
              <Text>Hover over this card to see the buttons animate in from below</Text>
            </Box>

            <Move motionTriggers={['on-animate-interactions']}>
              <Box
                display="flex"
                gap="spacing.4"
                justifyContent="flex-end"
                padding="spacing.4"
                elevation="highRaised"
              >
                <Button variant="secondary" icon={ExternalLinkIcon} iconPosition="right">
                  Know More
                </Button>
                <Button>Sign Up</Button>
              </Box>
            </Move>
          </Box>
        </CardBody>
      </Card>
    </AnimateInteractions>
  );
};

export default AnimatedCardExample;
```

### Image with Hover Overlay

This example demonstrates an image that reveals an overlay with a button when hovered.

```tsx
import React from 'react';
import {
  AnimateInteractions,
  Fade,
  Box,
  Button,
  ExternalLinkIcon,
} from '@razorpay/blade/components';

const AnimatedImageOverlayExample = () => {
  return (
    <AnimateInteractions motionTriggers={['hover']}>
      <Box
        position="relative"
        width="300px"
        height="300px"
        borderRadius="medium"
        elevation="midRaised"
        overflow="hidden"
      >
        <img
          src="https://example.com/your-image.jpg"
          width="100%"
          height="300px"
          alt="Image description"
        />
        <Fade motionTriggers={['on-animate-interactions']}>
          <Box
            display="flex"
            position="absolute"
            top="spacing.0"
            left="spacing.0"
            width="100%"
            height="100%"
            alignItems="center"
            justifyContent="center"
            backgroundColor="overlay.background.subtle"
          >
            <Button
              icon={ExternalLinkIcon}
              iconPosition="right"
              target="_blank"
              href="https://example.com"
            >
              View Details
            </Button>
          </Box>
        </Fade>
      </Box>
    </AnimateInteractions>
  );
};

export default AnimatedImageOverlayExample;
```

### Interactive Card with Multiple Triggers

This example shows a card that responds to both hover and focus interactions, using scale animation.

```tsx
import React from 'react';
import {
  AnimateInteractions,
  Scale,
  Card,
  CardBody,
  Box,
  Heading,
  Text,
} from '@razorpay/blade/components';

const MultiTriggerAnimationExample = () => {
  return (
    <AnimateInteractions motionTriggers={['hover', 'focus']}>
      <Card
        width="400px"
        padding="spacing.5"
        backgroundColor="surface.background.gray.moderate"
        onClick={() => console.log('Card clicked')}
      >
        <CardBody>
          <Box overflow="auto">
            <Box padding="spacing.6">
              <Heading as="h2" size="large">
                Interactive Card
              </Heading>

              <Box display="flex" gap="spacing.4" marginTop="spacing.4">
                <Box flex="2">
                  <Text>
                    This card responds to both hover and keyboard focus. Try hovering over it or
                    pressing Tab to focus on it.
                  </Text>
                </Box>

                <Box>
                  <Scale motionTriggers={['on-animate-interactions']}>
                    <img
                      src="https://example.com/your-image.jpg"
                      width="140px"
                      height="140px"
                      alt="Feature image"
                    />
                  </Scale>
                </Box>
              </Box>
            </Box>
          </Box>
        </CardBody>
      </Card>
    </AnimateInteractions>
  );
};

export default MultiTriggerAnimationExample;
```

### Tap to Reveal Information

This example shows content that is revealed when the user clicks/taps on a card.

```tsx
import React from 'react';
import {
  AnimateInteractions,
  Fade,
  Card,
  CardBody,
  Box,
  Heading,
  Text,
  Button,
} from '@razorpay/blade/components';

const TapRevealExample = () => {
  return (
    <AnimateInteractions motionTriggers={['tap']}>
      <Card
        width="400px"
        padding="spacing.6"
        backgroundColor="surface.background.gray.moderate"
        cursor="pointer"
      >
        <CardBody>
          <Heading as="h2" size="large" marginBottom="spacing.4">
            Click me to reveal more
          </Heading>

          <Text>This card reveals additional information when clicked/tapped.</Text>

          <Fade motionTriggers={['on-animate-interactions']}>
            <Box
              marginTop="spacing.6"
              padding="spacing.4"
              backgroundColor="surface.background.gray.subtle"
            >
              <Text weight="semibold">Additional Information</Text>
              <Text marginTop="spacing.2">
                This content is revealed when the user interacts with the card by clicking or
                tapping. The 'tap' trigger works well for mobile experiences.
              </Text>
              <Button marginTop="spacing.4">Take Action</Button>
            </Box>
          </Fade>
        </CardBody>
      </Card>
    </AnimateInteractions>
  );
};

export default TapRevealExample;
```

### In-View Animation on Scroll

This example shows content that animates when it scrolls into the viewport.

```tsx
import React from 'react';
import { AnimateInteractions, Move, Box, Heading, Text } from '@razorpay/blade/components';

const ScrollInViewExample = () => {
  return (
    <AnimateInteractions motionTriggers={['in-view']}>
      <Box
        padding="spacing.6"
        backgroundColor="surface.background.gray.moderate"
        borderRadius="medium"
        width="100%"
        maxWidth="600px"
      >
        <Heading as="h2" size="large">
          Scroll-triggered Animation
        </Heading>

        <Text marginTop="spacing.4">
          This content animates when it scrolls into the viewport. Useful for creating engaging
          scroll experiences on landing pages and long-form content.
        </Text>

        <Move motionTriggers={['on-animate-interactions']}>
          <Box
            marginTop="spacing.6"
            padding="spacing.4"
            backgroundColor="surface.background.primary.subtle"
            borderRadius="medium"
          >
            <Text weight="semibold">I animate when scrolled into view!</Text>
            <Text marginTop="spacing.2">
              The 'in-view' trigger is perfect for creating scroll-based animations that engage
              users as they move down the page.
            </Text>
          </Box>
        </Move>
      </Box>
    </AnimateInteractions>
  );
};

export default ScrollInViewExample;
```
