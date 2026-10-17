# Typography

`Text`, `Heading`, `Display` and `Code` have no behaviour, so no behaviour model is behind them:
the whole component
(`components/{text,heading,display,code}/`) and
their shared contract (`components/shared/typography.ts`) are style-only; nothing of them is in the core.

## Props

| Prop | Notes |
| --- | --- |
| `as` | The element. Text: `p` (default), `span`, `div`. Heading: `h1`–`h6` (default `h2`). Display: `h1` (default)–`h6` or `span`. The document level is independent of `size`. Code is always a `<code>` in an inline `<span>` |
| `children`, `class`, `testID` | As everywhere: `class` is merged last |
| style props | `size`, `weight`, `color`, `textAlign`; Text adds `truncate` (lines to clamp to). Code has `size`, `weight`, `isHighlighted`, and `color` only when not highlighted |

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
heading face, no letter-spacing.

| Display `size` | Figma style | Size / line |
| --- | --- | --- |
| `small` (default) | Display/Small | 48/56 |
| `medium` | Display/Medium | 56/64 |
| `large` | Display/Large | 64/70 |
| `xlarge` | Display/XLarge | 72/78 |

Display weights: `regular`, `medium`, `semibold` (default), in the heading
face. Semibold sets at 0%; Regular and Medium at -1.3%, as in Figma.

| Code `size` | Figma style | Size / line |
| --- | --- | --- |
| `small` (default) | CodeSmall | 10/14 |
| `medium` | CodeMedium | 12/18 |

Code weights: `regular` (default) and `bold`, in the code face (Menlo), no
letter-spacing. Code is inline, for a token or variable name in a line of
Text. By default it's highlighted: a neutral chip (`feedback.background.neutral.subtle`,
4px either side, xsmall corners) in the subtle text colour. With
`isHighlighted={false}` it's plain, and only then takes `color`. React sets
Code's lines at 13 and 17; cx follows Figma's 14 and 18.

Figma's Caption styles have no component here yet.
