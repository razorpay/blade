## Component Name

RayChatOutput

## Description

RayChatOutput draws RAY's chat text: the words an AI assistant writes outside the cards (answers, questions back, "nothing found", lead-ins to a card). It takes one message as Markdown and draws it the way RAY's chat looks. When the reply has sections, its first paragraph is the main title; then come titles, body text, lists, inline IDs and code. `rayChatOutputGenUI` makes GenUI draw its `TEXT` this way, while GenUI's cards and tables stay its own.

## Important Constraints

- The children must be a Markdown **string**: one chat message.
- RAY's text is tidied before it's drawn. Its `{"assistant_reply": "…"}` JSON wrapper is unwrapped (also while it streams), a literal `\n` becomes a line break, and emoji are left out. Code is left as written.
- How each part is drawn:
  - Every heading level, and a **bold** line on its own, is drawn as the one title style.
  - Italic is drawn as plain text.
  - A `---` divider draws no line; the block after it starts 24px lower.
  - Raw HTML is left out, and an image is drawn as its alt text.
- Tables are drawn as cards, so the chat doesn't parse them. A Markdown table in the text becomes an aligned plain-text block. Strikethrough and task lists (GFM) aren't parsed either.
- Its width is the container's: put it in the chat column.
- Web only. On React Native it throws.

## TypeScript Types

```typescript
type RayChatOutputProps = {
  /**
   * RAY's reply: one chat message, in Markdown.
   * It's tidied before it's drawn: RAY's JSON wrapper is unwrapped (also while it streams),
   * a literal `\n` becomes a line break, and emoji are left out.
   */
  children: string;
  testID?: string;
} & StyledPropsBlade &
  DataAnalyticsAttribute;
```

`rayChatOutputGenUI` is a GenUI component definition: pass it as `TEXT` in `GenUIProvider`'s `config.components`.

## Usage Guidelines

- Use it for an AI assistant's chat text in RAY-styled chats. For the user's own messages use `ChatMessage` with `senderType="self"`.
- **Type** (all Blade tokens):
  - Main title and titles: TASA Orbiter 500, 20/26, `surface.text.gray.normal`.
  - Body: Inter 400, 14/24, −1.3%, `surface.text.gray.subtle`.
  - Lists: 14/26.
  - Bold: `gray.normal`, 600 in light and 700 in dark.
- **Gaps:** 12px under a title and between a paragraph's lines, 16px between blocks, 24px before a section.
- **With GenUI:** pass `rayChatOutputGenUI` as the `TEXT` component. GenUI already puts 24px between text and a card, and keeps its word fade while `isAnimating` is on.

## Example

```tsx
import React from 'react';
import {
  Box,
  ChatMessage,
  RayChatOutput,
  GenUIProvider,
  GenUISchemaRenderer,
  rayChatOutputGenUI,
} from '@razorpay/blade/components';

const reply = `Your payouts for September are on time.

### Settled this week
Two settlements reached your bank: **₹48,200** on 23 Sep and **₹12,900** on 24 Sep.

- Ask about any payment ID, like \`pay_29QQoUBi66xm2f\`, to see where it is.`;

export const RayAnswer = () => (
  <Box maxWidth="752px" display="flex" flexDirection="column" gap="spacing.7">
    <Box alignSelf="flex-end">
      <ChatMessage senderType="self">Are my payouts on time?</ChatMessage>
    </Box>
    <RayChatOutput>{reply}</RayChatOutput>
  </Box>
);

// RAY's GenUI replies: TEXT drawn by the chat rules, cards stay GenUI's
export const RayGenUIAnswer = ({ components, isStreaming }) => (
  <GenUIProvider config={{ components: { TEXT: rayChatOutputGenUI } }}>
    <GenUISchemaRenderer components={components} isAnimating={isStreaming} />
  </GenUIProvider>
);
```
