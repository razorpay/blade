# Amount

A number with its currency. The core (`formatAmount` in `runes/amount`) splits it
into typed parts — currency, integer, fraction, sign — in the order the
locale wants them, and the component styles the parts apart: by default the
currency and the decimals are smaller and lighter than the integer.

The library ships **no currency data**: symbols, grouping, decimals (JPY 0,
KWD 3) and the exponent used for minor units all come from the platform's
`Intl`. An unknown code renders plainly (`XYZ 12.5`) instead of failing.

| Prop | Notes |
| --- | --- |
| `value`, `currency` | Required. `currency` is ISO 4217 |
| `unit` | `major` (default) or `minor` — paise, cents — scaled by the currency's own exponent |
| `fractionDigits` | Pins the decimals; `0` for none |
| `locale` | Grouping and currency side; the platform's by default |
| `currencyDisplay` | `symbol` (default; the narrow symbol, `$` rather than `US$`) or `code` |
| `symbol` | Replaces the platform's symbol with the app's own (`RM`) |
| `isStrikethrough` | An old price: a `<del>`, which also tells a screen reader |
| `size` | Style axis, `xsmall` to `2xlarge`; the top three are heading sizes |
| `weight`, `color` | Style axes |
| `affix` | Style axis: `subtle` (default) or `normal` |
| `class`, `testID` | As everywhere |

`size`, `weight` and `color` have no default: unset, the amount takes the
surrounding text's, so it sits inside a `Text` or `Heading` without repeating
their axes. The affix is sized in `em`, so it follows either way.

In blade the parts are a flex row on one baseline, so the smaller
currency and decimals bottom out with the integer's digits.

A screen reader gets the whole text once; the styled parts are
`aria-hidden`, because split spans are read piecewise. Digits are
`tabular-nums`, so a changing total does not jitter.
