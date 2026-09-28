# Amount

A number with its currency. Amount decides only the formatting: its size,
weight, colour and face are the surrounding text's, so it sits inside a
`Text` or `Heading` (or any styled text) and takes that. `getAmountByParts`
(`runes/amount`) formats with i18nify, as Blade does: its currency symbols
(SGD `S$` where the locale says `$`), the locale's grouping and side, and no
locale spacing. The component styles the parts apart: by default the currency
and the decimals are smaller (0.75em, so they follow the text) and at 64%
opacity.

| Prop | Notes |
| --- | --- |
| `value` | Required |
| `currency` | ISO 4217; default `INR` |
| `suffix` | `decimals` (default), `none` (floored), `humanize` (1.5K, 2L, 1Cr — by locale) |
| `fractionDigits` | With `decimals`: how many, default `2`; `auto` takes the currency's own (JPY 0, KWD 3) |
| `isAffixSubtle` | Default `true`: the currency and the decimals smaller and lighter |
| `currencyIndicator` | `currency-symbol` (default) or `currency-code` |
| `isStrikethrough` | An old price: a `<del>`, whose line takes the text's colour; it also tells a reader |
| `unit` | `major` (default) or `minor` — paise, cents — scaled by the currency's own exponent |
| `locale` | Grouping and currency side; i18nify's (the platform's) by default |
| `symbol` | Replaces the currency symbol with the app's own (`RM`) |
| `class`, `testID` | As everywhere |

A reader gets the whole amount as one string; the styled parts are hidden
from it, since split spans are read piecewise by some screen readers.

API parity with Blade React: see `src-cx/API-PARITY.md`.
