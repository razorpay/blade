import type { AmountProps } from './Amount';
import type { DotNotationSpacingStringToken } from '~src/_helpers/types';
import type { IconProps } from '~components/Icons';

const verticalPadding: Record<NonNullable<AmountProps['size']>, DotNotationSpacingStringToken> = {
  small: 'spacing.0',
  medium: 'spacing.1',
  large: 'spacing.2',
};

const horizontalPadding: Record<NonNullable<AmountProps['size']>, DotNotationSpacingStringToken> = {
  small: 'spacing.3',
  medium: 'spacing.3',
  large: 'spacing.4',
};

const iconPadding: Record<NonNullable<AmountProps['size']>, DotNotationSpacingStringToken> = {
  small: 'spacing.1',
  medium: 'spacing.2',
  large: 'spacing.2',
};

const iconSize: Record<NonNullable<AmountProps['size']>, IconProps['size']> = {
  small: 'xsmall',
  medium: 'small',
  large: 'small',
};

export { verticalPadding, horizontalPadding, iconPadding, iconSize };
