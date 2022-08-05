import type { BadgeProps } from './Badge';
import type { BaseTextProps } from '~components/Typography/BaseText';

const textSize: Record<NonNullable<BadgeProps['size']>, BaseTextProps['fontSize']> = {
  small: 25,
  medium: 100,
};

type BadgeMinHeight = 20 | 24;

const minHeight: Record<NonNullable<BadgeProps['size']>, BadgeMinHeight> = {
  small: 20,
  medium: 24,
};

export { textSize, minHeight };
