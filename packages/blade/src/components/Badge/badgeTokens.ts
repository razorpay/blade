import type { BadgeProps } from './Badge';
import type { DotNotationSpacingStringToken } from '~utils/types';
import type { IconProps } from '~components/Icons';
import { size } from '~tokens/global/size';

const badgeHeight: Record<NonNullable<BadgeProps['size']>, number> = {
  xsmall: size[14],
  small: size[16],
  medium: size[20],
  large: size[24],
};

const horizontalPadding: Record<NonNullable<BadgeProps['size']>, DotNotationSpacingStringToken> = {
  xsmall: 'spacing.2',
  small: 'spacing.2',
  medium: 'spacing.2',
  large: 'spacing.3',
};

const textHorizontalMargin: Record<
  NonNullable<BadgeProps['size']>,
  DotNotationSpacingStringToken
> = {
  xsmall: 'spacing.1',
  small: 'spacing.1',
  medium: 'spacing.2',
  large: 'spacing.2',
};

const iconSize: Record<NonNullable<BadgeProps['size']>, IconProps['size']> = {
  xsmall: 'xsmall',
  small: 'xsmall',
  medium: 'small',
  large: 'small',
};

export { badgeHeight, horizontalPadding, textHorizontalMargin, iconSize };
