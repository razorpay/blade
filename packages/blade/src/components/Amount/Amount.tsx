import type { ReactElement } from 'react';

import {
  currencyAbbreviationsMapping,
  currencylocaleMapping,
  currencyPrefixMapping,
} from './amountTokens';
import AmountValue, { getAffixFontSize } from './AmountValue';
import { StyledAmount } from './StyledAmount';
import { BaseText } from '~components/Typography/BaseText';
import type { Feedback } from '~tokens/theme/theme';
import type { BaseTextProps } from '~components/Typography/BaseText/types';
import BaseBox from '~components/Box/BaseBox';
import type { TestID } from '~src/_helpers/types';
import { metaAttribute, MetaConstants } from '~utils';

export const suffixTypes = {
  HUMANIZE: 'humanize',
  DECIMALS: 'decimals',
  NONE: 'none',
};

type currencyType = 'INR' | 'MYR';

type AmountProps = {
  /**
   * The value to be rendered within the component.
   *
   */
  value: number;
  /**
   * Sets the intent of the amount.
   *
   * @default 'neutral'
   */
  intent?: Feedback | undefined;
  /**
   * Sets the variant of the amount.
   *
   * @default 'heading'
   */
  size?:
    | `title-medium`
    | `title-small`
    | `heading-large`
    | `heading-large-bold`
    | `heading-small`
    | `heading-small-bold`
    | `body-medium`
    | `body-medium-bold`
    | `body-small`
    | `body-small-bold`;
  /**
   * Indicates whether a text suffix should be used
   *
   * @default 'decimals'
   */
  suffix?: 'decimals' | 'none' | 'humanize';
  /**
   * Highlight the main amount by making the prefix symbol and decimal digits small
   *
   * @default true
   */
  isAffixSubtle?: true | false;
  /**
   * Prefix to be shown before the currency value. The prefix can be either a currency symbol or a currency code.
   *
   * @default 'currency-symbol'
   */
  prefix?: 'currency-symbol' | 'currency-code';
} & TestID;

type ColorProps = {
  textColor: BaseTextProps['color'];
  prefixSuffixColor: BaseTextProps['color'];
};

const getColorProps = ({ intent }: { intent: AmountProps['intent'] }): ColorProps => {
  const props: ColorProps = {
    textColor: 'surface.text.normal.lowContrast',
    prefixSuffixColor: 'surface.text.muted.lowContrast',
  };
  if (!intent) return props;
  props.textColor = `feedback.text.${intent}.lowContrast`;
  props.prefixSuffixColor = `feedback.text.${intent}.lowContrast`;
  if (intent === 'neutral') {
    props.prefixSuffixColor = `surface.text.muted.lowContrast`;
  }
  return props;
};

const getFlooredFixed = (value: number, precision: number): number => {
  const factor = 10 ** precision;
  const roundedValue = Math.floor(value * factor) / factor;
  return Number(roundedValue.toFixed(precision));
};

const addCommas = (num: number, currency: currencyType): string => {
  const locale = currencylocaleMapping[currency];
  return num.toLocaleString(locale);
};

const getFormattedAmountWithSuffixSymbol = (num: number, currency: currencyType): string => {
  const abbreviations: { value: number; symbol: string }[] = currencyAbbreviationsMapping[currency];

  const abbreviation = abbreviations.find((abbr) => num >= abbr.value);
  if (abbreviation) {
    num = num / abbreviation.value;
    const formattedNum = Number(getFlooredFixed(num, 2));
    return addCommas(formattedNum, currency) + abbreviation.symbol;
  } else {
    return num.toString();
  }
};

const formatAmountWithSuffix = (
  suffix: AmountProps['suffix'],
  num: number,
  currency: currencyType,
): string => {
  switch (suffix) {
    case suffixTypes.DECIMALS: {
      const decimalNum = getFlooredFixed(num, 2);
      return addCommas(decimalNum, currency);
    }
    case suffixTypes.HUMANIZE: {
      return getFormattedAmountWithSuffixSymbol(num, currency);
    }
    default:
      return String(getFlooredFixed(num, 0));
  }
};

const getCurrencyWeight = (
  isAffixSubtle: NonNullable<AmountProps['isAffixSubtle']>,
  size: NonNullable<AmountProps['size']>,
): 'bold' | 'regular' => {
  if (isAffixSubtle || size.includes('bold')) return 'bold';
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
  if (typeof value !== 'number' && !isNaN(value)) {
    throw new Error('[Blade: Amount]: Number as value is required for Amount.');
  }

  // This will be added to prop and can be switched to a currency
  const currency = 'INR';
  const currencyPrefix = currencyPrefixMapping[currency][prefix];
  const renderedValue = formatAmountWithSuffix(suffix, value, currency);
  const { textColor, prefixSuffixColor } = getColorProps({
    intent,
  });

  const currencyColor = isAffixSubtle ? prefixSuffixColor : textColor;
  const currencyFontSize = getAffixFontSize(isAffixSubtle, size);
  const currencyWeight = getCurrencyWeight(isAffixSubtle, size);

  return (
    <StyledAmount {...metaAttribute({ name: MetaConstants.Amount, testID })}>
      <BaseBox
        display="flex"
        flexDirection="row"
        justifyContent="center"
        alignItems="baseline"
        overflow="hidden"
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
          textColor={textColor}
          size={size}
          isAffixSubtle={isAffixSubtle}
          suffix={suffix}
          prefixSuffixColor={prefixSuffixColor}
        />
      </BaseBox>
    </StyledAmount>
  );
};

export { Amount, AmountProps };
