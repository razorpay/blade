## Component Name

Amount

## Description

Amount formats and displays a monetary value with its currency symbol or code, grouping separators and decimals. `type` (body, heading, display) and `size` scale it from table cells to hero balances, `suffix` switches between decimals, whole numbers and humanized values (for example 1.2M), and the currency symbol and decimals can be rendered subtle. It formats only; it does not convert currencies.

## Important Constraints

- `value` is required and must be a number; Amount throws `` `value` prop must be of type `number` for Amount. `` otherwise (localhost only)
- `size` must match `type`, otherwise Amount throws `size="..." is not allowed with type="..."` (localhost only):
  - `type="body"` (default): `xsmall`, `small`, `medium`, `large`
  - `type="heading"`: `small`, `medium`, `large`, `xlarge`, `2xlarge`
  - `type="display"`: `small`, `medium`, `large`, `xlarge`
- `type="heading"` only accepts `weight="regular"` or `weight="semibold"` (enforced by the types)
- `color="neutral"` throws `` `neutral` color is not supported. ``; pass a text color token
- `fractionDigits` only applies when `suffix="decimals"`, and only accepts a number (React also accepts `'auto'`)
- blade-svelte does not export an `AmountProps` type; the props below are the component's real props (exported as `BaseAmountProps`)

## TypeScript Types

These are the props the Amount component accepts.

```typescript
/**
 * Text color token, e.g. 'surface.text.gray.normal' or 'feedback.text.positive.intense'.
 * See Tokens.md for the full list.
 */
type TextColors =
  | `interactive.text.${string}`
  | `surface.text.${string}`
  | `feedback.text.${string}`;

/**
 * ISO 4217 currency code supported by @razorpay/i18nify-js, e.g. 'INR', 'USD', 'EUR'.
 */
type CurrencyCodeType = string;

type AmountSlot = 'currency' | 'value';

type AmountDisplayProps = {
  type?: 'display';
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  weight?: 'regular' | 'medium' | 'semibold';
};

type AmountHeadingProps = {
  type?: 'heading';
  size?: 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge';
  weight?: 'regular' | 'semibold';
};

type AmountBodyProps = {
  type?: 'body';
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  weight?: 'regular' | 'medium' | 'semibold';
};

type AmountTypeProps = AmountDisplayProps | AmountHeadingProps | AmountBodyProps;

type AmountCommonProps = {
  /**
   * The value to be rendered within the component.
   */
  value: number;
  /**
   * Sets the color of the amount.
   *
   * @default undefined
   */
  color?: TextColors | 'currentColor';
  /**
   * Indicates what the suffix of amount should be
   *
   * @default 'decimals'
   */
  suffix?: 'decimals' | 'none' | 'humanize';
  /**
   * Makes the currency indicator(currency symbol/code) and decimal digits small and faded
   *
   * @default true
   */
  isAffixSubtle?: boolean;
  /**
   * Determines the visual representation of the currency, choose between displaying the currency symbol or code.
   *
   * @default 'currency-symbol'
   */
  currencyIndicator?: 'currency-symbol' | 'currency-code';
  /**
   * The currency of the amount.  Note that this component
   * only displays the provided value in the specified currency, it does not perform any currency conversion.
   *
   * @default 'INR'
   */
  currency?: CurrencyCodeType;
  /**
   * If true, the amount text will have a line through it.
   *
   * @default false
   */
  isStrikethrough?: boolean;
  /**
   * Controls the number of decimal places to display when suffix is 'decimals'.
   *
   * @default 2
   */
  fractionDigits?: number;
  testID?: string;
  /**
   * Per-slot classname overrides. Merged under provider `componentConfig.Amount.styleOverride`;
   * instance values win on conflicts.
   */
  styleOverride?: Partial<Record<AmountSlot, string>>;
  // Analytics attributes
  [key: `data-analytics-${string}`]: string;
};

/**
 * `type` defaults to 'body', `size` to 'medium' and `weight` to 'regular'.
 */
type AmountProps = AmountTypeProps & AmountCommonProps & StyledPropsBlade;
```

## Usage Guidelines

**Do**

- Use `Amount` for every monetary value so symbols, grouping and decimals follow the currency.
- Pass `value` in the main currency unit (rupees, dollars); convert paise or cents first.
- Match `type` to context: `body` in tables and rows, `heading` for section totals, `display` for hero balances.
- Use `suffix="humanize"` for large figures in summaries and charts, where compact values read faster than full figures.
- Use `suffix="none"` when decimals add noise, such as whole-rupee plan prices.
- Use feedback text colors to show direction, such as `feedback.text.positive.intense` for credits and `feedback.text.negative.intense` for debits.
- Use `isStrikethrough` for the original price next to a discounted one.
- Use `currencyIndicator="currency-code"` when several currencies appear together.

**Don't**

- Don't use `Amount` for non-monetary numbers such as counts or percentages; use `Text` or `Counter`.
- Don't pick a `size` outside the range for the chosen `type`; switch `type` instead.
- Don't pass `color="neutral"`; use `surface.text.gray.normal` or omit `color`.
- Don't format the number yourself and pass it as text; pass the number to `value`.

## Examples

### Settlement summary

A hero balance, a humanized monthly total, and signed credits and debits in a settlement summary.

```svelte
<script lang="ts">
  import { Amount, Text } from '@razorpay/blade-svelte/components';

  const settlement = {
    available: 482350.75,
    monthToDate: 12845000,
    credits: 125000,
    refunds: 4320.5,
  };
</script>

<div class="summary">
  <Text size="small" color="surface.text.gray.muted">Available for settlement</Text>
  <Amount value={settlement.available} type="display" size="medium" weight="semibold" testID="available-balance" />

  <Text size="small" color="surface.text.gray.muted">Processed this month</Text>
  <Amount value={settlement.monthToDate} type="heading" size="small" suffix="humanize" />

  <div class="row">
    <Text size="small">Credits</Text>
    <Amount value={settlement.credits} size="small" color="feedback.text.positive.intense" suffix="none" />
  </div>
  <div class="row">
    <Text size="small">Refunds</Text>
    <Amount
      value={settlement.refunds}
      size="small"
      color="feedback.text.negative.intense"
      data-analytics-amount="refunds"
    />
  </div>
</div>

<style>
  .summary {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2);
  }

  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
```

### Discounted plan price in another currency

An original price struck through next to the discounted price, shown with the currency code.

```svelte
<script lang="ts">
  import { Amount } from '@razorpay/blade-svelte/components';

  let originalPrice = $state(49.99);
  const discountedPrice = $derived(Math.round(originalPrice * 0.8 * 100) / 100);
</script>

<div class="price">
  <Amount value={originalPrice} currency="USD" currencyIndicator="currency-code" size="small" isStrikethrough />
  <Amount
    value={discountedPrice}
    currency="USD"
    currencyIndicator="currency-code"
    type="heading"
    size="medium"
    weight="semibold"
    isAffixSubtle={false}
    marginLeft="spacing.3"
  />
</div>

<style>
  .price {
    display: flex;
    align-items: baseline;
  }
</style>
```
