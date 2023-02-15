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

export { verticalPadding, horizontalPadding, iconPadding };
