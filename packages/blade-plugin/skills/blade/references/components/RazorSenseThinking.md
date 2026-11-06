## Component Name

RazorSenseThinking

## Description

RazorSenseThinking is RazorSense thinking in a chat: its blue thinking label, with a shimmer running through it, and the glow looping round it, behind it and past its edges. Inside `RazorSenseChat` it marks where thinking plays, so that when the answer is in, it surges down into the `RazorSenseBottomWave` under the chat input. It ships next to RazorSense and follows Blade's color scheme.

## Important Constraints

- Web only: it draws with WebGL2. On React Native it throws.
- Light and dark follow `BladeProvider`'s color scheme; there is no color scheme prop.
- Its `children` is the label text (default "Thinking…"). Put it where the assistant's reply will go; the glow plays from just before the label and out across the row, past its box (without growing the page).
- On its own, it always thinks; there's no state prop. In a chat, `RazorSenseChat`'s `isThinking` says when, and the chat draws its glow.
- When it can't animate (no WebGL2, a GPU that only draws on the CPU such as a remote desktop or a VM, its engine failing to load, or frames under 20 a second for 3 seconds) it shows a still frame of itself instead and calls `onError`. The page keeps its frame rate. Each still is its own small module, downloaded only then.
- With reduced motion on, the label's shimmer stops and the glow shows one still frame.
- `scale` is held between 0.75 and 1.25. It pauses off-screen.
- The glow is decorative: hidden from screen readers. The label is read as text.
- Its `ref`, `className` and `style` go to its root element (web).

## TypeScript Types

The following types represent the props that the RazorSenseThinking component accepts.

```ts
type RazorSenseThinkingProps = {
  /**
   * What it's doing, shown as flow 9's thinking label: blue, with a shimmer running through it (held still with reduced motion).
   * @default 'Thinking…'
   */
  children?: string;
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
   * load, its frames are too slow on this device (under 20 a second for 3 seconds, counted after its first 2; once one RazorSense
   * animation finds that, the others on the page go to their stills too), or the browser took its GPU context back. It shows
   * its still frame instead.
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
} & TestID;
```

## Usage Guidelines

**Do**

- Show it where the reply will appear while the answer is worked out, and swap it for the reply once it's in.
- Use it inside `RazorSenseChat` with a `RazorSenseBottomWave`, so thinking surges into the bottom wave when the answer arrives.

**Don't**

- Don't put long text in it; it's a one-line status label.
- Don't use it on React Native; it's web only.

## Example

### A thinking row

```jsx
import React from 'react';
import { Box, RazorSenseThinking } from '@razorpay/blade/components';

const ThinkingRow = () => (
  <Box paddingY="spacing.4">
    <RazorSenseThinking>Searching your settlements…</RazorSenseThinking>
  </Box>
);

export default ThinkingRow;
```
