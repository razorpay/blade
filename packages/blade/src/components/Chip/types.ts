import type { ChipProps } from './Chip';
import type { Theme } from '~components/BladeProvider';
import type { DotNotationColorStringToken } from '~utils/types';

type FeedbackBackgroundColors = `feedback.background.${DotNotationColorStringToken<
  Theme['colors']['feedback']['background']
>}`;

export type AnimatedChipProps = {
  backgroundColor: FeedbackBackgroundColors;
  size: NonNullable<ChipProps['size']>;
  isChecked?: boolean;
  isPressed?: boolean;
  isDisabled?: boolean;
  withIcon?: boolean;
  borderColor: `colors.${DotNotationColorStringToken<Theme['colors']>}`;
  theme: Theme;
  children: React.ReactNode;
};
