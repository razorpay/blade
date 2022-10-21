import type { BadgeProps } from './Badge';
import type { Theme } from '~components/BladeProvider';
import type { TypographyPlatforms } from '~tokens/global/typography';
import type { DotNotationColorStringToken } from '~src/_helpers/types';

type BadgeBackgroundColors = `badge.background.${DotNotationColorStringToken<
  Theme['colors']['badge']['background']
>}`;

type FeedbackBackgroundColors = `feedback.background.${DotNotationColorStringToken<
  Theme['colors']['feedback']['background']
>}`;

export type StyledBadgeProps = {
  backgroundColor: FeedbackBackgroundColors | BadgeBackgroundColors;
  size: NonNullable<BadgeProps['size']>;
  platform: TypographyPlatforms;
  theme: Theme;
};
