# Amount

A number with its currency. By default Amount decides only the formatting:
`size`, `weight` and `color` are `inherit`, so it takes the surrounding
text's (inside a `Text`, a `Heading` or any styled text). Set `type` and
`size` to draw it as one of Blade DSL's Amount variants (Figma) instead. `getAmountByParts`
(`runes/amount`) formats with i18nify, as Blade does: its currency symbols
(SGD `S$` where the locale says `$`), the locale's grouping and side, and no
locale spacing. The component styles the parts apart: with `isAffixSubtle` (the default) the
currency and the decimals are smaller — 0.75em of the text while the size
inherits, or Figma's affix style for a set size. Figma's subtle affix is only
smaller, never faded.

| Prop | Notes |
| --- | --- |
| `value` | Required |
| `currency` | ISO 4217; default `INR` |
| `suffix` | `decimals` (default), `none` (floored), `humanize` (1.5K, 2L, 1Cr — by locale) |
| `fractionDigits` | With `decimals`: how many, default `2`; `auto` takes the currency's own (JPY 0, KWD 3) |
| `type` | `body` (default), `heading`, `display`: which of Figma's scales `size` picks from |
| `size` | `inherit` (default); body `xsmall`–`large`, heading `small`–`2xlarge`, display `small`–`xlarge` |
| `weight` | `inherit` (default); `regular`, `medium` (not heading), `semibold` |
| `color` | `inherit` (default), or one of Text's colours |
| `isAffixSubtle` | Default `true`: the currency and the decimals one style step smaller |
| `currencyIndicator` | `currency-symbol` (default) or `currency-code` |
| `isStrikethrough` | An old price: a `<del>`, whose line takes the text's colour; it also tells a reader |
| `unit` | `major` (default) or `minor` — paise, cents — scaled by the currency's own exponent |
| `locale` | Grouping and currency side; i18nify's (the platform's) by default |
| `symbol` | Replaces the currency symbol with the app's own (`RM`) |
| `class`, `testID` | As everywhere |

## Figma's scale

| Type | Sizes (value) | Subtle affix |
| --- | --- | --- |
| body | xsmall 10/13, small 12/17, medium 14/20, large 16/24 | 10/13 up to medium, 12/17 at large |
| heading | small 18/24, medium 20/26, large 24/32, xlarge 32/38, 2xlarge 40/46 (heading face) | body 12/17, 14/20, 16/24; heading 20/26, 24/32 |
| display | small 48/56, medium 56/64, large 64/70, xlarge 72/78 (heading face) | heading 32/38, 40/46, 40/46, 48/56 |

The currency symbol is always in the body face; the parts sit on one
baseline, 2px between currency and number.

A reader gets the whole amount as one string; the styled parts are hidden
from it, since split spans are read piecewise by some screen readers.

API parity with Blade React: see `src-cx/API-PARITY.md`.
