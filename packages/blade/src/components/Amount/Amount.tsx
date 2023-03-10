import type { ReactElement } from 'react';

import {
  currencyAbbreviationsMapping,
  currencylocaleMapping,
  currencyPrefixMapping,
  horizontalPadding,
  verticalPadding,
} from './amountTokens';
import AmountValue, { getSuffixPrefixFontSize } from './AmountValue';
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
  intent?: Feedback;
  /**
   * Sets the variant of the amount.
   *
   * @default 'heading'
   */
  size?:
    | `title-medium`
    | `title-small`
    | `heading-large`
    | `heading-small`
    | `body-medium`
    | `body-small`;
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
      return String(getFlooredFixed(num, 2));
  }
};

const Amount = ({
  value,
  suffix = 'decimals',
  size = 'heading-small',
  isAffixSubtle = true,
  intent = 'neutral',
  prefix = 'currency-symbol',
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
  const currencyFontSize = getSuffixPrefixFontSize(isAffixSubtle, size);

  return (
    <StyledAmount
      {...metaAttribute(MetaConstants.Component, MetaConstants.Amount)}
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
      <Box paddingRight={1}>
        <BaseText fontWeight="bold" fontSize={currencyFontSize} color={currencyColor}>
          {currencyPrefix}
        </BaseText>
      </Box>
      <AmountValue
        value={renderedValue}
        textColor={textColor}
        size={size}
        isAffixSubtle={isAffixSubtle}
        suffix={suffix}
        prefixSuffixColor={prefixSuffixColor}
      />
    </StyledAmount>
  );
};

export { Amount, AmountProps };
