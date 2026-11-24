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
- When it can't animate (no WebGL2, a GPU that only draws on the CPU such as a remote desktop or a VM, its engine failing to load, or frames under 20 a second for 3 seconds even at its lowest step) it shows a still frame of itself instead and calls `onError`. The page keeps its frame rate. Too slow counts for the whole page: once one RazorSense 2.0 animation is too slow, every one on the page shows its still, including ones mounted later, until the page reloads. Each still is its own small module, downloaded only then.
- With reduced motion on it shows one still frame of its idle strip.
- `scale` is held between 0.75 and 1.25 (the whole effect, bands included).
- The effect is decorative: hidden from screen readers. The chat input inside stays as it is.
- It draws at most 60 frames a second (a 120 Hz screen doesn't double its work); it pauses off-screen and in hidden tabs, and gives its GPU memory back once it has been out of sight for 30 seconds (it takes it again just before it scrolls back in). On a device that can't hold 45 frames a second it steps down, page-wide, before its still: every other frame, then fewer pixels too (its canvas at 0.75, then 0.5 of a CSS px, scaled up by the browser).
- Its `ref`, `className` and `style` go to its root element (web).
- Its states, with the same names as Ray's: `isOffline` (it fades away under its colours, 1 s, and back) and `isListening` with `voiceStream` (the voice dashboard: its strip morphs into a row of blobs along its line, each a pitch band of the page's voice; it never opens the microphone itself, the page hands it its own stream). Offline wins: listening goes at once. Each turns back mid-way. The voice dashboard's chunk loads the first time it listens, and draws on its one canvas. With reduced motion each is a still frame; where it can't animate, listening shows a still of its own.

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

### Listening, and offline

```jsx
import React from 'react';
import { ChatInput, RazorSenseChatBackground } from '@razorpay/blade/components';

// `micStream` is the MediaStream the page's dictation already opened
const Landing = ({ isDictating, micStream, isOnline }) => (
  <RazorSenseChatBackground isListening={isDictating} voiceStream={micStream} isOffline={!isOnline}>
    <ChatInput placeholder="Ask anything..." />
  </RazorSenseChatBackground>
);

export default Landing;
```
