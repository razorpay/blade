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
- **RAY's cleaning is always on, by design.** RayChatOutput is RAY's component, so tidying what RAY writes is part of its job, not an option. There's no prop to turn it off. `cleanRayText` does four things, and leaves code as written:
  - unwraps RAY's `{"assistant_reply": …}` JSON wrapper, even mid-stream;
  - turns a literal `\n` into a line break;
  - drops emoji (the owner: "NO EMOJIS EVER");
  - turns a Markdown table into an aligned plain-text block.
- **It differs from GenUI's TEXT on purpose.** It draws the chat typography the owner picked:

  - one title size, TASA 20/26, for the main title and every heading level;
  - body 14/24 and lists 14/26 with a 20 indent;
  - inline IDs and code in Inter on a light tint;
  - bold-only lines as bold body text;
  - italic and quotes plain, and no divider line.

  GenUI's TEXT keeps Blade's general Markdown look. Only apps that pass `rayChatOutputGenUI` as GenUI's TEXT get RayChatOutput's look; stock GenUI keeps its TEXT. Links (Blade's Link) and code blocks (GenUI's, with copy) are shared.

## How it's built

```
markdown ─▶ cleanRayText ─▶ react-markdown (remark-parse ─▶ remarkRayChat ─▶ hast ─▶ [word fade]) ─▶ elements
            wrapper · \n · emoji      line breaks · main title (if a title follows) · divider → gap · data-ray-chat-gap
```

- **`cleanRayText`** tidies what RAY writes. It unwraps the `{"assistant_reply": …}` wrapper (even mid-stream), turns a literal `\n` into a line break, and drops emoji. Code is left as written.
- **`remarkRayChat`** applies the chat rules to the top-level blocks. Each gap lives on its block as `data-ray-chat-gap`, so one styled container maps it to a spacing token, and tests can read it without a layout engine.
- **Shared with GenUI's TEXT:** links are Blade's `Link`, and code blocks are GenUI's (language and copy button), from `GenUI/MarkdownCodeBlock.web.tsx`. That module was moved out of GenUIComponents unchanged, so RayChatOutput doesn't import all of GenUI. The chat keeps its own rules for the rest:
  - headings and body: the picked typography;
  - lists: Figma's 14/26 and 20 indent (GenUI's are 14/20 with 12 between items);
  - inline code: Inter on a tint (GenUI's is 11px code font);
  - italic plain, quotes plain, and no divider line (the 24 gap does it).
    A Blade link is underlined on hover only, where the chat rule says underlined; Blade's behaviour wins, as with the other picked values.
- **Why not `Text` / `Heading`:** `Text` medium is 14/20 and has no line-height prop; the body is 14/24. One container styling plain Markdown elements keeps all three text styles in one place.
- **Tests:** Jest mocks react-markdown (it's ESM-only), so Jest covers `cleanRayText`, `remarkRayChat` on hand-built trees, and the wiring. `__tests__/RayChatOutput.test.stories.tsx` runs the full Markdown path in a browser and checks the computed sizes and gaps.

## Left out on purpose

- **Turn-level rules** need the whole turn, not one message, so they belong where the turn is assembled:
  - drop RAY's "Fetching your … details" lines once the card is in;
  - keep only the first of two messages that say the same thing;
  - 16 between messages.
- **Tables** are drawn as cards (the owner: tables and cards are handled separately), so there's no `remark-gfm`. `cleanRayText` turns a Markdown table in RAY's text into a `ray-table` block: one row per line, cells split by tabs, and the columns' alignment after the block's name. RayChatOutput draws it as aligned plain text: a borderless table in the body font (Inter, which has ₹) with tabular figures and a bold header row. It's not a code block, so it has no copy button and no code font. It scrolls sideways only when it's too wide. Strikethrough and task lists aren't parsed either.
- **Nothing restyles while streaming (the owner, 24 Nov).**
  - **Main title:** the opening paragraph is the main title when the block right after it is a title; a short reply stays body text (the owner: "short replies can be chill"). A reply whose first title comes later than the second block keeps the paragraph as body.
  - **The smooth grow (the owner's pick):** while a reply streams, the opening paragraph shows straight away as body text, with GenUI's word fade. If a title arrives after it, it grows into the main title with the owner's "nice ease", a soft ease-out `cubic-bezier(0.22, 1, 0.36, 1)` over 320 ms. That's not a Blade motion token; none matches. Size, line height, letter spacing, colour, the font crossfade and the height glide all use it. Inter to TASA can't be interpolated, so a body-text copy (`data-ray-chat-was`, aria-hidden) fades out over the growing text. The paragraph's height grows with it, so the text below glides. Reduced motion switches at once. A transition only runs on a change, so a finished reply opens in its final style and needs no streaming signal; there's no `isStreaming` prop.
  - **Other rules** look only at a block and the blocks before it.
  - **Bold lines:** a bold line on its own stays bold body text, as Figma draws "Important nuance:". A title rule could only apply once its `**` closed.
  - **Tables:** a table is a block from its first `|` row.
  - **GenUI:** only the reply's first component can open with the main title.
  - **The check:** `StreamsWithoutJumps` streams a reply word by word and checks that no drawn block changes its look. The opening paragraph may change once, into the main title, with the crossfade. `ShortReplyEndsAsBody` checks that a short reply shows while it streams and ends as body text. Markdown still changes inline text as it closes (`**bold**` turns bold), and the last block can change while its own syntax is half typed (a lone `-` is a list until it becomes `---`).
- **Line breaks inside bold or links** stay as spaces. Only line breaks directly in a paragraph start a new one.
- **React Native:** not yet. It throws, like the other Spark components.
