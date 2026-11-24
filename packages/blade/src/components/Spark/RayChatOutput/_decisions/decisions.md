# RayChatOutput Decisions

RayChatOutput draws RAY's chat text: the words outside the cards. The cards follow their own design system (GenUI's CARD, TABLE and the rest).

- [Design](#design)
- [API](#api)
- [How it's built](#how-its-built)
- [Left out on purpose](#left-out-on-purpose)

## Design

[Figma: Agentic Dashboard, light and dark](https://www.figma.com/design/zDA6HofksN59UPR8Kkt4vU/Agentic-Dashboard?node-id=2947-31563)

The owner picked these values on 24 Nov 2026. They are all Blade tokens; the Figma frame's off-scale 22px title and 22px body line height were moved onto the scale.

| Part               | Style                                                                                                                                        |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Main title, titles | TASA Orbiter 500, 20/26 (`size[400]` / `lineHeights[400]`), `surface.text.gray.normal`                                                       |
| Body               | Inter 400, 14/24 (`size[100]` / `lineHeights[200]`), −1.3% (`letterSpacings[50]`), `surface.text.gray.subtle`                                |
| Lists              | 14/26 (`lineHeights[400]`)                                                                                                                   |
| Bold               | `surface.text.gray.normal`, 600 in light and 700 in dark (as in Figma)                                                                       |
| Gaps               | 12 under a title and between a paragraph's lines (`spacing.4`; Figma 11), 16 between blocks (`spacing.5`), 24 before a section (`spacing.7`) |

## API

```tsx
<RayChatOutput>{markdown}</RayChatOutput>

<GenUIProvider config={{ components: { TEXT: rayChatOutputGenUI } }}>
  <GenUISchemaRenderer components={reply} isAnimating={isStreaming} />
</GenUIProvider>
```

- **Children are the Markdown string.** No other props: there are no variants, sizes or colours to pick. testID, analytics attributes and styled props work as in every Blade component.
- **`rayChatOutputGenUI` instead of a change to GenUI.** GenUI already lets an app replace a component type, so RAY's app opts in with one line, and other GenUI users see no change. It keeps GenUI's streaming word fade. GenUI's spacing already puts 24 between TEXT and a card.

## How it's built

```
markdown ─▶ cleanRayText ─▶ react-markdown (remark-parse ─▶ remarkRayChat ─▶ hast ─▶ [word fade]) ─▶ elements
            wrapper · \n · emoji      line breaks · main title (first block) · divider → gap · data-ray-chat-gap
```

- **`cleanRayText`** tidies what RAY writes. It unwraps the `{"assistant_reply": …}` wrapper (even mid-stream), turns a literal `\n` into a line break, and drops emoji. Code is left as written.
- **`remarkRayChat`** applies the chat rules to the top-level blocks. Each gap lives on its block as `data-ray-chat-gap`, so one styled container maps it to a spacing token, and tests can read it without a layout engine.
- **Why not `Text` / `Heading`:** `Text` medium is 14/20 and has no line-height prop; the body is 14/24. One container styling plain Markdown elements keeps all three text styles in one place.
- **Tests:** Jest mocks react-markdown (it's ESM-only), so Jest covers `cleanRayText`, `remarkRayChat` on hand-built trees, and the wiring. `__tests__/RayChatOutput.test.stories.tsx` runs the full Markdown path in a browser and checks the computed sizes and gaps.

## Left out on purpose

- **Turn-level rules** need the whole turn, not one message, so they belong where the turn is assembled:
  - drop RAY's "Fetching your … details" lines once the card is in;
  - keep only the first of two messages that say the same thing;
  - 16 between messages.
- **Tables** are drawn as cards (the owner: tables and cards are handled separately), so there's no `remark-gfm`. `cleanRayText` turns a Markdown table in RAY's text into an aligned plain-text block instead of rows of pipes. Strikethrough and task lists aren't parsed either.
- **Nothing restyles while streaming (the owner, 24 Nov).** Every rule looks only at a block and the blocks before it.
  - **Main title:** the opening paragraph is the main title, decided by the first block alone. Before, it was the main title only when the reply had sections, so it jumped from body to title when the first `###` arrived. A reply without sections now opens with the main title too.
  - **Bold lines:** a bold line on its own stays bold body text, as Figma draws "Important nuance:". A title rule could only apply once its `**` closed.
  - **Tables:** a table is a block from its first `|` row.
  - **GenUI:** only the reply's first component opens with the main title.
  - **The check:** `StreamsWithoutJumps` streams a reply word by word and checks that no drawn block changes its look. Markdown still changes inline text as it closes (`**bold**` turns bold), and the last block can change while its own syntax is half typed (a lone `-` is a list until it becomes `---`).
- **Line breaks inside bold or links** stay as spaces. Only line breaks directly in a paragraph start a new one.
- **React Native:** not yet. It throws, like the other Spark components.
