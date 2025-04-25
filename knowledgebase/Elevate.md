## Component Name
Elevate

## Description
Elevate is a motion component that animates the CSS `box-shadow` property to highlight elements. It enables smooth visual elevation transitions through hover, focus, or programmatic control. Elevate is designed to enhance interactive feedback and visual hierarchy in block-level components like Cards and Boxes, providing subtle depth cues to improve user experience.

## TypeScript Types
The following types represent the props that the Elevate component accepts. These allow you to properly configure the component according to your needs.

```typescript
/**
 * Props for the Elevate component
 */
type ElevateProps = {
  /**
   * Content to be elevated
   */
  children: React.ReactNode;

  /**
   * Controls whether the element is in the highlighted state
   * @default false
   */
  isHighlighted?: boolean;

  /**
   * Events that trigger the motion animation
   * @default []
   */
  motionTriggers?: MotionTrigger[];
} & StyledPropsBlade & TestID;

/**
 * Motion triggers for animation components
 */
type MotionTrigger = 
  | 'hover' 
  | 'focus' 
  | 'press' 
  | 'on-animate-interactions';

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
 * Styled props for blade components
 */
type StyledPropsBlade = {
  // Various styling props like margin, padding, etc.
};
```

## Examples

### Multiple Triggers for Accessibility

This example shows how to use multiple triggers (hover and focus) to improve accessibility.

```tsx
import React from 'react';
import { 
  Elevate, 
  Card, 
  CardBody, 
  Heading, 
  Text,
  Button
} from '@razorpay/blade/components';

const AccessibleElevateExample = () => {
  return (
    <Elevate motionTriggers={['hover', 'focus']}>
      <Card width="300px" elevation="none">
        <CardBody>
          <Heading size="small" marginBottom="spacing.2">Multiple Triggers</Heading>
          <Text marginBottom="spacing.4">
            This card elevates on both hover and focus, improving accessibility.
            Try focusing the button below to see the elevation effect.
          </Text>
          <Button>Focus me</Button>
        </CardBody>
      </Card>
    </Elevate>
  );
};

export default AccessibleElevateExample;
```

### Controlled Elevation State

This example demonstrates how to control the elevation state programmatically using the `isHighlighted` prop.

```tsx
import React, { useState } from 'react';
import { 
  Elevate, 
  Card, 
  CardBody, 
  Box,
  Button,
  Heading, 
  Text 
} from '@razorpay/blade/components';

const ControlledElevateExample = () => {
  const [isHighlighted, setIsHighlighted] = useState(false);
  
  return (
    <Box display="flex" flexDirection="column" gap="spacing.4">
      <Button 
        onClick={() => setIsHighlighted(!isHighlighted)}
        variant="secondary"
      >
        {isHighlighted ? 'Remove Elevation' : 'Add Elevation'}
      </Button>
      
      <Elevate isHighlighted={isHighlighted}>
        <Card width="300px" elevation="none">
          <CardBody>
            <Heading size="small" marginBottom="spacing.2">Controlled Elevation</Heading>
            <Text>
              This card's elevation is controlled programmatically through the isHighlighted prop.
              Click the button above to toggle the elevation.
            </Text>
          </CardBody>
        </Card>
      </Elevate>
    </Box>
  );
};

export default ControlledElevateExample;
```

### Coordinated Animation with AnimateInteractions

This example shows how to combine Elevate with other motion components for coordinated animations.

```tsx
import React from 'react';
import { 
  Elevate, 
  Card, 
  CardBody, 
  Box, 
  Button, 
  Heading, 
  Text,
  AnimateInteractions,
  Move
} from '@razorpay/blade/components';
import { ExternalLinkIcon } from '@razorpay/blade/icons';

const CoordinatedAnimationExample = () => {
  return (
    <AnimateInteractions motionTriggers={['hover']}>
      <Box display="contents">
        <Elevate>
          <Card
            width="400px"
            padding="spacing.0"
            backgroundColor="surface.background.gray.moderate"
            elevation="none"
          >
            <CardBody>
              <Box padding="spacing.6">
                <Heading as="h2" weight="regular">
                  Payment Pages
                </Heading>
                <Heading marginY="spacing.4" size="large" as="h3">
                  Accept payments without coding on a custom branded store
                </Heading>
                <Text>
                  Hover over this card to see coordinated animations. While the card elevates,
                  the button container below moves into view - demonstrating how multiple
                  motion components can work together.
                </Text>
              </Box>

              <Move motionTriggers={['on-animate-interactions']}>
                <Box
                  display="flex"
                  gap="spacing.4"
                  justifyContent="flex-end"
                  padding="spacing.6"
                >
                  <Button variant="secondary" icon={ExternalLinkIcon} iconPosition="right">
                    Know More
                  </Button>
                  <Button>Sign Up</Button>
                </Box>
              </Move>
            </CardBody>
          </Card>
        </Elevate>
      </Box>
    </AnimateInteractions>
  );
};

export default CoordinatedAnimationExample; 