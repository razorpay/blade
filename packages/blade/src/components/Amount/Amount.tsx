import { Children, ReactElement, useState } from 'react';
import { BaseText } from '../Typography/BaseText/BaseText.web';
import { horizontalPadding, verticalPadding } from './amountTokens';
import Box from '~components/Box';
import type { Feedback } from '~tokens/theme/theme';
import type { BaseTextProps } from '~components/Typography/BaseText/types';
import { metaAttribute, MetaConstants } from '~utils';

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
  variant?: Feedback | 'blue';
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
   * Indicates whether the amount has or can have decimals
   *
   * @default 'regular'
   */
  hasDecimals?: true | false;
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
};

const getColorProps = ({
  variant,
}: {
  variant: NonNullable<AmountProps['variant']>;
}): ColorProps => {
  const props: ColorProps = {
    textColor: 'feedback.text.neutral.lowContrast',
  };
  if (isFeedbackVariant(variant)) {
    props.textColor = `feedback.text.${variant}.lowContrast`;
  } else {
    props.textColor = `badge.text.${variant}.lowContrast`;
  }
  return props;
};

const addCommas = (num) => {
  return Number(num).toLocaleString('en-IN');
};

const getFormattedAmountWithSuffixSymbol = (num) => {
  if (num < 1000) {
    return num.toFixed(2);
  }
  if (num >= 1000 && num < 100000) {
    return (num / 1000).toFixed(0) + ' k';
  }
  if (num >= 100000 && num < 10000000) {
    return (num / 100000).toFixed(0) + ' l';
  }
  return (num / 10000000).toFixed(0) + ' Cr';
};

const formatAmountWithSuffix = (suffix, num) => {
  switch (suffix) {
    case 'Decimals': {
      return addCommas(parseFloat(num).toFixed(2));
    }
    case 'Humanise': {
      return getFormattedAmountWithSuffixSymbol(num);
    }
    default:
      return num;
  }
};

const Amount = ({
  children,
  suffix = 'Humanise',
  fontWeight = 'regular',
  size = 'medium',
  isSuffixPrefixHighlighted = true,
  variant = 'neutral',
}: AmountProps): ReactElement => {
  if (!children?.trim()) {
    throw new Error('[Blade: Badge]: Text as children is required for Badge.');
  }

  const value = formatAmountWithSuffix(suffix, Number(children));
  const { textColor } = getColorProps({
    variant,
  });

  const amountTextSizes = {
    small: {
      variant: 'body',
      size: 'xsmall',
    },
    medium: {
      variant: 'body',
      size: 'small',
    },
    large: {
      variant: 'body',
      size: 200,
    },
    xlarge: {
      variant: 'body',
      size: 200,
    },
    '2xlarge': {
      variant: 'body',
      size: 'small',
    },
    '3xlarge': {
      variant: 'body',
      size: 'small',
    },
  } as const;

  return (
    <Box
      paddingRight={horizontalPadding[size]}
      paddingLeft={horizontalPadding[size]}
      paddingTop={verticalPadding[size]}
      paddingBottom={verticalPadding[size]}
      display="flex"
      flexDirection="row"
      justifyContent="center"
      alignItems="center"
      overflow="hidden"
    >
      <BaseText
        {...amountTextSizes[size]}
        type="normal"
        weight={fontWeight}
        truncateAfterLines={1}
        color={textColor}
      >
        {RUPEE_SYMBOL}
        {value}
      </BaseText>
    </Box>
  );
};

export { Amount, AmountProps };
