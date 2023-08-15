import type { ChipProps } from './Chip';
import type { Theme } from '~components/BladeProvider';
import type { DotNotationColorStringToken } from '~utils/types';

type FeedbackBackgroundColors = `feedback.background.${DotNotationColorStringToken<
  Theme['colors']['feedback']['background']
>}`;

export type StyledChipProps = {
  backgroundColor: FeedbackBackgroundColors;
  size: NonNullable<ChipProps['size']>;
  borderColor: `colors.${DotNotationColorStringToken<Theme['colors']>}`;
  theme: Theme;
};
