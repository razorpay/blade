import type { AmountProps } from './Amount';
import type { Theme } from '~components/BladeProvider';
import type { DotNotationColorStringToken } from '~src/_helpers/types';

type AmountBackgroundColors = `Amount.background.${DotNotationColorStringToken<
  Theme['colors']['Amount']['background']
>}`;

type FeedbackBackgroundColors = `feedback.background.${DotNotationColorStringToken<
  Theme['colors']['feedback']['background']
>}`;

export type StyledAmountProps = {
  backgroundColor: FeedbackBackgroundColors | AmountBackgroundColors;
  size: NonNullable<AmountProps['size']>;
  theme: Theme;
};
