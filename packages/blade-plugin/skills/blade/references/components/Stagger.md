## Component Name

Stagger

## Description

Stagger is a utility motion preset component that allows you to stagger children (make them appear one after the other) with animations. It's designed to create visually appealing entry and exit animations where child elements animate sequentially rather than simultaneously, creating a cascading effect.

## TypeScript Types

Below are the TypeScript types that define the props that the Stagger component accepts:

```typescript
type StaggerProps = {
  /**
   * Motion preset elements (e.g. `Fade`, `Move`, `Slide`) to animate one after the other
   */
  children: React.ReactElement[] | React.ReactElement;

  /**
   * Handle visibility of all children. Use this to animate children out and in.
   */
  isVisible?: boolean;

  /**
   * What triggers the motion
   * @default ['mount']
   */
  motionTriggers?: ('mount' | 'in-view' | 'focus' | 'on-animate-interactions')[];

  /**
   * By default components are only made opacity: 0. When true, children unmount when hidden.
   * @default false
   */
  shouldUnmountWhenHidden?: boolean;

  /**
   * Whether component should animate in, animate out, or animate both in and out
   * @default 'inout'
   */
  type?: 'in' | 'out' | 'inout';

  /**
   * Handles delay of animations. Use one token, or different tokens for enter and exit.
   * @default undefined
   */
  delay?: Delay | { enter: Delay; exit: Delay };
} & Omit<BoxProps, 'as'>;

// Motion delay tokens
type Delay = '2xquick' | 'xquick' | 'moderate' | 'gentle' | 'xgentle' | 'long' | 'xlong' | '2xlong';

/**
 * Stagger renders a Box, so it accepts all Box props except `as`
 * (layout, flexbox, grid, spacing, background, border, elevation, mouse/drag events, etc).
 * See the Box component docs for the full list.
 */
type BoxProps = {
  as?: string;
  display?: string;
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  gap?: string;
  padding?: string;
  width?: string;
  height?: string;
  // ...and all other Box props
};
```

## Usage Guidelines

**Do**

- Use `Stagger` to orchestrate sequential animations for lists or groups (cards appearing one after another).
- Wrap each child in a motion preset (`Move`, `Fade`, `Slide`) — Stagger coordinates their timing.
- Use Box props (`display`, `gap`, `flexDirection`) directly on Stagger since it renders as a Box.
- Control the entire group's visibility with `isVisible` on the Stagger (not on individual children).

**Don't**

- Don't use `Stagger` when all items should animate simultaneously — use individual motion presets directly.
- Don't set `isVisible` on child motion presets — control visibility at the Stagger level.
- Don't expect `in-view` or `on-animate-interactions` triggers — Stagger only supports `mount`, `hover`, and `focus`.
- Don't use Stagger for single elements — it's designed for coordinating multiple children.

## Example

### Basic Stagger Animation with Fade

This example demonstrates how to create a sequential appearance animation for multiple cards, where each card fades in one after another rather than simultaneously, controlled by a toggle button.

```tsx
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
