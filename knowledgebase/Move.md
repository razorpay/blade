## Component Name

Move

## Description

The Move component is a motion preset that animates the opacity and position of its children, allowing them to smoothly appear or disappear in the UI. It creates a subtle upward movement combined with a fade-in/fade-out effect to ensure seamless transitions while keeping the UI visually engaging. This component is ideal for adding motion to cards, forms, or any other elements that appear and disappear from the interface.

## TypeScript Types

These types represent the props that the component accepts. When using the Move component, you'll need to understand these types to properly configure the animation behavior.

```typescript
type MoveProps = {
  /**
   * The React element(s) to be animated
   */
  children: React.ReactElement;

  /**
   * Whether component should animate in, animate out, or animate both in and out
   *
   * With type="in", component will only animate in but immediately be removed on exit without animation
   * With type="out", component will only animate out but immediately mount on enter without animation
   * With type="inout", component animates in and out both
   *
   * @default 'inout'
   */
  type?: 'in' | 'out' | 'inout';

  /**
   * Handle visibility of motion component.
   *
   * By default components animate on mount but if you want to mount/unmount them, use this prop instead
   */
  isVisible?: boolean;

  /**
   * Values:
   * - mount: Component animates when it mounts
   * - in-view: Component animates when its in view of the scroll
   * - focus: Component animates in when its in focus
   * - on-animate-interactions: Component animates based on motionTriggers of <AnimateInteractions /> component
   *
   * @default ['mount']
   */
  motionTriggers?: ('mount' | 'in-view' | 'focus' | 'on-animate-interactions')[];

  /**
   * By default components are only made opacity: 0. When this prop is set to true, components will unmount and be removed from the page.
   *
   * **Warn:** Setting this true might cause layout shifts in your page since component will be removed so do check it once and add minHeight to its container
   *
   * @default false
   */
  shouldUnmountWhenHidden?: boolean;

  /**
   * Handles delay of animations
   *
   * @default undefined
   */
  delay?: MotionDelay;
};

// MotionDelay can be a simple delay token or an object with separate enter/exit delays
type MotionDelay = keyof Delay | { enter: keyof Delay; exit: keyof Delay };
```

## Example

### Basic Usage

```tsx
import { Move } from '@razorpay/blade/components';
import { Card, CardBody, CardHeader, CardHeaderLeading } from '@razorpay/blade/components';
import { Text } from '@razorpay/blade/components';

function BasicMoveExample() {
  return (
    <Move motionTriggers={['mount']}>
      <Card>
        <CardHeader>
          <CardHeaderLeading title="Welcome to Razorpay" subtitle="Get started with payments" />
        </CardHeader>
        <CardBody>
          <Text>This card animates in with a smooth motion when the component mounts.</Text>
        </CardBody>
      </Card>
    </Move>
  );
}
```
