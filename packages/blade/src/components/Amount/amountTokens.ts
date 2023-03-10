import type { AmountProps } from './Amount';
import type { DotNotationSpacingStringToken } from '~src/_helpers/types';

const verticalPadding: Record<NonNullable<AmountProps['size']>, DotNotationSpacingStringToken> = {
  'body-small': 'spacing.0',
  'body-medium': 'spacing.1',
  'heading-small': 'spacing.2',
  'heading-large': 'spacing.2',
  'title-small': 'spacing.2',
  'title-medium': 'spacing.2',
} as const;

const horizontalPadding: Record<NonNullable<AmountProps['size']>, DotNotationSpacingStringToken> = {
  'body-small': 'spacing.3',
  'body-medium': 'spacing.3',
  'heading-small': 'spacing.4',
  'heading-large': 'spacing.2',
  'title-small': 'spacing.2',
  'title-medium': 'spacing.2',
} as const;

const prefixSuffixTextSizes = {
  'body-small': 50,
  'body-medium': 50,
  'heading-small': 50,
  'heading-large': 75,
  'title-small': 200,
  'title-medium': 300,
} as const;

const amountTextSizes = {
  'body-small': 50,
  'body-medium': 75,
  'heading-small': 100,
  'heading-large': 300,
  'title-small': 500,
  'title-medium': 700,
} as const;

const currencyPrefixMapping = {
  INR: {
    'currency-symbol': '₹',
    'currency-code': 'INR',
  },
  MYR: {
    'currency-symbol': 'RM',
    'currency-code': 'MYR',
  },
};

const currencylocaleMapping = {
  INR: 'en-IN',
  MYR: 'en-MY',
};

const currencyAbbreviationsMapping = {
  INR: [
    { value: 1e9, symbol: 'Cr' },
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
  verticalPadding,
  horizontalPadding,
  amountTextSizes,
  prefixSuffixTextSizes,
  currencyPrefixMapping,
  currencylocaleMapping,
  currencyAbbreviationsMapping,
};
