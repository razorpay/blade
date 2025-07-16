import type { CurrencyCodeType, formatNumberByParts } from '@razorpay/i18nify-js/currency';
import type { AmountTypeProps } from './amountTokens';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { DataAnalyticsAttribute, TestID } from '~utils/types';
import type { BaseTextProps } from '~components/Typography/BaseText/types';

type AmountType = Partial<ReturnType<typeof formatNumberByParts>>;

type AmountCommonProps = {
  /**
   * The value to be rendered within the component.
   *
   */
  value: number;
  /**
   * Sets the color of the amount.
   *
   * @default undefined
   */
  color?: BaseTextProps['color'];
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
  isAffixSubtle?: true | false;
  /**
   * Determines the visual representation of the currency, choose between displaying the currency symbol or code.
   *
   * Note: Currency symbol and code is determined by the locale set in user's browser or set via @razorpay/i18nify-react library.
   *
   * @default 'currency-symbol'
   */
  currencyIndicator?: 'currency-symbol' | 'currency-code';
  /**
   * The currency of the amount.  Note that this component
   * only displays the provided value in the specified currency, it does not perform any currency conversion.
   *
   * @default 'INR'
   * */
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
} & TestID &
  DataAnalyticsAttribute &
  StyledPropsBlade;

type ColorProps = {
  amountValueColor: BaseTextProps['color'];
};

type AmountProps = AmountTypeProps & AmountCommonProps;

export type { AmountProps, AmountTypeProps, ColorProps, AmountType };
