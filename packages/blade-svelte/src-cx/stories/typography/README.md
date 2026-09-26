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
