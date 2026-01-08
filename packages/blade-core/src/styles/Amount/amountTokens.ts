import type { FontSize, Typography } from '../../tokens/global';

export type AmountSizes = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge';

export type AmountDisplayProps = {
  type?: 'display';
  size?: Extract<AmountSizes, 'small' | 'medium' | 'large' | 'xlarge'>;
};

export type AmountHeadingProps = {
  type?: 'heading';
  size?: Extract<AmountSizes, 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge'>;
};

export type AmountBodyProps = {
  type?: 'body';
  size?: Extract<AmountSizes, 'xsmall' | 'small' | 'medium' | 'large'>;
};

export type AmountTypeProps = AmountDisplayProps | AmountHeadingProps | AmountBodyProps;

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

export { subtleFontSizes, normalAmountSizes, amountLineHeights };
