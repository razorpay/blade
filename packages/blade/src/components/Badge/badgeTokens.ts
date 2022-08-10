import type { BadgeProps } from './Badge';

type BadgeMinHeight = 20 | 24;

const minHeight: Record<NonNullable<BadgeProps['size']>, BadgeMinHeight> = {
  small: 20,
  medium: 24,
};

const maxWidth = 100;

export { minHeight, maxWidth };
