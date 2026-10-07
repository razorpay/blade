# Typography

`Text` and `Heading` have no behaviour, so no behaviour model is behind them:
the whole component
(`components/text/Text.svelte`, `components/heading/Heading.svelte`) and
their shared contract (`components/shared/typography.ts`) are style-only; nothing of them is in the core.

## Props

| Prop | Notes |
| --- | --- |
| `as` | The element. Text: `p` (default), `span`, `div`. Heading: `h1`–`h6` (default `h2`) — the document level, independent of `size` |
| `children`, `class`, `testID` | As everywhere: `class` is merged last |
| style props | `size`, `weight`, `color`, `textAlign`; Text adds `truncate` (lines to clamp to) — all owned by the style axes |

## Scale

The sizes are Blade DSL's text styles (Figma's Typography page):

| Text `size` | Figma style | Size / line | Letter-spacing |
| --- | --- | --- | --- |
| `xsmall` | Body/XSmall | 10/13 | -1.3% |
| `small` | Body/Small | 12/17 | -1.3% |
| `medium` (default) | Body/Medium | 14/20 | -1.3% |
| `large` | Body/Large | 16/24 | -3.3% |

Text weights: `regular`, `medium`, `semibold`.

| Heading `size` | Figma style | Size / line |
| --- | --- | --- |
| `small` | Heading/Small | 18/24 |
| `medium` (default) | Heading/Medium | 20/26 |
| `large` | Heading/Large | 24/32 |
| `xlarge` | Heading/XLarge | 32/38 |
| `2xlarge` | Heading/2XLarge | 40/46 |

Heading weights: `regular` and `semibold` (default), Figma's only two; the
heading face, no letter-spacing. Figma's Caption, Code and Display styles
have no component here yet.
