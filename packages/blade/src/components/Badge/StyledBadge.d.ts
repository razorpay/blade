import type { BadgeProps } from './Badge';
import type { Theme } from '~components/BladeProvider';

export type StyledBadgeProps = {
  variant: NonNullable<BadgeProps['variant']>;
  contrast: NonNullable<BadgeProps['contrast']>;
  size: NonNullable<BadgeProps['size']>;
  theme: Theme;
};

export * from './StyledBadge.web';
