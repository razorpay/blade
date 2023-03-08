import type { AmountProps } from './Amount';
import type { DotNotationSpacingStringToken } from '~src/_helpers/types';

const verticalPadding: Record<NonNullable<AmountProps['size']>, DotNotationSpacingStringToken> = {
  small: 'spacing.0',
  medium: 'spacing.1',
  large: 'spacing.2',
  xlarge: 'spacing.2',
  '2xlarge': 'spacing.2',
  '3xlarge': 'spacing.2',
} as const;

const horizontalPadding: Record<NonNullable<AmountProps['size']>, DotNotationSpacingStringToken> = {
  small: 'spacing.3',
  medium: 'spacing.3',
  large: 'spacing.4',
  xlarge: 'spacing.2',
  '2xlarge': 'spacing.2',
  '3xlarge': 'spacing.2',
} as const;

const iconPadding: Record<NonNullable<AmountProps['size']>, DotNotationSpacingStringToken> = {
  small: 'spacing.1',
  medium: 'spacing.2',
  large: 'spacing.2',
  xlarge: 'spacing.2',
  '2xlarge': 'spacing.2',
  '3xlarge': 'spacing.2',
} as const;

const prefixSuffixTextSizes = {
  small: 50,
  medium: 50,
  large: 50,
  xlarge: 75,
  '2xlarge': 200,
  '3xlarge': 300,
} as const;

const amountTextSizes = {
  small: 50,
  medium: 75,
  large: 100,
  xlarge: 300,
  '2xlarge': 500,
  '3xlarge': 700,
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
  iconPadding,
  amountTextSizes,
  prefixSuffixTextSizes,
  currencyPrefixMapping,
  currencylocaleMapping,
  currencyAbbreviationsMapping,
};
