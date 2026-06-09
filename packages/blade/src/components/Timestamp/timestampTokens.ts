import type { FontSize, Typography } from '~tokens/global';
import type { BaseTextProps } from '~components/Typography/BaseText/types';

// --- Discriminated union type system (mirrors Amount's pattern) ---

type TimestampBodyProps = {
  /**
   * Controls the typographic scale of the timestamp.
   * - `"body"`:    body text scale — use in table cells, lists, inline contexts
   * - `"heading"`: heading scale — use in section headers, drawer titles
   * - `"display"`: display scale — use in dashboard summary cards, hero numbers
   *
   * @default "body"
   */
  type?: 'body';
  /** Body sizes: xsmall → large */
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  weight?: Extract<BaseTextProps['fontWeight'], 'regular' | 'medium' | 'semibold'>;
};

type TimestampHeadingProps = {
  type?: 'heading';
  /** Heading sizes: small → 2xlarge */
  size?: 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge';
  weight?: Extract<BaseTextProps['fontWeight'], 'regular' | 'semibold'>;
};

type TimestampDisplayProps = {
  type?: 'display';
  /** Display sizes: small → xlarge */
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  weight?: Extract<BaseTextProps['fontWeight'], 'regular' | 'medium' | 'semibold'>;
};

type TimestampTypeProps = TimestampBodyProps | TimestampHeadingProps | TimestampDisplayProps;

// --- Font size token maps (mirrors normalAmountSizes) ---

const timestampFontSizes: Record<
  'body' | 'heading' | 'display',
  Partial<Record<string, keyof FontSize>>
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

// --- Line height token maps (mirrors amountLineHeights) ---

const timestampLineHeights: Record<
  'body' | 'heading' | 'display',
  Partial<Record<string, keyof Typography['lineHeights']>>
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

// Valid size sets per type — used for runtime __DEV__ validation
const bodySizes: NonNullable<TimestampBodyProps['size']>[] = ['xsmall', 'small', 'medium', 'large'];
const headingSizes: NonNullable<TimestampHeadingProps['size']>[] = [
  'small',
  'medium',
  'large',
  'xlarge',
  '2xlarge',
];
const displaySizes: NonNullable<TimestampDisplayProps['size']>[] = [
  'small',
  'medium',
  'large',
  'xlarge',
];

export {
  timestampFontSizes,
  timestampLineHeights,
  bodySizes,
  headingSizes,
  displaySizes,
};

export type { TimestampBodyProps, TimestampHeadingProps, TimestampDisplayProps, TimestampTypeProps };
