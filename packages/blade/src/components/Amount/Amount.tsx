import type { ReactElement } from 'react';

import { horizontalPadding, verticalPadding } from './amountTokens';
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
   * Sets the variant of the amount.
   *
   * @default 'neutral'
   */
  variant?: Feedback;
  /**
   * Sets the size of the amount.
   *
   * @default 'low'
   */
  size?: `3xlarge` | `2xlarge` | `xlarge` | `large` | `medium` | `small`;
  /**
   * Sets the weight of the label.
   *
   * @default 'regular'
   */
  weight?: 'regular' | 'bold';
  /**
   * Indicates whether a text suffix should be used
   *
   * @default 'regular'
   */
  suffix?: 'decimals' | 'none' | 'humanize';
  /**
   * Highlight the main amount by making the prefix symbol and decimal digits small
   *
   * @default 'Decimals'
   */
  isAffixSubtle?: true | false;
};

const RUPEE_SYMBOL = '₹';

type ColorProps = {
  textColor: BaseTextProps['color'];
  prefixSuffixColor: BaseTextProps['color'];
};

const getColorProps = ({
  variant,
}: {
  variant: NonNullable<AmountProps['variant']>;
}): ColorProps => {
  const props: ColorProps = {
    textColor: 'feedback.text.neutral.lowContrast',
    prefixSuffixColor: 'feedback.text.neutral.lowContrast',
  };
  props.textColor = `feedback.text.${variant}.lowContrast`;
  props.prefixSuffixColor = `feedback.text.${variant}.lowContrast`;
  if (variant === 'neutral') {
    props.prefixSuffixColor = `surface.text.muted.lowContrast`;
  }
  return props;
};

const getFlooredFixed = (value: number, precision: number): number => {
  const factor = 10 ** precision;
  const roundedValue = Math.floor(value * factor) / factor;
  return Number(roundedValue.toFixed(precision));
};

const addCommas = (num: number): string => {
  return num.toLocaleString('en-IN');
};

const getFormattedAmountWithSuffixSymbol = (num: number): string => {
  const abbreviations = [
    { value: 1e9, symbol: 'Cr' },
    { value: 1e5, symbol: 'L' },
    { value: 1e3, symbol: 'k' },
  ];

  const abbreviation = abbreviations.find((abbr) => num >= abbr.value);
  if (abbreviation) {
    num = num / abbreviation.value;
    const formattedNum = Number(getFlooredFixed(num, 2));
    return addCommas(formattedNum) + abbreviation.symbol;
  } else {
    return num.toString();
  }
};

const formatAmountWithSuffix = (suffix: string, num: number): string => {
  switch (suffix) {
    case suffixTypes.DECIMALS: {
      const decimalNum = getFlooredFixed(num, 2);
      return addCommas(decimalNum);
    }
    case suffixTypes.HUMANIZE: {
      return getFormattedAmountWithSuffixSymbol(num);
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
  suffix = 'decimals',
  weight = 'regular',
  size = 'medium',
  isAffixSubtle = true,
  variant = 'neutral',
}: AmountProps): ReactElement => {
  if (typeof value !== 'number' && !isNaN(value)) {
    throw new Error('[Blade: Amount]: Number as value is required for Amount.');
  }
  const renderedValue = formatAmountWithSuffix(suffix, value);
  const { textColor, prefixSuffixColor } = getColorProps({
    variant,
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
          {RUPEE_SYMBOL}
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
