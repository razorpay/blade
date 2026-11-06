## Component Name

RazorSenseChat

## Description

RazorSenseChat is RazorSense through an assistant chat: thinking loops on the `RazorSenseThinking` label while the answer is worked out, surges down to the chat input when it's in, and settles there as the `RazorSenseBottomWave`, pulsing as the next question is typed. It draws both on one canvas over the chat panel, behind everything in it, so the surge runs from one to the other. It ships next to RazorSense and follows Blade's color scheme.

## Important Constraints

- Web only: it draws with WebGL2. On React Native it throws.
- Light and dark follow `BladeProvider`'s color scheme; there is no color scheme prop.
- Its only state prop is `isThinking`: true while the answer is worked out, false once it's in (the thinking surges down into the bottom wave). True again for the next question: the wave rises back up to the thinking label (the surge, backwards). Put a `RazorSenseThinking` where the reply will go while thinking, and wrap the chat input in `RazorSenseBottomWave`. It follows both every frame, so they can move as the chat scrolls.
- Without a `RazorSenseBottomWave` (or, while thinking, a `RazorSenseThinking`) inside, it lines up with Razorpay's reference chat instead, with a warning in development.
- Inside it, `RazorSenseThinking` and `RazorSenseBottomWave` don't draw themselves; their own `scale`, `isPaused`, `onLoad` and `onError` are ignored and the chat's apply.
- Mounted with `isThinking` false it starts settled on the bottom wave (no thinking replayed), and a color scheme or scale change doesn't replay it either.
- When it can't animate (no WebGL2, a GPU that only draws on the CPU such as a remote desktop or a VM, its engine failing to load, or frames under 20 a second for 3 seconds) it shows a still frame of itself instead and calls `onError`. The page keeps its frame rate. Each still is its own small module, downloaded only then. The chat's stills follow the thinking label and the chat input, and cross-fade when `isThinking` changes.
- With reduced motion on it shows one still frame of where it is, and the new one when `isThinking` changes.
- The effect is decorative: hidden from screen readers. The chat inside stays as it is.
- `scale` is held between 0.75 and 1.25.
- It draws at most 60 frames a second (a 120 Hz screen doesn't double its work); it pauses off-screen and in hidden tabs.
- Its `ref`, `className` and `style` go to its root element (web).

## TypeScript Types

The following types represent the props that the RazorSenseChat component accepts.

```ts
type RazorSenseChatProps = {
  /**
   * True while the answer is being worked out: RazorSense loops on the `RazorSenseThinking` label. When it turns false the
   * thinking surges down into the `RazorSenseBottomWave` under the chat input and settles there. True again for the next
   * question: the wave rises back up to the label (the surge, backwards) and thinks on. Changed mid-way, it turns round.
   * @default false
   */
  isThinking?: boolean;
  /**
   * The chat: its messages, a `RazorSenseThinking` where the thinking shows and a `RazorSenseBottomWave` round the chat input. RazorSenseChat draws both on one canvas over its whole box, behind everything in it (their own `scale`, `isPaused`,
   * `onLoad` and `onError` are ignored inside it: the chat's apply).
   */
  children: React.ReactNode;
  /**
   * Width of the chat panel it draws over.
   * @default '100%'
   */
  width?: string | number;
  /**
   * Height of the chat panel it draws over.
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

- Wrap the whole chat panel in `RazorSenseChat`, with a `RazorSenseThinking` showing while waiting and the chat input wrapped in `RazorSenseBottomWave`.
- Set `isThinking` true when a question is sent and false once the answer starts showing.

**Don't**

- Don't toggle `isThinking` per token while an answer streams in; set it false once.
- Don't use it on React Native; it's web only.

## Example

### An assistant chat

```jsx
import React from 'react';
import {
  Box,
  ChatInput,
  ChatMessage,
  RazorSenseBottomWave,
  RazorSenseChat,
  RazorSenseThinking,
  Text,
} from '@razorpay/blade/components';

const AssistantChat = ({ messages, isWaitingForAnswer, onAsk }) => {
  const [text, setText] = React.useState('');
  return (
    <Box height="100vh">
      <RazorSenseChat isThinking={isWaitingForAnswer}>
        <Box display="flex" flexDirection="column" height="100%" maxWidth="800px" marginX="auto">
          <Box flex="1" overflowY="auto" display="flex" flexDirection="column" gap="spacing.8">
            {messages.map((message) =>
              message.isUser ? (
                <ChatMessage key={message.id} senderType="self">
                  {message.text}
                </ChatMessage>
              ) : (
                <Text key={message.id}>{message.text}</Text>
              ),
            )}
            {isWaitingForAnswer ? <RazorSenseThinking>Thinking…</RazorSenseThinking> : null}
          </Box>
          <RazorSenseBottomWave>
            <ChatInput
              value={text}
              onChange={({ value }) => setText(value)}
              onSubmit={({ value }) => {
                onAsk(value);
                setText('');
              }}
            />
          </RazorSenseBottomWave>
        </Box>
      </RazorSenseChat>
    </Box>
  );
};

export default AssistantChat;
```
