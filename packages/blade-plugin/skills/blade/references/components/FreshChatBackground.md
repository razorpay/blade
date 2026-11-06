## Component Name

FreshChatBackground

## Description

FreshChatBackground is RazorSense behind a chat input: idle, a soft fluted strip drifts and breathes; as someone types it pulses into its typing surge and dies back down to idle when they stop. It is one of the Fresh RazorSense components, which ship next to RazorSense (unchanged) and follow Blade's color scheme.

## Important Constraints

- Web only: it draws with WebGL2. On React Native it throws.
- It's for a chat input on its own (a landing, a home screen). Inside an assistant chat use `FreshLLM`: its idle is this same strip under the chat input, so don't put both on one chat input (two strips would overlap).
- Light and dark follow `BladeProvider`'s color scheme; there is no color scheme prop.
- Its box is the chat input's box: lay it over the chat input (an absolutely positioned `Box` the input's size) and keep the input above it. Its glow spills outside the box on a clear background.
- The strip stretches to the box's width and height while the bands keep their size. It fits chat inputs 504–1260 px wide and 58–146 px tall; outside that it stretches as for the nearest end, centred on the input, with a warning in development.
- `scale` is held between 0.75 and 1.25 (the whole effect, bands included).
- Typing reaches it through `inputValue`, a typing signal: every change counts as a keystroke; the text itself is never read or shown.
- It's decorative: hidden from screen readers (`aria-hidden`).
- It pauses off-screen; with reduced motion on, it holds still.

## TypeScript Types

The following types represent the props that the FreshChatBackground component accepts.

```ts
type FreshChatBackgroundProps = {
  /**
   * `idle`: the soft fluted strip behind the chat input, drifting and breathing. `typing-surge`: held in its typing surge, as
   * while someone types, with its rhythm. Either way, every change to `inputValue` is a keystroke: the typing surge pulses in
   * with it and dies back down to idle after.
   * @default 'idle'
   */
  variant?: 'idle' | 'typing-surge';
  /**
   * The text in the chat input it sits behind, as a typing signal: only its changes are read (each one counts as a keystroke).
   * The text itself is never read or shown.
   */
  inputValue?: string;
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
   * The chat input's width: lay the chat background over the chat input (its box is the input's). The strip stretches across to
   * fit it, the bands keeping their size, and its glow spills outside the box. Fits chat inputs 504-1260 px wide.
   * @default '100%'
   */
  width?: string | number;
  /**
   * The chat input's height. The strip stretches down to fit it. Fits chat inputs 58-146 px tall.
   * @default '100%'
   */
  height?: string | number;

  /**
   * Called once the animation is drawing (its engine loaded and running on the GPU)
   */
  onLoad?: () => void;

  /**
   * Called when it can't draw: no WebGL2, a GPU that only draws on the CPU (a software renderer), or its engine failed to
   * load. The component then shows as the page would without it
   */
  onError?: (error: Error) => void;
} & TestID;
```

## Usage Guidelines

**Do**

- Lay it over the chat input with the same size, and keep the chat input above it (a positioned wrapper after it).
- Pass the chat input's text as `inputValue` so the typing surge follows the user's typing.
- Use `variant="typing-surge"` to hold the surge while input arrives another way (for example, voice input).
- Leave room round the chat input: the glow spills well outside the box.

**Don't**

- Don't put it inside a container with `overflow: hidden` the size of the input; the glow is cut off.
- Don't use it behind other components (cards, buttons); it's made for a chat input.
- Don't use it on React Native; it's web only.

## Example

### Behind a landing chat input

The chat background laid over the chat input, reacting as the user types.

```jsx
import React from 'react';
import { Box, ChatInput, FreshChatBackground } from '@razorpay/blade/components';

const LandingChat = () => {
  const [text, setText] = React.useState('');
  return (
    <Box position="relative" width="100%" maxWidth="840px">
      <Box position="absolute" top="spacing.0" left="spacing.0" width="100%" height="100%">
        <FreshChatBackground inputValue={text} />
      </Box>
      <Box position="relative">
        <ChatInput
          value={text}
          onChange={({ value }) => setText(value)}
          placeholder="Ask about orders, failures or reports"
        />
      </Box>
    </Box>
  );
};

export default LandingChat;
```

### Holding the typing surge during voice input

While the microphone is listening there are no keystrokes, so hold the surge with the variant.

```jsx
import React from 'react';
import { Box, FreshChatBackground } from '@razorpay/blade/components';

const VoiceChatBackground = ({ isListening, text }) => {
  return (
    <Box position="absolute" top="spacing.0" left="spacing.0" width="100%" height="100%">
      <FreshChatBackground variant={isListening ? 'typing-surge' : 'idle'} inputValue={text} />
    </Box>
  );
};

export default VoiceChatBackground;
```
