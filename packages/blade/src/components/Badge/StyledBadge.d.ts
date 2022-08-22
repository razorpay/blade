import type { BadgeProps } from './Badge';
import type { Theme } from '~components/BladeProvider';
import type { TypographyPlatforms } from '~tokens/global/typography';

export type StyledBadgeProps = {
  backgroundColor: string;
  borderColor: string;
  size: NonNullable<BadgeProps['size']>;
  platform: TypographyPlatforms;
  theme: Theme;
};

export * from './StyledBadge.web';
