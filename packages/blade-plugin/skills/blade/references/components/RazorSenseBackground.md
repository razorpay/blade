## Component Name

RazorSenseBackground

## Description

RazorSenseBackground is RazorSense's big piece for a page's background, as Razorpay's login page has it: soft fluted bands drifting and breathing, their colours on a slow loop of their own. It fills its box; the piece is placed in it as designed and the box cuts off what falls outside it. It ships next to RazorSense and follows Blade's color scheme.

## Important Constraints

- Web only: it draws with WebGL2. On React Native it throws.
- Light and dark follow `BladeProvider`'s color scheme; there is no color scheme prop. Each is its own tuning.
- It fills its box (`width` and `height`, `100%` by default): give it a sized container, such as a login page's visual panel or a full-screen layer behind the page. The piece is placed as the login page has it: cover-fitted to the box (on a 1512 x 862 box, 1 px of the design is 0.5 px), turned slightly, and cut off by the box.
- Only the part of the piece inside the box is drawn, at one canvas pixel per CSS pixel (the piece is soft all over: sharper pixels wouldn't show). Its colour loop, drift and breathing run on their own clocks; it plays as long as it's on screen and pauses off-screen or in a hidden tab.
- When it can't animate (no WebGL2, a GPU that only draws on the CPU such as a remote desktop or a VM, its engine failing to load, or frames under 20 a second for 3 seconds even at its lowest step) it shows a still frame of itself instead and calls `onError`. The page keeps its frame rate. Too slow counts for the whole page: once one RazorSense 2.0 animation is too slow, every one on the page shows its still, including ones mounted later, until the page reloads. The still is its own small module, downloaded only then.
- With reduced motion on it shows the piece still, at the start of its loop.
- `scale` is held between 0.75 and 1.25; a value outside that range is held at the nearest end, with a warning in development.
- It's decorative: hidden from screen readers, and it lets clicks through. Put the page's content over it.
- The engine and the piece's data load on demand (a dynamic import) the first time it renders.
- Its `ref`, `className` and `style` go to its root element (web).

## TypeScript Types

The following types represent the props that the RazorSenseBackground component accepts.

```ts
type RazorSenseBackgroundProps = {
  /**
   * Width of the background. It fills its box, and the piece is placed in it as the login page has it (cover-fitted: on a 1512 x
   * 862 box, 1 px of the design is 0.5 px); what falls outside the box is cut off by it.
   * @default '100%'
   */
  width?: string | number;
  /**
   * Height of the background.
   * @default '100%'
   */
  height?: string | number;
  /**
   * Holds the animation where it is.
   * @default false
   */
  isPaused?: boolean;
  /**
   * The whole effect bigger or smaller, bands included. Held between 0.75 and 1.25.
   * @default 1
   */
  scale?: number;
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
   * page-wide while it can't keep up (under 45 a second): every other frame, then fewer pixels too (its canvas at 0.75, then 0.5
   * of a CSS px, scaled up by the browser); once frames hold again, it steps back up.
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

- Use it as the background of a page's visual panel, such as a login or sign-up page's left half, with the page's own content over it.
- Let the theme decide light or dark by rendering it inside `BladeProvider`.
- Give the content over it a solid or glassy surface where it needs contrast: the piece moves under it.

**Don't**

- Don't put more than one on a page: it's a page-sized piece.
- Don't use it behind a chat input; use `RazorSenseChatBackground` for that.
- Don't use it on React Native; it's web only.

## Example

### A login page's visual panel

The piece fills the left panel; the page's message sits over it.

```jsx
import React from 'react';
import { Box, Heading, RazorSenseBackground } from '@razorpay/blade/components';

const LoginPage = ({ form }) => (
  <Box display="flex" height="100vh">
    <Box position="relative" flex="2" overflow="hidden">
      <RazorSenseBackground />
      <Box position="absolute" bottom="spacing.11" left="spacing.10">
        <Heading size="xlarge">Join 8 Million Businesses that Trust Razorpay</Heading>
      </Box>
    </Box>
    <Box flex="1" padding="spacing.10">
      {form}
    </Box>
  </Box>
);

export default LoginPage;
```
