import type { CounterProps } from './Counter';
import type { Theme } from '~components/BladeProvider';
import type { TypographyPlatforms } from '~tokens/global';
import type { DotNotationColorStringToken } from '~src/_helpers/types';

type FeedbackBackgroundColors = `feedback.background.${DotNotationColorStringToken<
  Theme['colors']['feedback']['background']
>}`;

export type StyledCounterProps = {
  backgroundColor: FeedbackBackgroundColors;
  size: NonNullable<CounterProps['size']>;
  platform: TypographyPlatforms;
  theme: Theme;
};
