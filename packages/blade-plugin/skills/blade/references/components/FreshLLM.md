## Component Name

FreshLLM

## Description

FreshLLM is RazorSense in an assistant chat: thinking loops near the top while the answer is worked out, surges down to the chat input when it's in, and settles there to idle, pulsing into its typing surge as the next question is typed. It is one of the Fresh RazorSense components, which ship next to RazorSense (unchanged) and follow Blade's color scheme.

## Important Constraints

- Web only: it draws with WebGL2. On React Native it throws.
- Light and dark follow `BladeProvider`'s color scheme; there is no color scheme prop.
- It fills the chat panel it's laid over (an absolutely positioned `Box` covering the panel), on a clear background; the chat's messages and input sit above it.
- It follows the elements you point it at: `chatInputRef` (idle sits under the chat input, centred) and `thinkingRef` (thinking loops on the thinking row's spot). It measures them every frame, so it follows them as the chat moves. Without them, it lays itself out as Razorpay's reference chat (a chat input centred across the panel near its bottom).
- `scale` is held between 0.75 and 1.25 (the whole effect, bands included).
- Typing reaches it through `inputValue`, a typing signal: every change counts as a keystroke while idle; the text itself is never read or shown.
- It's decorative: hidden from screen readers (`aria-hidden`).
- It pauses off-screen; with reduced motion on, it shows one still frame of where it is.

## TypeScript Types

The following types represent the props that the FreshLLM component accepts.

```ts
type FreshLLMProps = {
  /**
   * `thinking`: while the answer is being worked out, RazorSense loops its thinking near the top. `idle`: the answer is in;
   * the thinking surges down to the chat input and settles there, idle (typing in the chat input brings in its typing surge).
   * Back to `thinking` for the next question: thinking starts again while idle fades.
   * @default 'thinking'
   */
  variant?: 'thinking' | 'idle';
  /**
   * The text in the chat input, as a typing signal: only its changes are read. While idle, each change is a keystroke: it
   * pulses into its typing surge and dies back down to idle after. The text itself is never read or shown.
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
   * The chat input: idle sits under it, centred, and follows it as it moves. Without it, FreshLLM lays itself out as the
   * reference chat (an input centred across the panel near its bottom).
   */
  chatInputRef?: React.RefObject<HTMLElement>;
  /**
   * The thinking row's spot (where an assistant's avatar sits before its "Thinking…" label): thinking loops on it, and follows it.
   */
  thinkingRef?: React.RefObject<HTMLElement>;
  /**
   * Width of the chat panel it fills (thinking and idle are placed in it by `thinkingRef` and `chatInputRef`).
   * @default '100%'
   */
  width?: string | number;
  /**
   * Height of the chat panel.
   * @default '100%'
   */
  height?: string | number;
} & TestID;
```

## Usage Guidelines

**Do**

- Lay it over the whole chat panel and keep the chat's content above it (a positioned wrapper after it).
- Set `variant="thinking"` while waiting for an answer and `variant="idle"` once it's in.
- Point `chatInputRef` at the chat input's wrapper and `thinkingRef` at the spot before the "Thinking…" label, so it lines up with your layout.
- Pass the chat input's text as `inputValue` so the idle strip reacts to typing.

**Don't**

- Don't toggle `variant` per token while an answer streams in; switch to `idle` once, when the answer starts showing.
- Don't clip the panel to the chat input's size; idle's strip runs along the panel's bottom edge.
- Don't use it on React Native; it's web only.

## Example

### An assistant chat panel

FreshLLM covers the panel, thinking on the row's spot while waiting, then settling under the chat input.

```jsx
import React from 'react';
import { Box, ChatInput, FreshLLM, Text } from '@razorpay/blade/components';

const AssistantChat = ({ isWaitingForAnswer, answer, onAsk }) => {
  const [text, setText] = React.useState('');
  const chatInputRef = React.useRef(null);
  const thinkingRef = React.useRef(null);
  return (
    <Box position="relative" height="100%">
      <Box position="absolute" top="spacing.0" left="spacing.0" width="100%" height="100%">
        <FreshLLM
          variant={isWaitingForAnswer ? 'thinking' : 'idle'}
          inputValue={text}
          chatInputRef={chatInputRef}
          thinkingRef={thinkingRef}
        />
      </Box>
      <Box
        position="relative"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        height="100%"
        padding="spacing.6"
      >
        <Box display="flex" alignItems="center" gap="spacing.3">
          <div ref={thinkingRef} style={{ width: 48, height: 40 }} />
          <Text>{isWaitingForAnswer ? 'Thinking…' : answer}</Text>
        </Box>
        <div ref={chatInputRef}>
          <ChatInput
            value={text}
            onChange={({ value }) => setText(value)}
            onSubmit={({ value }) => {
              onAsk(value);
              setText('');
            }}
          />
        </div>
      </Box>
    </Box>
  );
};

export default AssistantChat;
```
