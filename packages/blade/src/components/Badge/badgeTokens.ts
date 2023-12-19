import type { BadgeProps } from './Badge';
import type { DotNotationSpacingStringToken } from '~utils/types';
import type { IconProps } from '~components/Icons';
import { size } from '~tokens/global/size';

const badgeHeight: Record<NonNullable<BadgeProps['size']>, number> = {
  small: size[16],
  medium: size[20],
  large: size[24],
};

const horizontalPadding: Record<NonNullable<BadgeProps['size']>, DotNotationSpacingStringToken> = {
  small: 'spacing.3',
  medium: 'spacing.3',
  large: 'spacing.4',
};

const iconPadding: Record<NonNullable<BadgeProps['size']>, DotNotationSpacingStringToken> = {
  small: 'spacing.1',
  medium: 'spacing.2',
  large: 'spacing.2',
};

const iconSize: Record<NonNullable<BadgeProps['size']>, IconProps['size']> = {
  small: 'xsmall',
  medium: 'small',
  large: 'small',
};

export { badgeHeight, horizontalPadding, iconPadding, iconSize };
