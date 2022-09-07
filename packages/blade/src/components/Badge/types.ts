import type { BadgeProps } from './Badge';
import type { Theme } from '~components/BladeProvider';
import type { TypographyPlatforms } from '~tokens/global/typography';
import type { DotNotationColorStringToken } from '~src/_helpers/types';

type BadgeBackgroundColors = `badge.background.${DotNotationColorStringToken<
  Theme['colors']['badge']['background']
>}`;
type BadgeBorderColors = `badge.border.${DotNotationColorStringToken<
  Theme['colors']['badge']['border']
>}`;

type FeedbackBackgroundColors = `feedback.background.${DotNotationColorStringToken<
  Theme['colors']['feedback']['background']
>}`;
type FeedbackBorderColors = `feedback.border.${DotNotationColorStringToken<
  Theme['colors']['feedback']['border']
>}`;

export type StyledBadgeProps = {
  backgroundColor: FeedbackBackgroundColors | BadgeBackgroundColors;
  borderColor: FeedbackBorderColors | BadgeBorderColors;
  size: NonNullable<BadgeProps['size']>;
  platform: TypographyPlatforms;
  theme: Theme;
};
