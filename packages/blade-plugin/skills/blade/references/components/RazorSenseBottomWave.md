## Component Name

RazorSenseBottomWave

## Description

RazorSenseBottomWave is RazorSense under an assistant chat's input: wrap the chat input and a faint wave settles under it, drifting, and pulses up into its typing surge as the next question is typed. Inside `RazorSenseChat` it marks where the wave settles, so thinking surges down into it when the answer is in. It ships next to RazorSense and follows Blade's color scheme.

## Important Constraints

- Web only: it draws with WebGL2. On React Native it throws.
- Light and dark follow `BladeProvider`'s color scheme; there is no color scheme prop.
- It wraps the chat input (`children`): the wave sits under the input's bottom and spreads past its sides and below it (without growing the page). Keep the chat input near the bottom of its panel.
- Typing reaches it from the input itself: every edit typed in an input, textarea or editable element inside counts as a keystroke. What's typed is never read.
- On its own, the wave never draws over the input, but it can draw over things beside or under it that aren't positioned (give them `position: relative` to keep them above it). Inside `RazorSenseChat` it's behind everything in the chat.
- When it can't animate (no WebGL2, a GPU that only draws on the CPU such as a remote desktop or a VM, its engine failing to load, or frames under 20 a second for 3 seconds) it shows a still frame of itself instead and calls `onError`. The page keeps its frame rate. Each still is its own small module, downloaded only then.
- With reduced motion on it shows one still frame of the wave.
- The effect is decorative: hidden from screen readers. The chat input inside stays as it is.
- `scale` is held between 0.75 and 1.25.
- It draws at most 60 frames a second (a 120 Hz screen doesn't double its work); it pauses off-screen and in hidden tabs.
- Its `ref`, `className` and `style` go to its root element (web).

## TypeScript Types

The following types represent the props that the RazorSenseBottomWave component accepts.

```ts
type RazorSenseBottomWaveProps = {
  /**
   * The chat input it settles under. Typing in it (any input, textarea or editable element inside) pulses the wave up into its
   * typing surge; it dies back down when the typing stops. What's typed is never read.
   */
  children: React.ReactNode;
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
   * load, or its frames are too slow on this device (under 20 a second for 3 seconds). It shows its still frame instead.
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

- Wrap an assistant chat's input in it, inside `RazorSenseChat`, so thinking surges into it when an answer arrives.

**Don't**

- Don't put it on a landing's chat input on its own; use `RazorSenseChatBackground` there.
- Don't put both `RazorSenseBottomWave` and `RazorSenseChatBackground` on one chat input.
- Don't use it on React Native; it's web only.

## Example

### A chat input with the bottom wave

```jsx
import React from 'react';
import { Box, ChatInput, RazorSenseBottomWave } from '@razorpay/blade/components';

const ChatFooter = ({ onAsk }) => {
  const [text, setText] = React.useState('');
  return (
    <Box paddingX="spacing.6" paddingBottom="spacing.6">
      <RazorSenseBottomWave>
        <ChatInput
          value={text}
          onChange={({ value }) => setText(value)}
          onSubmit={({ value }) => onAsk(value)}
        />
      </RazorSenseBottomWave>
    </Box>
  );
};

export default ChatFooter;
```
