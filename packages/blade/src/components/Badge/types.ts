import type { BadgeProps } from './Badge';
import type { Theme } from '~components/BladeProvider';
import type { DotNotationColorStringToken } from '~utils/types';

type BadgeBackgroundColors = `badge.background.${DotNotationColorStringToken<
  Theme['colors']['badge']['background']
>}`;

type FeedbackBackgroundColors = `feedback.background.${DotNotationColorStringToken<
  Theme['colors']['feedback']['background']
>}`;

export type StyledBadgeProps = {
  backgroundColor: FeedbackBackgroundColors | BadgeBackgroundColors;
  size: NonNullable<BadgeProps['size']>;
  theme: Theme;
};
