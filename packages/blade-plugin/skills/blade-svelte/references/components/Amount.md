## Component Name

Amount

## Description

Amount shows a money value with its currency, formatted by i18nify for the locale: symbol or code, grouping, the currency's side, two decimals by default, floored or compact (1.5K, 2L, 1Cr) on request. By default it takes the size, weight and colour of the text around it; with `type` and `size` it draws one of Blade's Amount variants (body, heading, display). It fades the currency and decimals as a subtle affix, can strike through an old price, and accepts minor units (paise, cents).

## Important Constraints

- `value` is required and is a number; `currency` is ISO 4217 and defaults to `INR`
- `size`, `weight` and `color` default to `inherit`: put the Amount inside a `Text` or `Heading`, or set `type` and `size`
- `size` and `weight` depend on `type`: `body` takes `xsmall`–`large`; `heading` `small`–`2xlarge` and no `medium` weight; `display` `small`–`xlarge`
- `unit="minor"` scales the value by the currency's exponent (`129900` paise is ₹1,299.00); the default `major` takes it as is
- It has no children; screen readers get the whole amount as one string
- `class` places it and may set text alignment

## Props

```typescript
type AmountType = 'body' | 'heading' | 'display';
type AmountSize = 'inherit' | 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge';
type AmountColor = 'inherit' | 'default' | 'subtle' | 'muted' | 'primary' | 'negative' | 'positive' | 'white';

interface AmountProps {
  /** The amount, in major units unless `unit="minor"`. */
  value: number;
  /** ISO 4217. @default 'INR' */
  currency?: CurrencyCodeType;
  /** `decimals`: fixed decimals; `none`: floored to the integer; `humanize`: compact (1.5K, 2L, 1Cr, by locale). @default 'decimals' */
  suffix?: 'decimals' | 'none' | 'humanize';
  /** With `suffix="decimals"`: how many; `auto` takes the currency's own (JPY 0, KWD 3). @default 2 */
  fractionDigits?: number | 'auto';
  /** The symbol (`₹`) or the code (`INR`). @default 'currency-symbol' */
  currencyIndicator?: 'currency-symbol' | 'currency-code';
  /** An old price: one line across the whole amount, currency included; rendered as a `<del>`. @default false */
  isStrikethrough?: boolean;
  /** `minor` for paise or cents: scaled by the currency's exponent. @default 'major' */
  unit?: 'major' | 'minor';
  /** Grouping and currency side for this amount. @default BladeProvider's `adapters.locale`, else i18nify's */
  locale?: string;
  /** Replaces the currency symbol with the app's own (`RM`). */
  symbol?: string;
  /** Which of Blade's scales `size` picks from. @default 'body' */
  type?: AmountType;
  /** `inherit` takes the surrounding text's; otherwise one of the `type`'s sizes. @default 'inherit' */
  size?: AmountSize;
  /** `medium` is not available for `heading`. @default 'inherit' */
  weight?: 'inherit' | 'regular' | 'medium' | 'semibold';
  /** Text's colours, or `inherit`. @default 'inherit' */
  color?: AmountColor;
  /** The currency and decimals one step smaller at 64% opacity (0.75em of the text while `size` inherits). @default true */
  isAffixSubtle?: boolean;
  testID?: string;
  /** Placement and text alignment only. */
  class?: string;
}
```

## Guidelines

- Use Amount for every money value; don't format currency yourself with `toLocaleString` or a hard-coded `₹`.
- Inside running text, nest it in the `Text` or `Heading` and let it inherit.
- Use `type` and `size` for a standalone figure, such as an order total (`type="heading"`) or a hero balance (`type="display"`).
- Pass amounts from the API in paise with `unit="minor"`, not divided by 100 yourself.
- Show a discount as the old price with `isStrikethrough` in a `muted` Text next to the new price.
- Use `suffix="humanize"` for dashboard summaries, and full decimals wherever the user pays or reconciles.
- Set `locale` only to pin one amount; set the app's locale once through BladeProvider's `adapters.locale`.

## Examples

### Inheriting the surrounding text

```svelte
<script lang="ts">
  import { Amount, Heading, Text } from '@razorpay/blade-svelte/components';
</script>

<div class="flex flex-col gap-blade-2">
  <Text size="small" color="muted">Total payable</Text>
  <Heading as="p" size="large">
    <Amount value={1299.5} />
  </Heading>
  <Text>
    You saved <Amount value={200} color="positive" /> on this order.
  </Text>
</div>
```

### Blade's Amount variants

```svelte
<script lang="ts">
  import { Amount } from '@razorpay/blade-svelte/components';
</script>

<div class="flex flex-col gap-blade-3">
  <Amount value={4999.5} type="body" size="medium" weight="regular" />
  <Amount value={4999.5} type="heading" size="large" weight="semibold" color="positive" />
  <Amount value={4999.5} type="display" size="small" weight="medium" />
  <Amount value={4999.5} type="heading" size="medium" isAffixSubtle={false} />
</div>
```

### A discounted price in minor units

```svelte
<script lang="ts">
  import { Amount, Text } from '@razorpay/blade-svelte/components';
</script>

<div class="flex items-baseline gap-blade-3">
  <Text size="large" weight="semibold">
    <Amount value={99900} unit="minor" />
  </Text>
  <Text color="muted">
    <Amount value={129900} unit="minor" isStrikethrough />
  </Text>
</div>
```

### Other currencies, codes and compact values

```svelte
<script lang="ts">
  import { Amount, Text } from '@razorpay/blade-svelte/components';
</script>

<div class="flex flex-col gap-blade-2">
  <Text><Amount value={1234.5} currency="USD" locale="en-US" /></Text>
  <Text><Amount value={1234567} currency="JPY" locale="ja-JP" fractionDigits="auto" /></Text>
  <Text><Amount value={2500} currencyIndicator="currency-code" /></Text>
  <Text weight="semibold"><Amount value={15000000} suffix="humanize" /></Text>
</div>
```
