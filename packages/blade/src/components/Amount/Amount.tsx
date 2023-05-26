import type { ReactElement } from 'react';
import React from 'react';
import {
  amountFontSizes,
  currencyAbbreviationsMapping,
  currencyLocaleMapping,
  currencyPrefixMapping,
  affixFontSizes,
  amountLineHeights,
} from './amountTokens';
import { BaseText } from '~components/Typography/BaseText';
import type { Feedback } from '~tokens/theme/theme';
import type { BaseTextProps } from '~components/Typography/BaseText/types';
import BaseBox from '~components/Box/BaseBox';
import type { TestID } from '~utils/types';
import { metaAttribute, MetaConstants, getPlatformType } from '~utils';
import { getStyledProps } from '~components/Box/styledProps';
import type { StyledPropsBlade } from '~components/Box/styledProps';

type Currency = 'INR' | 'MYR';

type AmountProps = {
  /**
   * The value to be rendered within the component.
   *
   */
  value: number;
  /**
   * Sets the intent of the amount.
   *
   * @default undefined
   */
  intent?: Exclude<Feedback, 'neutral'>;
  /**
   * Sets the size of the amount.
   *
   * @default 'body-medium'
   */
  size?:
    | 'body-medium-bold'
    | 'body-small'
    | 'body-small-bold'
    | 'body-medium'
    | 'body-medium-bold'
    | 'heading-small'
    | 'heading-small-bold'
    | 'heading-large'
    | 'heading-large-bold'
    | 'title-small'
    | 'title-medium';
  /**
   * Indicates what the suffix of amount should be
   *
   * @default 'decimals'
   */
  suffix?: 'decimals' | 'none' | 'humanize';
  /**
   * Makes the prefix symbol and decimal digits small and faded
   *
   * @default true
   */
  isAffixSubtle?: true | false;
  /**
   * Prefix to be shown before the amount value. The prefix can be either a currency symbol or a currency code.
   *
   * @default 'currency-symbol'
   */
  prefix?: 'currency-symbol' | 'currency-code';
  /**
   * The currency of the amount.
   *
   * @default 'INR'
   * */
  currency?: Currency;
} & TestID &
  StyledPropsBlade;

type ColorProps = {
  amountValueColor: BaseTextProps['color'];
  affixColor: BaseTextProps['color'];
};

const getTextColorProps = ({ intent }: { intent: AmountProps['intent'] }): ColorProps => {
  const props: ColorProps = {
    amountValueColor: 'surface.text.normal.lowContrast',
    affixColor: 'surface.text.muted.lowContrast',
  };
  if (!intent) return props;
  props.amountValueColor = `feedback.text.${intent}.lowContrast`;
  props.affixColor = `feedback.text.${intent}.lowContrast`;
  return props;
};

interface AmountValue extends Omit<AmountProps, 'value'> {
  affixColor: BaseTextProps['color'];
  amountValueColor: BaseTextProps['color'];
  value: string;
  size: Exclude<AmountProps['size'], undefined>;
}

const AmountValue = ({
  value,
  size,
  amountValueColor,
  isAffixSubtle,
  suffix,
  affixColor,
}: AmountValue): ReactElement => {
  const affixFontWeight = isAffixSubtle ? 'regular' : 'bold';
  const isReactNative = getPlatformType() === 'react-native';
  const affixFontSize = isAffixSubtle ? affixFontSizes[size] : amountFontSizes[size];
  const valueForWeight = size.includes('bold') || size.startsWith('title') ? 'bold' : 'regular';
  if (suffix === 'decimals' && isAffixSubtle) {
    const integer = value.split('.')[0];
    const decimal = value.split('.')[1];

    // Native does not support alignItems of Text inside a div, insted we need to wrap is in a Text
    const AmountWrapper = getPlatformType() === 'react-native' ? BaseText : React.Fragment;

    return (
      <AmountWrapper>
        <BaseText
          fontSize={amountFontSizes[size]}
          fontWeight={valueForWeight}
          lineHeight={amountLineHeights[size]}
          color={amountValueColor}
          as={isReactNative ? undefined : 'span'}
        >
          {integer}.
        </BaseText>
        <BaseText
          marginLeft="spacing.1"
          fontWeight={affixFontWeight}
          fontSize={affixFontSize}
          color={affixColor}
          as={isReactNative ? undefined : 'span'}
        >
          {decimal || '00'}
        </BaseText>
      </AmountWrapper>
    );
  }
  return (
    <BaseText fontSize={amountFontSizes[size]} fontWeight={valueForWeight} color={amountValueColor}>
      {value}
    </BaseText>
  );
};

// This function rounds a number to a specified number of decimal places
// and floors the result.
export const getFlooredFixed = (value: number, decimalPlaces: number): number => {
  const factor = 10 ** decimalPlaces;
  const roundedValue = Math.floor(value * factor) / factor;
  return Number(roundedValue.toFixed(decimalPlaces));
};

export const addCommas = (amountValue: number, currency: Currency): string => {
  const locale = currencyLocaleMapping[currency];
  return amountValue.toLocaleString(locale);
};
/**
 * This function returns the humanized amount
 * ie: for INR 2000 => 2K
 * for MYR 2000000 => 2M
 */
export const getHumanizedAmount = (amountValue: number, currency: Currency): string => {
  const abbreviations = currencyAbbreviationsMapping[currency];

  const abbreviation = abbreviations.find((abbr) => amountValue >= abbr.value);
  if (abbreviation) {
    amountValue = amountValue / abbreviation.value;
    const formattedAmountValue = getFlooredFixed(amountValue, 2);
    return addCommas(formattedAmountValue, currency) + abbreviation.symbol;
  } else {
    return amountValue.toString();
  }
};

type FormatAmountWithSuffixType = {
  suffix: AmountProps['suffix'];
  value: number;
  currency: Currency;
};

export const formatAmountWithSuffix = ({
  suffix,
  value,
  currency,
}: FormatAmountWithSuffixType): string => {
  switch (suffix) {
    case 'decimals': {
      const decimalNumber = getFlooredFixed(value, 2);
      return addCommas(decimalNumber, currency);
    }
    case 'humanize': {
      return getHumanizedAmount(value, currency);
    }
    case 'none': {
      return addCommas(getFlooredFixed(value, 0), currency);
    }
    default:
      return addCommas(getFlooredFixed(value, 0), currency);
  }
};

const getCurrencyWeight = (
  isAffixSubtle: NonNullable<AmountProps['isAffixSubtle']>,
  size: NonNullable<AmountProps['size']>,
): 'bold' | 'regular' => {
  if (isAffixSubtle || size.startsWith('bold')) return 'bold';
  return 'regular';
};

const Amount = ({
  value,
  suffix = 'decimals',
  size = 'body-medium',
  isAffixSubtle = true,
  intent,
  prefix = 'currency-symbol',
  testID,
  currency = 'INR',
  ...styledProps
}: AmountProps): ReactElement => {
  if (typeof value !== 'number') {
    throw new Error('[Blade: Amount]: `value` prop must be of type `number` for Amount.');
  }
  // @ts-expect-error neutral intent should throw error
  if (intent === 'neutral') {
    throw new Error('[Blade Amount]: `neutral` intent is not supported.');
  }

  const currencyPrefix = currencyPrefixMapping[currency][prefix];
  const renderedValue = formatAmountWithSuffix({ suffix, value, currency });
  const { amountValueColor, affixColor } = getTextColorProps({
    intent,
  });

  const currencyColor = isAffixSubtle ? affixColor : amountValueColor;
  const currencyFontSize = isAffixSubtle ? affixFontSizes[size] : amountFontSizes[size];
  const currencyWeight = getCurrencyWeight(isAffixSubtle, size);
  const isReactNative = getPlatformType() === 'react-native';

  return (
    <BaseBox
      paddingLeft="spacing.2"
      paddingRight="spacing.2"
      display="flex"
      alignItems="baseline"
      flexDirection="row"
      {...metaAttribute({ name: MetaConstants.Amount, testID })}
      {...getStyledProps(styledProps)}
    >
      <BaseText
        marginRight="spacing.1"
        fontWeight={currencyWeight}
        fontSize={currencyFontSize}
        color={currencyColor}
        as={isReactNative ? undefined : 'span'}
      >
        {currencyPrefix}
      </BaseText>
      <AmountValue
        value={renderedValue}
        amountValueColor={amountValueColor}
        size={size}
        isAffixSubtle={isAffixSubtle}
        suffix={suffix}
        affixColor={affixColor}
      />
    </BaseBox>
  );
};

export { Amount, AmountProps };
