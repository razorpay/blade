import type { CounterProps } from './Counter';
import type { Theme } from '~components/BladeProvider';
import type { TypographyPlatforms } from '~tokens/global';
import type { DotNotationColorStringToken } from '~utils/types';
import type { SubtleOrIntense } from '~tokens/theme/theme';

type FeedbackBackgroundColors = `feedback.background.${DotNotationColorStringToken<
  Theme['colors']['feedback']['background']
>}`;

type SurfacePrimaryColors = `surface.background.primary.${SubtleOrIntense}`;

export type StyledCounterProps = {
  backgroundColor: FeedbackBackgroundColors | SurfacePrimaryColors;
  size: NonNullable<CounterProps['size']>;
  platform: TypographyPlatforms;
  theme: Theme;
};
