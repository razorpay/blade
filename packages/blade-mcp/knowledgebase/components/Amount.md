## Component Name

Amount

## Description

The Amount component is used to display currency values with proper formatting. It shows small amounts of color-coded metadata, which are ideal for getting user attention. This component only displays the provided value in the specified currency with the formatting capabilities enabled by @razorpay/i18nify-react, it does not perform any currency conversion.

## Important Constraints

- `size` options are limited based on the `type` prop:
  - `type="body"` supports sizes: `xsmall`, `small`, `medium`, `large`
  - `type="heading"` supports sizes: `small`, `medium`, `large`, `xlarge`, `2xlarge`
  - `type="display"` supports sizes: `small`, `medium`, `large`, `xlarge`

## Typescript Types

The following types represent the props that the Amount component and its subcomponents accept. These types allow you to properly configure the Amount component according to your needs.

```typescript
type AmountSizes = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge';

type AmountDisplayProps = {
  type?: 'display';
  size?: Extract<AmountSizes, 'small' | 'medium' | 'large' | 'xlarge'>;
  weight?: 'regular' | 'medium' | 'semibold';
};

type AmountHeadingProps = {
  type?: 'heading';
  size?: Extract<AmountSizes, 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge'>;
  weight?: 'regular' | 'semibold';
};

type AmountBodyProps = {
  type?: 'body';
  size?: Extract<AmountSizes, 'xsmall' | 'small' | 'medium' | 'large'>;
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
   * @default undefined
   */
  color?: string;
  /**
   * Indicates what the suffix of amount should be
   * @default 'decimals'
   */
  suffix?: 'decimals' | 'none' | 'humanize';
  /**
   * Makes the currency indicator(currency symbol/code) and decimal digits small and faded
   * @default true
   */
  isAffixSubtle?: boolean;
  /**
   * Determines the visual representation of the currency, choose between displaying the currency symbol or code.
   * Note: Currency symbol and code is determined by the locale set in user's browser or set via @razorpay/i18nify-react library.
   * @default 'currency-symbol'
   */
  currencyIndicator?: 'currency-symbol' | 'currency-code';
  /**
   * The currency of the amount. Note that this component
   * only displays the provided value in the specified currency, it does not perform any currency conversion.
   * @default 'INR'
   */
  currency?: string;
  /**
   * If true, the amount text will have a line through it.
   * @default false
   */
  isStrikethrough?: boolean;
  /**
   * Test ID for the component
   */
  testID?: string;
  /**
   * Data analytics attributes
   */
  [key: `data-analytics-${string}`]: string;
};

type AmountProps = AmountTypeProps & AmountCommonProps;
```

## Examples

### Display Variations

```tsx
import { Amount } from '@razorpay/blade/components';
import { Box } from '@razorpay/blade/components';
import { Text } from '@razorpay/blade/components';

const AmountVariationsExample = () => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.6">
      <Box>
        <Text marginBottom="spacing.2">Different types and sizes:</Text>
        <Box display="flex" gap="spacing.4">
          <Amount value={12345.67} type="body" size="small" weight="medium" currency="INR" />
          <Amount value={12345.67} type="heading" size="large" weight="semibold" currency="USD" />
          <Amount value={12345.67} type="display" size="xlarge" weight="regular" currency="EUR" />
        </Box>
      </Box>

      <Box>
        <Text marginBottom="spacing.2">Currency variations:</Text>
        <Box display="flex" gap="spacing.4">
          <Amount value={12345.67} currency="INR" currencyIndicator="currency-symbol" />
          <Amount value={12345.67} currency="USD" currencyIndicator="currency-symbol" />
          <Amount value={12345.67} currency="GBP" currencyIndicator="currency-code" />
        </Box>
      </Box>
    </Box>
  );
};

export default AmountVariationsExample;
```

### Formatting and Styling

```tsx
import { Amount } from '@razorpay/blade/components';
import { Box } from '@razorpay/blade/components';
import { Text } from '@razorpay/blade/components';
import { I18nProvider } from '@razorpay/i18nify-react';

const AmountFormattingExample = () => {
  return (
    <I18nProvider>
      <Box display="flex" flexDirection="column" gap="spacing.6">
        <Box>
          <Text marginBottom="spacing.2">Suffix options:</Text>
          <Box display="flex" gap="spacing.4">
            <Amount value={12345.67} suffix="decimals" testID="amount-decimals" />
            <Amount value={12345.67} suffix="none" testID="amount-no-suffix" />
            <Amount value={1234567} suffix="humanize" testID="amount-humanize" />
          </Box>
        </Box>

        <Box>
          <Text marginBottom="spacing.2">Styling options:</Text>
          <Box display="flex" gap="spacing.4">
            <Amount
              value={12345.67}
              isStrikethrough={true}
              data-analytics-section="pricing"
              data-analytics-action="view"
            />
            <Amount value={12345.67} isAffixSubtle={false} />
            <Amount value={12345.67} color="feedback.text.positive.intense" isAffixSubtle={true} />
          </Box>
        </Box>

        <Box>
          <Text marginBottom="spacing.2">Color variations:</Text>
          <Box display="flex" gap="spacing.4">
            <Amount value={12345.67} color="feedback.text.positive.intense" />
            <Amount value={12345.67} color="feedback.text.negative.intense" />
            <Amount value={12345.67} color="feedback.text.notice.intense" />
            <Amount value={12345.67} color="feedback.text.information.intense" />
          </Box>
        </Box>
      </Box>
    </I18nProvider>
  );
};

export default AmountFormattingExample;
```
