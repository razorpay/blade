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
