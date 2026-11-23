## Component Name

RazorSenseSuccess

## Description

RazorSenseSuccess is RazorSense's success moment, as the RazorSense system made it: a glass orb rises into place with a white tick on it, then shrinks and fades as Blade's success badge pops in where it was, and the tick turns into the badge's check. Its optional `label` comes in under the badge as it pops in. It plays once when it mounts, then the badge (and label) stay. It ships next to RazorSense and follows Blade's color scheme.

## Important Constraints

- Web only: the orb draws with WebGL2. On React Native it throws.
- Light and dark follow `BladeProvider`'s color scheme; there is no color scheme prop. Each is its own tuning.
- In the layout it's the badge (80 x 80 px), and its label under it when it has one (24 px below, Blade's large heading, centred). The orb rises from below the badge, over what's there, and goes: leave it room, and don't clip its parent tightly.
- `label` is any text; without it, the badge alone. It's in its place from the start (nothing moves when it shows) and comes in 0.3 s after the badge starts to pop, fading in and rising 20 px over 0.5 s, never before the orb has become the badge.
- It plays once per mount, about 5 seconds, and calls `onComplete` at the end. Mount it again (a new `key`) to play it again.
- The badge and its check are Blade's own: the circle in `feedback.background.positive.subtle`, `CheckIcon` (xlarge) in `feedback.icon.positive.intense`.
- The orb's GPU context and memory go as soon as the orb is gone (about 3.4 seconds in); the badge stays as plain HTML.
- When it can't animate (no WebGL2, a GPU that only draws on the CPU, its engine failing to load, or no first frame within a moment) it calls `onError` and the badge pops in with its check (and its label after it), with no orb: a success never waits on a GPU.
- With reduced motion on it shows the badge with its check, and its label, at once and calls `onComplete`.
- Screen readers see the badge as an image labelled by `accessibilityLabel` (default "Success"); the label is read as text.
- The engine and the orb's data load on demand (a dynamic import) the first time it renders.
- Its `ref`, `className` and `style` go to its root element (web).

## TypeScript Types

The following types represent the props that the RazorSenseSuccess component accepts.

```ts
type RazorSenseSuccessProps = {
  /**
   * Text under the badge (Blade's large heading), coming in as the badge pops in; any text. Without it, the badge alone.
   */
  label?: string;
  /**
   * What screen readers announce: the badge is exposed as an image with this name.
   * @default 'Success'
   */
  accessibilityLabel?: string;
  /**
   * Called once it has played out (about 5 seconds: the orb rises, Blade's success badge pops in where it is, its tick turns into
   * the badge's check and its label comes in). The badge and label stay. It plays once per mount: mount it again, with a new `key`, to play it again.
   */
  onComplete?: () => void;
  /**
   * Holds the animation where it is.
   * @default false
   */
  isPaused?: boolean;
  /**
   * Called once the animation is drawing (its engine loaded and running on the GPU).
   */
  onLoad?: () => void;
  /**
   * Called when it can't animate: no WebGL2, a GPU that only draws on the CPU (a software renderer), its engine failed to
   * load, its frames are too slow on this device even at its lowest step (under 20 a second for 3 seconds, counted after its
   * first 2), or the browser took its GPU context back. It shows its still frame instead. Too slow counts for the whole page:
   * once one RazorSense 2.0 animation finds that, every one on the page shows its still, including ones mounted later, until
   * the page reloads. Before that, the page starts at its device's level (a known weak GPU a step or two down) and steps down
   * page-wide while it can't keep up (under 45 a second): every other frame, then a lower sharpness too; once frames hold again,
   * it steps back up.
   */
  onError?: (error: Error) => void;
  /**
   * A class name for its root element (web).
   */
  className?: string;
  /**
   * Inline styles for its root element (web), merged over its own.
   */
  style?: React.CSSProperties;
  testID?: string;
};
```

## Usage Guidelines

**Do**

- Show it where a success badge belongs, at the moment something succeeds: a payment received, a setup finished.
- Give it its message as `label`, so the text comes in with the badge, not before.
- Mount it again (a new `key`) to play it again.

**Don't**

- Don't use it for a step that isn't done yet; it ends on a success badge.
- Don't put it in a small clipped box: the orb rises from well below the badge.
- Don't use it on React Native; it's web only.

## Example

### A payment received

The orb rises and turns into the badge above the message.

```jsx
import React from 'react';
import { Box, Text, RazorSenseSuccess } from '@razorpay/blade/components';

const PaymentReceived = ({ amount }) => (
  <Box display="flex" flexDirection="column" alignItems="center" gap="spacing.5">
    <RazorSenseSuccess label="Payment received" />
    <Text color="surface.text.gray.muted">{amount} is on its way to your account.</Text>
  </Box>
);

export default PaymentReceived;
```
