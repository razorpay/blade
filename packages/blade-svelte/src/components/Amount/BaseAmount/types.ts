import type { CurrencyCodeType } from '@razorpay/i18nify-js/currency';
import type { StyledPropsBlade } from '@razorpay/blade-core/utils';
import type { BaseTextProps } from '../../Typography/BaseText/types';

// Amount size types
type AmountSizes = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge';

// Amount type-specific props
export type AmountDisplayProps = {
  type?: 'display';
  size?: Extract<AmountSizes, 'small' | 'medium' | 'large' | 'xlarge'>;
  weight?: Extract<BaseTextProps['fontWeight'], 'regular' | 'medium' | 'semibold'>;
};

export type AmountHeadingProps = {
  type?: 'heading';
  size?: Extract<AmountSizes, 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge'>;
  weight?: Extract<BaseTextProps['fontWeight'], 'regular' | 'semibold'>;
};

export type AmountBodyProps = {
  type?: 'body';
  size?: Extract<AmountSizes, 'xsmall' | 'small' | 'medium' | 'large'>;
  weight?: Extract<BaseTextProps['fontWeight'], 'regular' | 'medium' | 'semibold'>;
};

export type AmountTypeProps = AmountDisplayProps | AmountHeadingProps | AmountBodyProps;

// Common props shared across all amount types
export type AmountCommonProps = {
  /**
   * The value to be rendered within the component.
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
  isAffixSubtle?: boolean;
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
  // Analytics attributes
  [key: `data-analytics-${string}`]: string;
};

export type BaseAmountProps = AmountTypeProps & AmountCommonProps & StyledPropsBlade;
