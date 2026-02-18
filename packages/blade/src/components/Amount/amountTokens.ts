import type { FontSize, Typography } from '~tokens/global';
import type { BaseTextProps } from '~components/Typography/BaseText/types';

type AmountSizes = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge';

type AmountDisplayProps = {
  type?: 'display';
  size?: Extract<AmountSizes, 'small' | 'medium' | 'large' | 'xlarge'>;
  weight?: Extract<BaseTextProps['fontWeight'], 'regular' | 'medium' | 'semibold'>;
};

type AmountHeadingProps = {
  type?: 'heading';
  size?: Extract<AmountSizes, 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge'>;
  weight?: Extract<BaseTextProps['fontWeight'], 'regular' | 'semibold'>;
};

type AmountBodyProps = {
  type?: 'body';
  size?: Extract<AmountSizes, 'xsmall' | 'small' | 'medium' | 'large'>;
  weight?: Extract<BaseTextProps['fontWeight'], 'regular' | 'medium' | 'semibold'>;
};

type AmountTypeProps = AmountDisplayProps | AmountHeadingProps | AmountBodyProps;

const normalAmountSizes: Record<
  'body' | 'heading' | 'display',
  Partial<Record<NonNullable<AmountTypeProps['size']>, keyof FontSize>>
> = {
  body: {
    xsmall: 25,
    small: 75,
    medium: 100,
    large: 200,
  },
  heading: {
    small: 300,
    medium: 400,
    large: 500,
    xlarge: 600,
    '2xlarge': 700,
  },
  display: {
    small: 800,
    medium: 900,
    large: 1000,
    xlarge: 1100,
  },
};

/**
 * Hardcoded pixel values for currency symbols to match exact Figma specifications.
 * These values provide precise visual alignment that standard tokens cannot achieve.
 *
 * Used when `isAffixSubtle={false}` - currency symbols are slightly smaller than main number.
 */
const currencyHardcodedSizes: Record<
  'body' | 'heading' | 'display',
  Partial<Record<NonNullable<AmountTypeProps['size']>, { desktop: number; mobile: number }>>
> = {
  body: {
    xsmall: { desktop: 10, mobile: 10 },
    small: { desktop: 10, mobile: 10 },
    medium: { desktop: 10, mobile: 10 },
    large: { desktop: 12, mobile: 12 },
  },
  heading: {
    small: { desktop: 17, mobile: 15 },
    medium: { desktop: 19, mobile: 17 },
    large: { desktop: 22, mobile: 19 },
    xlarge: { desktop: 30, mobile: 22 },
    '2xlarge': { desktop: 37, mobile: 30 },
  },
  display: {
    small: { desktop: 45, mobile: 32 },
    medium: { desktop: 52, mobile: 34 },
    large: { desktop: 60, mobile: 36 },
    xlarge: { desktop: 66, mobile: 37 },
  },
};

const subtleFontSizes: Record<
  'body' | 'heading' | 'display',
  Partial<Record<NonNullable<AmountTypeProps['size']>, keyof FontSize>>
> = {
  body: {
    xsmall: normalAmountSizes.body.xsmall,
    small: normalAmountSizes.body.xsmall,
    medium: normalAmountSizes.body.xsmall,
    large: normalAmountSizes.body.small,
  },
  heading: {
    small: normalAmountSizes.body.small,
    medium: normalAmountSizes.body.medium,
    large: normalAmountSizes.body.large,
    xlarge: normalAmountSizes.heading.medium,
    '2xlarge': normalAmountSizes.heading.large,
  },
  display: {
    small: normalAmountSizes.heading.xlarge,
    medium: normalAmountSizes.heading['2xlarge'],
    large: normalAmountSizes.heading['2xlarge'],
    xlarge: normalAmountSizes.display.small,
  },
};

const amountLineHeights: Record<
  'body' | 'heading' | 'display',
  Partial<Record<NonNullable<AmountTypeProps['size']>, keyof Typography['lineHeights']>>
> = {
  body: {
    xsmall: 25,
    small: 75,
    medium: 100,
    large: 200,
  },
  heading: {
    small: 300,
    medium: 400,
    large: 500,
    xlarge: 600,
    '2xlarge': 700,
  },
  display: {
    small: 800,
    medium: 900,
    large: 1000,
    xlarge: 1100,
  },
};

export { subtleFontSizes, normalAmountSizes, currencyHardcodedSizes, amountLineHeights };

export type { AmountBodyProps, AmountDisplayProps, AmountHeadingProps, AmountTypeProps };
