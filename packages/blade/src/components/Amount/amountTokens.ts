import type { AmountProps } from './Amount';
import type { DotNotationSpacingStringToken } from '~src/_helpers/types';

const verticalPadding: Record<NonNullable<AmountProps['size']>, DotNotationSpacingStringToken> = {
  small: 'spacing.0',
  medium: 'spacing.1',
  large: 'spacing.2',
  xlarge: 'spacing.2',
  '2xlarge': 'spacing.2',
  '3xlarge': 'spacing.2',
};

const horizontalPadding: Record<NonNullable<AmountProps['size']>, DotNotationSpacingStringToken> = {
  small: 'spacing.3',
  medium: 'spacing.3',
  large: 'spacing.4',
  xlarge: 'spacing.2',
  '2xlarge': 'spacing.2',
  '3xlarge': 'spacing.2',
};

const iconPadding: Record<NonNullable<AmountProps['size']>, DotNotationSpacingStringToken> = {
  small: 'spacing.1',
  medium: 'spacing.2',
  large: 'spacing.2',
  xlarge: 'spacing.2',
  '2xlarge': 'spacing.2',
  '3xlarge': 'spacing.2',
};

const prefixSuffixTextSizes = {
  small: 50,
  medium: 50,
  large: 200,
  xlarge: 75,
  '2xlarge': 200,
  '3xlarge': 300,
} as const;

const amountTextSizes = {
  small: {
    fontSize: 50,
  },
  medium: {
    fontSize: 75,
  },
  large: {
    fontSize: 100,
  },
  xlarge: {
    fontSize: 300,
  },
  '2xlarge': {
    fontSize: 500,
  },
  '3xlarge': {
    fontSize: 700,
  },
} as const;

export { verticalPadding, horizontalPadding, iconPadding, amountTextSizes, prefixSuffixTextSizes };
