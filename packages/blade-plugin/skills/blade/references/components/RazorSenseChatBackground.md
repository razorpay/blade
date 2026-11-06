## Component Name

RazorSenseChatBackground

## Description

RazorSenseChatBackground is RazorSense behind a chat input on a landing: wrap the chat input and a soft fluted strip sits behind it, drifting and breathing; as someone types it pulses into its typing surge and dies back down when they stop. It ships next to RazorSense and follows Blade's color scheme.

## Important Constraints

- Web only: it draws with WebGL2. On React Native it throws.
- Light and dark follow `BladeProvider`'s color scheme; there is no color scheme prop.
- It wraps the chat input (`children`): the strip stretches to the input's width and height (the bands keep their size) and its glow spills outside it, behind the input and over the page. The spill doesn't grow the page (no scrollbars).
- It fits chat inputs from 280 px wide (a phone's) to 1260 px, and from 58 px tall to 320 px (a chat input grows with lines and attachments, and the band grows with it); past those it stretches as for the nearest end, centred on the input.
- Typing reaches it from the input itself: every edit typed in an input, textarea or editable element inside counts as a keystroke. What's typed is never read.
- It's for a chat input on its own (a landing, a home screen). In an assistant chat, use `RazorSenseBottomWave` inside `RazorSenseChat` instead.
- When it can't animate (no WebGL2, a GPU that only draws on the CPU such as a remote desktop or a VM, its engine failing to load, or frames under 20 a second for 3 seconds) it shows a still frame of itself instead and calls `onError`. The page keeps its frame rate. Each still is its own small module, downloaded only then.
- With reduced motion on it shows one still frame of its idle strip.
- `scale` is held between 0.75 and 1.25 (the whole effect, bands included).
- The effect is decorative: hidden from screen readers. The chat input inside stays as it is.
- It draws at most 60 frames a second (a 120 Hz screen doesn't double its work); it pauses off-screen and in hidden tabs.
- Its `ref`, `className` and `style` go to its root element (web).

## TypeScript Types

The following types represent the props that the RazorSenseChatBackground component accepts.

```ts
type RazorSenseChatBackgroundProps = {
  /**
   * The chat input it sits behind (flow 9's landing). The strip stretches to the input's width and height, the bands keeping
   * their size, and its glow spills outside it. Fits chat inputs 280-1260 px wide (a phone's, up to 1.5x flow 9's 840) and
   * 58-320 px tall (growing with lines or attachments); past those it stretches as for the nearest end, centred on the input.
   * Typing in it (any input, textarea or editable element inside) pulses the strip into its typing surge; it dies back down when
   * the typing stops. What's typed is never read.
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

- Wrap the landing's chat input in it, directly: its box is the input's.
- Leave the space round the input open (it's a glow behind the input that spills past it).

**Don't**

- Don't put it round a chat input inside an assistant chat; use `RazorSenseBottomWave` in `RazorSenseChat` there.
- Don't put both `RazorSenseChatBackground` and `RazorSenseBottomWave` on one chat input (two strips would overlap).
- Don't use it on React Native; it's web only.

## Example

### A landing's chat input

```jsx
import React from 'react';
import { Box, ChatInput, RazorSenseChatBackground } from '@razorpay/blade/components';

const Landing = ({ onAsk }) => {
  const [text, setText] = React.useState('');
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      paddingX="spacing.6"
    >
      <Box width="100%" maxWidth="840px">
        <RazorSenseChatBackground>
          <ChatInput
            placeholder="Ask anything..."
            value={text}
            onChange={({ value }) => setText(value)}
            onSubmit={({ value }) => onAsk(value)}
          />
        </RazorSenseChatBackground>
      </Box>
    </Box>
  );
};

export default Landing;
```
