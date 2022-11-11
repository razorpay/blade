import type { BadgeProps } from './Badge';
import type { TypographyPlatforms, Typography } from '~tokens/global/typography';
import type { DotNotationSpacingStringToken } from '~src/_helpers/types';
import type { IconProps } from '~components/Icons';

type BadgeMinHeight = 16 | 20 | 24;
type BadgeMaxWidth = 100 | 120;

const minHeight: Record<NonNullable<BadgeProps['size']>, BadgeMinHeight> = {
  small: 16,
  medium: 20,
  large: 24,
};

const fontSize: Record<NonNullable<BadgeProps['size']>, keyof Typography['fonts']['size']> = {
  small: 50,
  medium: 75,
  large: 75,
};

const padding: Record<NonNullable<BadgeProps['size']>, DotNotationSpacingStringToken> = {
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

export { minHeight, maxWidth, fontSize, padding, iconPadding, iconSize };
