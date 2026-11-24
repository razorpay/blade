## Component Name

RazorSenseBottomWave

## Description

RazorSenseBottomWave is RazorSense under an assistant chat's input: wrap the chat input and a faint wave settles under it, drifting, and pulses up into its typing surge as the next question is typed. Inside `RazorSenseChat` it marks where the wave settles, so thinking surges down into it when the answer is in. It ships next to RazorSense and follows Blade's color scheme.

## Important Constraints

- Web only: it draws with WebGL2. On React Native it throws.
- Light and dark follow `BladeProvider`'s color scheme; there is no color scheme prop.
- It wraps the chat input (`children`): the wave sits under the input's bottom and spreads past its sides and below it (without growing the page). Keep the chat input near the bottom of its panel.
- Typing reaches it from the input itself: every edit typed in an input, textarea or editable element inside counts as a keystroke. What's typed is never read.
- Inside `RazorSenseChat` its own `scale`, `isPaused`, `onLoad` and `onError` don't apply: set them on `RazorSenseChat`. In development it warns when they're set there.
- On its own, the wave never draws over the input, but it can draw over things beside or under it that aren't positioned (give them `position: relative` to keep them above it). Inside `RazorSenseChat` it's behind everything in the chat.
- When it can't animate (no WebGL2, a GPU that only draws on the CPU such as a remote desktop or a VM, its engine failing to load, or frames under 20 a second for 3 seconds even at its lowest step) it shows a still frame of itself instead and calls `onError`. The page keeps its frame rate. Too slow counts for the whole page: once one RazorSense 2.0 animation is too slow, every one on the page shows its still, including ones mounted later, until the page reloads. Each still is its own small module, downloaded only then.
- With reduced motion on it shows one still frame of the wave.
- The effect is decorative: hidden from screen readers. The chat input inside stays as it is.
- `scale` is held between 0.75 and 1.25.
- It draws at most 60 frames a second (a 120 Hz screen doesn't double its work); it pauses off-screen and in hidden tabs, and gives its GPU memory back once it has been out of sight for 30 seconds (it takes it again just before it scrolls back in). On a device that can't hold 45 frames a second it steps down, page-wide, before its still: every other frame, then fewer pixels too (its canvas at 0.75, then 0.5 of a CSS px, scaled up by the browser).
- Its `ref`, `className` and `style` go to its root element (web).
- It isn't RazorSense's `preset="bottomWave"`: that one is a static image, a decorative strip. Use RazorSenseBottomWave for the animated wave under a chat input.
- On its own it takes the same states as `RazorSenseChat` (`isOffline`, `isListening` with `voiceStream`, `outcome`); inside a `RazorSenseChat` they're the chat's (its own are ignored, with a warning in development). `outcome` is set once an answer that ran a task has filled in, after the bottom surge has settled into the wave. On its own its canvas reaches a little above the input; while an outcome plays it reaches the window's sides and top, so the splash is never cut, and gives that back after (its GPU memory at rest is unchanged).

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
   * Called once it's showing: its first frame drawn on the GPU, or, with reduced motion where that's a still (RazorSenseBackground), its still.
   */
  onLoad?: () => void;
  /**
   * Called when it can't animate: no WebGL2, a GPU that only draws on the CPU (a software renderer), its engine failed to
   * load, its frames are too slow on this device even at its lowest step (under 20 a second for 3 seconds, counted after its
   * first 2), or the browser took its GPU context back. It shows its still frame instead. Too slow counts for the whole page:
   * once one RazorSense 2.0 animation finds that, every one on the page shows its still, including ones mounted later, until
   * the page reloads. Before that, the page starts at its device's level (a known weak GPU a step or two down) and steps down
   * page-wide while it can't keep up (under 45 a second): every other frame, then fewer pixels too (its canvas at 0.75, then 0.5
   * of a CSS px, scaled up by the browser); once frames hold again, it steps back up (after three step ups that
   * don't hold, it stays down).
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
  /**
   * While true, RazorSense goes away (the app is offline): on a landing it fades away under its colours, under a chat input it
   * drops below the page's edge. Back to false, it comes back the same way.
   * @default false
   */
  isOffline?: boolean;
  /**
   * While true, RazorSense listens: it morphs into its voice look, a row of blobs moving with `voiceStream`'s voice (each a pitch
   * band of it), breathing while it's silent. Back to false, it morphs back.
   * @default false
   */
  isListening?: boolean;
  /**
   * The page's own microphone stream while it listens (the one it already has for its dictation). RazorSense only reads its levels,
   * once a frame, and never opens the microphone itself. Without it, the voice look shows as it does in silence.
   */
  voiceStream?: MediaStream;
  /**
   * How the task the answer did ended: set it as the answer shows it (the ✓, or the failing step) and the bottom strip plays its
   * success (green) or error (red) wave once, ending back at its rest. Set while it's still thinking, it waits for the answer to
   * settle. Cleared mid-way, it plays back; the next question plays it out quickly before the thinking comes back up. It plays once
   * each time it's set, and once each answer: clear it as the page sends the next question (a new color scheme or scale doesn't play
   * it again).
   */
  outcome?: 'success' | 'error';
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

### Listening on its own

```jsx
import React from 'react';
import { ChatInput, RazorSenseBottomWave } from '@razorpay/blade/components';

// `micStream` is the MediaStream the page's dictation already opened
const Composer = ({ isDictating, micStream }) => (
  <RazorSenseBottomWave isListening={isDictating} voiceStream={micStream}>
    <ChatInput placeholder="Ask anything..." />
  </RazorSenseBottomWave>
);

export default Composer;
```
