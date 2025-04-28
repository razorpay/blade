## Component Name

Stagger

## Description

Stagger is a utility motion preset component that allows you to stagger children (make them appear one after the other) with animations. It's designed to create visually appealing entry and exit animations where child elements animate sequentially rather than simultaneously, creating a cascading effect.

## TypeScript Types

Below are the TypeScript types that define the props that the Stagger component accepts:

```typescript
// Main component props
type StaggerProps = Pick<
  BaseMotionEntryExitProps,
  'isVisible' | 'motionTriggers' | 'shouldUnmountWhenHidden' | 'type' | 'delay'
> & {
  children: React.ReactElement[] | React.ReactElement;
} & Omit<BoxProps, 'as'>;

// The picked BaseMotionEntryExitProps include:
type BaseMotionEntryExitProps = {
  /**
   * Whether the component is visible or not
   * @default true
   */
  isVisible?: boolean;

  /**
   * What triggers the motion
   * @default ['mount']
   */
  motionTriggers?: Array<'mount' | 'hover' | 'focus'>;

  /**
   * Whether to unmount the component when it's hidden
   * @default false
   */
  shouldUnmountWhenHidden?: boolean;

  /**
   * Type of animation to use
   * @default 'inout'
   */
  type?: 'in' | 'out' | 'inout';

  /**
   * Delay duration for the animation
   */
  delay?:
    | keyof typeof theme.motion.delay
    | { enter?: keyof typeof theme.motion.delay; exit?: keyof typeof theme.motion.delay };
};
```

## Example

### Basic Stagger Animation with Fade

```jsx
import { useState } from 'react';
import {
  Stagger,
  Fade,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardHeaderLeading,
  Text,
} from '@razorpay/blade/components';

function StaggerExample() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.8"
      borderRadius="medium"
    >
      <Button marginBottom="spacing.4" onClick={() => setIsVisible(!isVisible)}>
        {isVisible ? 'Hide Cards' : 'Show Cards'}
      </Button>

      <Stagger
        isVisible={isVisible}
        display="flex"
        flexDirection="row"
        gap="spacing.4"
        motionTriggers={['mount']}
        type="inout"
        shouldUnmountWhenHidden={false}
      >
        <Fade>
          <Card width="200px">
            <CardHeader>
              <CardHeaderLeading title="Card 1" subtitle="First card" />
            </CardHeader>
            <CardBody>
              <Text>This card appears first</Text>
            </CardBody>
          </Card>
        </Fade>

        <Fade>
          <Card width="200px">
            <CardHeader>
              <CardHeaderLeading title="Card 2" subtitle="Second card" />
            </CardHeader>
            <CardBody>
              <Text>This card appears second</Text>
            </CardBody>
          </Card>
        </Fade>

        <Fade>
          <Card width="200px">
            <CardHeader>
              <CardHeaderLeading title="Card 3" subtitle="Third card" />
            </CardHeader>
            <CardBody>
              <Text>This card appears third</Text>
            </CardBody>
          </Card>
        </Fade>
      </Stagger>
    </Box>
  );
}
```

### Stagger with Move Animation

```jsx
import { useState } from 'react';
import { Stagger, Move, Box, Button, Chip, ChipGroup } from '@razorpay/blade/components';

function StaggerWithMoveExample() {
  const [isVisible, setIsVisible] = useState(true);
  const chipData = [
    'Business Type: Freelance',
    'Account Status: Activated',
    'Test Mode: Disabled',
    'Primary Product: Banking',
  ];

  return (
    <Box backgroundColor="surface.background.gray.subtle" padding="spacing.8" borderRadius="medium">
      <Button marginBottom="spacing.4" onClick={() => setIsVisible(!isVisible)}>
        {isVisible ? 'Hide Chips' : 'Show Chips'}
      </Button>

      <ChipGroup label="Account Information" selectionType="multiple">
        <Stagger isVisible={isVisible} type="in" display="flex" flexWrap="wrap" gap="spacing.2">
          {chipData.map((chipLabel, index) => (
            <Move key={index}>
              <Chip value={chipLabel.toLowerCase().replace(/ /g, '-')}>{chipLabel}</Chip>
            </Move>
          ))}
        </Stagger>
      </ChipGroup>
    </Box>
  );
}
```

### Stagger with Slide Animation and Custom Delay

```jsx
import { useState } from 'react';
import { Stagger, Slide, Box, Button, Card, CardBody, Text } from '@razorpay/blade/components';

function StaggerWithDelayExample() {
  const [isVisible, setIsVisible] = useState(true);

  const cardData = [
    { title: 'Payments', value: '₹50,000', description: '10 transactions' },
    { title: 'Refunds', value: '₹5,000', description: '2 processed' },
    { title: 'Disputes', value: '₹0', description: '0 pending' },
  ];

  return (
    <Box padding="spacing.6">
      <Button marginBottom="spacing.4" onClick={() => setIsVisible(!isVisible)}>
        {isVisible ? 'Hide Data' : 'Show Data'}
      </Button>

      <Stagger
        isVisible={isVisible}
        display="flex"
        flexDirection="column"
        gap="spacing.4"
        type="inout"
        delay="medium" // Use a custom delay for the animation
        shouldUnmountWhenHidden={true} // Unmount the children when hidden
      >
        {cardData.map((card, index) => (
          <Slide key={index} direction="right">
            <Card>
              <CardBody>
                <Box display="flex" flexDirection="column" gap="spacing.2">
                  <Text size="large" weight="semibold">
                    {card.title}
                  </Text>
                  <Text size="xxlarge" weight="semibold">
                    {card.value}
                  </Text>
                  <Text color="surface.text.gray.muted">{card.description}</Text>
                </Box>
              </CardBody>
            </Card>
          </Slide>
        ))}
      </Stagger>
    </Box>
  );
}
```

### Stagger with Route Change in React Router

```jsx
import {
  Stagger,
  Move,
  Box,
  Card,
  CardHeader,
  CardBody,
  CardHeaderLeading,
  ChipGroup,
  Chip,
  Text,
} from '@razorpay/blade/components';
import { useParams } from 'react-router-dom';

function StepContent() {
  // Sample data for the onboarding steps
  const stepData = {
    introduction: {
      title: 'Introduction',
      description: 'Introduction to Razorpay Payment Gateway',
      chips: ['Getting Started', 'Payment Flow', 'Features Overview', 'API Access'],
    },
    'personal-details': {
      title: 'Personal Details',
      description: 'Fill your Personal Details for onboarding',
      chips: ['Contact Information', 'Address Details', 'Identity Verification', 'Phone Number'],
    },
    'business-details': {
      title: 'Business Details',
      description: 'Fill your Business Details for onboarding',
      chips: ['Business Type', 'GST Details', 'Business Address', 'Industry Category'],
    },
    'complete-onboarding': {
      title: 'Complete Onboarding',
      description: 'Complete your onboarding to start',
      chips: ['Review Information', 'Terms & Conditions', 'Submit Application', 'Activate Account'],
    },
  };

  // Get the current step from URL params
  const { stepId } = useParams();
  const currentStep = stepData[stepId] || { title: 'Unknown Step', description: '', chips: [] };

  // When route changes, the Stagger component will animate the new content
  return (
    <Card width="100%">
      <CardHeader>
        <CardHeaderLeading title={currentStep.title} subtitle={currentStep.description} />
      </CardHeader>
      <CardBody>
        <Stagger type="in">
          <ChipGroup label="Step Information" selectionType="multiple">
            {currentStep.chips.map((chipLabel, index) => (
              <Move key={index}>
                <Chip value={chipLabel.toLowerCase().replace(/ /g, '-')}>{chipLabel}</Chip>
              </Move>
            ))}
          </ChipGroup>
        </Stagger>
      </CardBody>
    </Card>
  );
}
```
