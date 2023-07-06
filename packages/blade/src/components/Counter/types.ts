import type { CounterProps } from './Counter';
import type { Theme } from '~components/BladeProvider';
import type { TypographyPlatforms } from '~tokens/global';
import type { DotNotationColorStringToken } from '~utils/types';

type FeedbackBackgroundColors = `feedback.background.${DotNotationColorStringToken<
  Theme['colors']['feedback']['background']
>}`;

type BadgeBackgroundColors = `badge.background.${DotNotationColorStringToken<
  Theme['colors']['badge']['background']
>}`;

export type StyledCounterProps = {
  backgroundColor: FeedbackBackgroundColors | BadgeBackgroundColors;
  size: NonNullable<CounterProps['size']>;
  platform: TypographyPlatforms;
  theme: Theme;
};
