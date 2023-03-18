import type { FontSize } from './../../tokens/global/typography';
import type { AmountProps } from './Amount';

const affixFontSizes: Record<NonNullable<AmountProps['size']>, keyof FontSize> = {
  'body-small': 75,
  'body-small-bold': 75,
  'body-medium': 75,
  'body-medium-bold': 75,
  'heading-small': 75,
  'heading-small-bold': 75,
  'heading-large': 100,
  'heading-large-bold': 100,
  'title-small': 300,
  'title-medium': 400,
} as const;

const amountFontSizes: Record<NonNullable<AmountProps['size']>, keyof FontSize> = {
  'body-small': 75,
  'body-small-bold': 75,
  'body-medium': 100,
  'body-medium-bold': 100,
  'heading-small': 200,
  'heading-small-bold': 200,
  'heading-large': 400,
  'heading-large-bold': 400,
  'title-small': 600,
  'title-medium': 700,
} as const;

type CurrencyPrefixMapping = {
  [key: string]: {
    'currency-symbol': string;
    'currency-code': string;
  };
};

const currencyPrefixMapping: CurrencyPrefixMapping = {
  INR: {
    'currency-symbol': '₹',
    'currency-code': 'INR',
  },
  MYR: {
    'currency-symbol': 'RM',
    'currency-code': 'MYR',
  },
};

type CurrencyLocaleMapping = {
  [key: string]: string;
};

const currencyLocaleMapping: CurrencyLocaleMapping = {
  INR: 'en-IN',
  MYR: 'en-MY',
};

type CurrencyAbbreviation = {
  value: number;
  symbol: string;
};

type CurrencyAbbreviationsMapping = {
  [key: string]: CurrencyAbbreviation[];
};

const currencyAbbreviationsMapping: CurrencyAbbreviationsMapping = {
  INR: [
    { value: 1e7, symbol: 'Cr' },
    { value: 1e5, symbol: 'L' },
    { value: 1e3, symbol: 'k' },
  ],
  MYR: [
    { value: 1e9, symbol: 'B' },
    { value: 1e6, symbol: 'M' },
    { value: 1e3, symbol: 'K' },
  ],
};

export {
  amountFontSizes,
  affixFontSizes,
  currencyPrefixMapping,
  currencyLocaleMapping,
  currencyAbbreviationsMapping,
};
