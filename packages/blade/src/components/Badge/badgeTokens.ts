import type { BadgeProps } from './Badge';
import type { TypographyPlatforms } from '~tokens/global/typography';
import type { DotNotationSpacingStringToken } from '~src/_helpers/types';
import type { IconProps } from '~components/Icons';

type BadgeMaxWidth = 100 | 120;

const verticalPadding: Record<NonNullable<BadgeProps['size']>, DotNotationSpacingStringToken> = {
  small: 'spacing.0',
  medium: 'spacing.1',
  large: 'spacing.2',
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

const maxWidth: Record<NonNullable<TypographyPlatforms>, BadgeMaxWidth> = {
  onMobile: 100,
  onDesktop: 120,
};

export { maxWidth, verticalPadding, horizontalPadding, iconPadding, iconSize };
