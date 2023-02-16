import type { ReactElement } from 'react';
import { BaseText } from '../Typography/BaseText/BaseText.web';
import { horizontalPadding, verticalPadding } from './amountTokens';
import BaseAmount, { getSuffixPrefixFontSize } from './BaseAmount';
import Box from '~components/Box';
import type { Feedback } from '~tokens/theme/theme';
import type { BaseTextProps } from '~components/Typography/BaseText/types';

// import { metaAttribute, MetaConstants } from '~utils';

type AmountProps = {
  /**
   * The value to be rendered within the component.
   *
   */
  children: string;
  /**
   * Sets the variant of the amount.
   *
   * @default 'neutral'
   */
  variant?: Feedback | 'blue' | 'none';
  /**
   * Sets the size of the amount.
   *
   * @default 'low'
   */
  size?: `3xlarge` | `2xlarge` | `xlarge` | `large` | `medium` | `small`;
  /**
   * Sets the fontWeight of the label.
   *
   * @default 'regular'
   */
  fontWeight?: 'regular' | 'bold';
  /**
   * Indicates whether a text suffix should be used
   *
   * @default 'regular'
   */
  suffix?: 'Decimals' | 'None' | 'Humanise';
  /**
   * Highlight the main amount by making the prefix symbol and decimal digits small
   *
   * @default 'regular'
   */
  isSuffixPrefixHighlighted?: true | false;
};

const RUPEE_SYMBOL = '₹';

const isFeedbackVariant = (variant: string): variant is Feedback => {
  const feedbackVariants = ['information', 'negative', 'neutral', 'notice', 'positive'];
  return feedbackVariants.includes(variant);
};

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
  if (isFeedbackVariant(variant)) {
    props.textColor = `feedback.text.${variant}.lowContrast`;
    props.prefixSuffixColor = `feedback.text.${variant}.lowContrast`;
    if (variant === 'neutral') {
      props.prefixSuffixColor = `surface.text.muted.lowContrast`;
    }
  } else {
    props.textColor = `badge.text.${variant}.lowContrast`;
    props.prefixSuffixColor = `badge.text.${variant}.lowContrast`;
  }
  return props;
};

const addCommas = (num: string): string => {
  return Number(num).toLocaleString('en-IN');
};

const getFormattedAmountWithSuffixSymbol = (num: number): string => {
  let suffix = '';
  if (num >= 10000000) {
    num = (num / 10000000).toFixed(2);
    suffix = 'Cr';
  } else if (num >= 100000) {
    num = (num / 100000).toFixed(2);
    suffix = 'l';
  } else if (num >= 1000) {
    num = (num / 1000).toFixed(2);
    suffix = 'k';
  } else {
    num = num.toFixed(2);
  }
  return addCommas(num) + suffix;
};

const formatAmountWithSuffix = (suffix: string, num: number): string => {
  switch (suffix) {
    case 'Decimals': {
      return addCommas(num.toFixed(2));
    }
    case 'Humanise': {
      return getFormattedAmountWithSuffixSymbol(num);
    }
    default:
      return num.toFixed(0);
  }
};

const getRupeeFontWeight = (
  isSuffixPrefixHighlighted: true | false,
  fontWeight: 'regular' | 'bold',
): 'regular' | 'bold' => {
  if (!isSuffixPrefixHighlighted && fontWeight === 'regular') return 'regular';
  return 'bold';
};

const Amount = ({
  children,
  suffix = 'Decimals',
  fontWeight = 'regular',
  size = 'medium',
  isSuffixPrefixHighlighted = true,
  variant = 'neutral',
}: AmountProps): ReactElement => {
  if (!children?.trim() && typeof children !== 'string' && !isNaN(children)) {
    throw new Error('[Blade: Badge]: Number as children is required for Amount.');
  }

  const num = Number(children);
  const value = formatAmountWithSuffix(suffix, num);
  const { textColor, prefixSuffixColor } = getColorProps({
    variant,
  });

  return (
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
      <BaseText
        fontWeight={getRupeeFontWeight(size, fontWeight)}
        fontSize={getSuffixPrefixFontSize(isSuffixPrefixHighlighted, size)}
        color={prefixSuffixColor}
      >
        {RUPEE_SYMBOL}
      </BaseText>
      <BaseAmount
        value={value}
        fontWeight={fontWeight}
        textColor={textColor}
        size={size}
        isSuffixPrefixHighlighted={isSuffixPrefixHighlighted}
        suffix={suffix}
        prefixSuffixColor={prefixSuffixColor}
      />
    </Box>
  );
};

export { Amount, AmountProps };
