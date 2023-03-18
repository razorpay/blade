import type { ReactElement } from 'react';
import type { HeadingProps, TextProps, TitleProps } from '../Typography';
import {
  amountFontSizes,
  currencyAbbreviationsMapping,
  currencyLocaleMapping,
  currencyPrefixMapping,
  affixFontSizes,
} from './amountTokens';
import { BaseText } from '~components/Typography/BaseText';
import type { Feedback } from '~tokens/theme/theme';
import type { BaseTextProps } from '~components/Typography/BaseText/types';
import BaseBox from '~components/Box/BaseBox';
import type { TestID } from '~src/_helpers/types';
import { metaAttribute, MetaConstants } from '~utils';

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
    | `title-${NonNullable<Exclude<TitleProps['size'], 'large'>>}`
    | `heading-${NonNullable<Exclude<HeadingProps<{ variant: 'regular' }>['size'], 'medium'>>}`
    | `heading-${NonNullable<
        Exclude<HeadingProps<{ variant: 'regular' }>['size'], 'medium'>
      >}-${NonNullable<Exclude<TextProps<{ variant: 'body' }>['weight'], 'regular'>>}`
    | `body-${NonNullable<Exclude<TextProps<{ variant: 'body' }>['size'], 'xsmall'>>}`
    | `body-${NonNullable<Exclude<TextProps<{ variant: 'body' }>['size'], 'xsmall'>>}-${NonNullable<
        Exclude<TextProps<{ variant: 'body' }>['weight'], 'regular'>
      >}`;
  /**
   * Indicates what the suffix of amount should be
   *
   * @default 'decimals'
   */
  suffix?: 'decimals' | 'none' | 'humanize';
  /**
   * in amount by making the prefix symbol and decimal digits s
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
} & TestID;

type ColorProps = {
  amountValueColor: BaseTextProps['color'];
  affixColor: BaseTextProps['color'];
};

const getTextColorProps = ({ intent }: { intent: AmountProps['intent'] }): ColorProps => {
  const props: ColorProps = {
    amountValueColor: 'surface.text.normal.lowContrast',
    affixColor: 'surface.text.muted.lowContrast',
  };
  if (!intent && intent !== 'neutral') return props;
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
  const affixFontSize = isAffixSubtle ? affixFontSizes[size] : amountFontSizes[size];
  const valueForWeight = size.includes('bold') || size.startsWith('title') ? 'bold' : 'regular';
  if (suffix === 'decimals' && isAffixSubtle) {
    const integer = value.split('.')[0];
    const decimal = value.split('.')[1];

    return (
      <>
        <BaseText
          fontSize={amountFontSizes[size]}
          fontWeight={valueForWeight}
          color={amountValueColor}
          marginX="spacing.1"
        >
          {integer}.
        </BaseText>
        <BaseText fontWeight={affixFontWeight} fontSize={affixFontSize} color={affixColor}>
          {decimal || '00'}
        </BaseText>
      </>
    );
  }
  return (
    <BaseText
      fontSize={amountFontSizes[size]}
      fontWeight={valueForWeight}
      color={amountValueColor}
      paddingRight="spacing.2"
    >
      {value}
    </BaseText>
  );
};

// First calculates a factor based on the desired precision by raising 10 to the power of the
// precision value. This factor is then used to multiply the value and round it down to the nearest integer
// value. Finally, the rounded value is divided by the factor again to restore its original scale, and then
// rounded to the desired precision using toFixed().
const getFlooredFixed = (value: number, precision: number): number => {
  const factor = 10 ** precision;
  const roundedValue = Math.floor(value * factor) / factor;
  return Number(roundedValue.toFixed(precision));
};

const addCommas = (amountValue: number, currency: Currency): string => {
  const locale = currencyLocaleMapping[currency];
  return amountValue.toLocaleString(locale);
};

const getHumanizedAmount = (amountValue: number, currency: Currency): string => {
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

const formatAmountWithSuffix = ({
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
}: AmountProps): ReactElement => {
  if (isNaN(value)) {
    throw new Error('[Blade: Amount]: `value` prop must be of type `number` for Amount.');
  }

  // This will be added to prop and can be switched to a currency
  const currency = 'INR';
  const currencyPrefix = currencyPrefixMapping[currency][prefix];
  const renderedValue = formatAmountWithSuffix({ suffix, value, currency });
  const { amountValueColor, affixColor } = getTextColorProps({
    intent,
  });

  const currencyColor = isAffixSubtle ? affixColor : amountValueColor;
  const currencyFontSize = isAffixSubtle ? affixFontSizes[size] : amountFontSizes[size];
  const currencyWeight = getCurrencyWeight(isAffixSubtle, size);

  return (
    <BaseBox
      paddingLeft="spacing.2"
      paddingRight="spacing.2"
      display="flex"
      alignItems="baseline"
      {...metaAttribute({ name: MetaConstants.Amount, testID })}
    >
      <BaseBox>
        <BaseText fontWeight={currencyWeight} fontSize={currencyFontSize} color={currencyColor}>
          {currencyPrefix}
        </BaseText>
      </BaseBox>
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
