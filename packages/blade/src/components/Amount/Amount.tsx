import type { ReactElement } from 'react';

import {
  currencyAbbreviationsMapping,
  currencylocaleMapping,
  currencyPrefixMapping,
  horizontalPadding,
  verticalPadding,
} from './amountTokens';
import BaseAmount, { getSuffixPrefixFontSize } from './BaseAmount';
import { StyledAmount } from './StyledAmount';
import { BaseText } from '~components/Typography/BaseText';
import type { Feedback } from '~tokens/theme/theme';
import type { BaseTextProps } from '~components/Typography/BaseText/types';
import Box from '~components/Box';
import { metaAttribute, MetaConstants } from '~utils';

export const suffixTypes = {
  HUMANIZE: 'humanize',
  DECIMALS: 'decimals',
  NONE: 'none',
};

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
  intent?: Feedback;
  /**
   * Sets the variant of the amount.
   *
   * @default 'heading'
   */
  variant?: `heading` | `title` | `body`;
  /**
   * Sets the size of the amount.
   *
   * @default 'low'
   */
  size?: `large` | `medium` | `small`;
  /**
   * Sets the weight of the label.
   *
   * @default 'regular'
   */
  weight?: 'regular' | 'bold';
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
  /**
   * Currency to be used
   *
   * @default 'INR'
   */
  currency?: 'INR' | 'MYR';
};

type ColorProps = {
  textColor: BaseTextProps['color'];
  prefixSuffixColor: BaseTextProps['color'];
};

const getColorProps = ({ intent }: { intent: NonNullable<AmountProps['intent']> }): ColorProps => {
  const props: ColorProps = {
    textColor: 'feedback.text.neutral.lowContrast',
    prefixSuffixColor: 'feedback.text.neutral.lowContrast',
  };
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

const addCommas = (num: number, currency: AmountProps['currency']): string => {
  const locale = currencylocaleMapping[currency];
  return num.toLocaleString(locale);
};

const getFormattedAmountWithSuffixSymbol = (
  num: number,
  currency: AmountProps['currency'],
): string => {
  const abbreviations: [{ value: number; symbol: string }] = currencyAbbreviationsMapping[currency];

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
  currency: AmountProps['currency'],
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
      return String(getFlooredFixed(num, 2));
  }
};

const getRupeeweight = (
  isAffixSubtle: true | false,
  weight: 'regular' | 'bold',
): 'regular' | 'bold' => {
  if (!isAffixSubtle && weight === 'regular') return 'regular';
  return 'bold';
};

const Amount = ({
  value,
  currency = 'INR',
  suffix = 'decimals',
  variant = 'heading',
  weight = 'regular',
  size = 'medium',
  isAffixSubtle = true,
  intent = 'neutral',
  prefix = 'currency-symbol',
}: AmountProps): ReactElement => {
  if (typeof value !== 'number' && !isNaN(value)) {
    throw new Error('[Blade: Amount]: Number as value is required for Amount.');
  }

  const currencyPrefix = currencyPrefixMapping[currency][prefix];
  const renderedValue = formatAmountWithSuffix(suffix, value, currency);
  const { textColor, prefixSuffixColor } = getColorProps({
    intent,
  });
  const rupeeweight = getRupeeweight(isAffixSubtle, weight);
  const rupeeFontSize = getSuffixPrefixFontSize(isAffixSubtle, size);

  return (
    <StyledAmount {...metaAttribute(MetaConstants.Component, MetaConstants.Amount)}>
      <Box
        paddingRight={horizontalPadding[size]}
        paddingLeft={horizontalPadding[size]}
        paddingTop={verticalPadding[size]}
        paddingBottom={verticalPadding[size]}
        display="flex"
        flexDirection="row"
        justifyContent="center"
        alignItems="baseline"
        overflow="hidden"
      >
        <BaseText fontWeight={rupeeweight} fontSize={rupeeFontSize} color={prefixSuffixColor}>
          {currencyPrefix}
        </BaseText>
        <BaseAmount
          value={renderedValue}
          weight={weight}
          textColor={textColor}
          size={size}
          isAffixSubtle={isAffixSubtle}
          suffix={suffix}
          prefixSuffixColor={prefixSuffixColor}
        />
      </Box>
    </StyledAmount>
  );
};

export { Amount, AmountProps };
