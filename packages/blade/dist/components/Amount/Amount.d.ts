import { default as React } from 'react';
import { CurrencyCodeType, formatNumberByParts } from '@razorpay/i18nify-js/currency';
import { AmountTypeProps } from './amountTokens';
import { BaseTextProps } from '../Typography/BaseText/types';
import { DataAnalyticsAttribute, BladeElementRef, TestID } from '../../utils/types';
import { StyledPropsBlade } from '../Box/styledProps';
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
} & TestID & DataAnalyticsAttribute & StyledPropsBlade;
type AmountProps = AmountTypeProps & AmountCommonProps;
type AmountType = Partial<ReturnType<typeof formatNumberByParts>>;
type FormatAmountWithSuffixType = {
    suffix: AmountProps['suffix'];
    value: number;
    currency: AmountProps['currency'];
    fractionDigits?: number;
};
/**
 * Returns a parsed object based on the suffix passed in parameters
 * === Logic ===
 * value = 12500.45
 * if suffix === 'decimals' => {
    "integer": "12,500",
    "decimal": ".",
    "fraction": "45",
    "compact": "K",
    "isPrefixSymbol": false,
    "rawParts": [{"type": "integer","value": "12"},{"type": "group","value": ","},{"type": "integer","value": "500"},{"type": "decimal","value": "."},{"type": "fraction","value": "45"}]
}
 * @returns {AmountType}
 */
export declare const getAmountByParts: ({ suffix, value, currency, fractionDigits, }: FormatAmountWithSuffixType) => AmountType;
declare const Amount: React.ForwardRefExoticComponent<AmountProps & React.RefAttributes<BladeElementRef>>;
export type { AmountProps };
export { Amount };
