import type { BadgeProps } from './Badge';
import type { TypographyPlatforms } from '~tokens/global/typography';

type BadgeMinHeight = 20 | 24;
type BadgeMaxWidth = 100 | 120;

const minHeight: Record<NonNullable<BadgeProps['size']>, BadgeMinHeight> = {
  small: 20,
  medium: 24,
};

const maxWidth: Record<NonNullable<TypographyPlatforms>, BadgeMaxWidth> = {
  onMobile: 100,
  onDesktop: 120,
};

export { minHeight, maxWidth };
