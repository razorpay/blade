import type { ChipGroupProps } from './ChipGroup';
import type { Theme } from '~components/BladeProvider';
import type { DotNotationColorStringToken } from '~utils/types';

type FeedbackBackgroundColors = `feedback.background.${DotNotationColorStringToken<
  Theme['colors']['feedback']['background']
>}`;

export type AnimatedChipProps = {
  backgroundColor: FeedbackBackgroundColors;
  size: NonNullable<ChipGroupProps['size']>;
  isChecked?: boolean;
  isPressed?: boolean;
  isDisabled?: boolean;
  withIcon?: boolean;
  isDesktop?: boolean;
  borderColor: `colors.${DotNotationColorStringToken<Theme['colors']>}`;
  theme: Theme;
  children: React.ReactNode;
};
