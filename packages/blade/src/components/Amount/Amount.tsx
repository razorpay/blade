import type { ReactElement } from 'react';
import type { FontSize } from '../../tokens/global/typography';
import type { HeadingProps, TextProps, TitleProps } from '../Typography';
import {
  amountTextSizes,
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
  intent?: Feedback | undefined;
  /**
   * Sets the size of the amount.
   *
   * @default 'heading'
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
   * Highlights the main amount by making the prefix symbol and decimal digits subtle
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
  if (!intent) return props;
  props.amountValueColor = `feedback.text.${intent}.lowContrast`;
  props.affixColor = `feedback.text.${intent}.lowContrast`;
  if (intent === 'neutral') {
    props.affixColor = `feedback.text.neutral.lowContrast`;
  }
  return props;
};

const getAffixFontWeight = (isAffixSubtle: true | false): 'regular' | 'bold' => {
  if (isAffixSubtle) return 'regular';
  return 'bold';
};

const getMainValueWeight = (
  size: NonNullable<AmountProps['size']>,
): NonNullable<TextProps<{ variant: 'body' }>['weight']> => {
  return size.includes('bold') || size.startsWith('title') ? 'bold' : 'regular';
};

const getAffixFontSize = (
  isAffixSubtle: NonNullable<AmountProps['isAffixSubtle']>,
  size: NonNullable<AmountProps['size']>,
): keyof FontSize | undefined => {
  if (isAffixSubtle) return affixFontSizes[size];
  return amountTextSizes[size];
};

interface AmountValue extends Omit<AmountProps, 'value'> {
  affixColor: BaseTextProps['color'];
  amountValueColor: BaseTextProps['color'];
  value: string;
}

const AmountValue = ({
  value,
  size = 'heading-small',
  amountValueColor,
  isAffixSubtle = true,
  suffix = 'decimals',
  affixColor,
}: AmountValue): ReactElement => {
  const affixFontWeight = getAffixFontWeight(isAffixSubtle);
  const affixFontSize = getAffixFontSize(isAffixSubtle, size);
  const valueForWeight = getMainValueWeight(size);
  if (suffix === 'decimals' && isAffixSubtle) {
    const integer = value.split('.')[0];
    const decimal = value.split('.')[1];

    return (
      <>
        <BaseBox paddingRight="spacing.1">
          <BaseText
            fontSize={amountTextSizes[size]}
            fontWeight={valueForWeight}
            color={amountValueColor}
          >
            {integer}.
          </BaseText>
        </BaseBox>
        <BaseText fontWeight={affixFontWeight} fontSize={affixFontSize} color={affixColor}>
          {decimal || '00'}
        </BaseText>
      </>
    );
  }
  return (
    <BaseBox paddingRight="spacing.2">
      <BaseText
        fontSize={amountTextSizes[size]}
        fontWeight={valueForWeight}
        color={amountValueColor}
      >
        {value}
      </BaseText>
    </BaseBox>
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
  size = 'heading-small',
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
  const currencyFontSize = getAffixFontSize(isAffixSubtle, size);
  const currencyWeight = getCurrencyWeight(isAffixSubtle, size);

  return (
    <BaseBox
      paddingLeft="spacing.2"
      paddingRight="spacing.2"
      {...metaAttribute({ name: MetaConstants.Amount, testID })}
    >
      <BaseBox
        display="flex"
        alignItems="baseline"
        paddingLeft="spacing.2"
        paddingRight="spacing.2"
      >
        <BaseBox paddingRight="spacing.1">
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
    </BaseBox>
  );
};

export { Amount, AmountProps };
