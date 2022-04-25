import type { Theme } from '../BladeProvider';
import type { ColorContrast } from '../../tokens/theme/theme';

export { default as CreditCardIcon } from './CreditCardIcon';

export type IconSize = 'large' | 'medium' | 'small' | 'xlarge' | 'xsmall' | 'xxsmall';

type DotNotationStringToken<TokenType> = {
  [K in keyof TokenType]: `${Extract<K, number | string>}.${TokenType[K] extends Record<
    string,
    ColorContrast | string
  >
    ? Extract<keyof TokenType[K], number | string>
    : DotNotationStringToken<TokenType[K]>}`;
}[keyof TokenType];

type FeedbackColors = `feedback.icon.${DotNotationStringToken<
  Theme['colors']['feedback']['icon']
>}`;
type SurfaceColors = `surface.icon.${DotNotationStringToken<
  Theme['colors']['surface']['action']['icon']
>}`;
type ActionColors = `action.icon.${DotNotationStringToken<Theme['colors']['action']['icon']>}`;

export type IconProps = {
  color: ActionColors | FeedbackColors | SurfaceColors;
  size: IconSize;
};
