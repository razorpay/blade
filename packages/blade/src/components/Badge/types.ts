import type { BadgeProps } from './Badge';
import type { Theme } from '~components/BladeProvider';
import type { DotNotationColorStringToken } from '~utils/types';
import type { SubtleOrIntense } from '~tokens/theme/theme';

type SurfacePrimaryColors = `surface.background.primary.${SubtleOrIntense}`;

type FeedbackBackgroundColors = `feedback.background.${DotNotationColorStringToken<
  Theme['colors']['feedback']['background']
>}`;

export type StyledBadgeProps = {
  backgroundColor: FeedbackBackgroundColors | SurfacePrimaryColors;
  size: NonNullable<BadgeProps['size']>;
  theme: Theme;
};
