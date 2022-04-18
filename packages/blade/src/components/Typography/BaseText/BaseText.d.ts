import type { ReactNode } from 'react';
import type { ColorContrast } from '../../../tokens/theme/theme';
import type { Theme } from '../../BladeProvider';

type DotNotationStringToken<TokenType> = {
  [K in keyof TokenType]: `${K & string}.${TokenType[K] extends Record<
    string,
    ColorContrast | string
  >
    ? Extract<keyof TokenType[K], number | string>
    : DotNotationStringToken<TokenType[K]>}`;
}[keyof TokenType];

type FeedbackColors = `feedback.text.${DotNotationStringToken<
  Theme['colors']['feedback']['text']
>}`;
type SurfaceColors = `surface.text.${DotNotationStringToken<Theme['colors']['surface']['text']>}`;
type ActionColors = `action.text.${DotNotationStringToken<Theme['colors']['action']['text']>}`;

export type BaseTextProps = {
  color: ActionColors | FeedbackColors | SurfaceColors;
  fontFamily: keyof Theme['typography']['fonts']['family'];
  fontSize: keyof Theme['typography']['fonts']['size'];
  fontWeight: keyof Theme['typography']['fonts']['weight'];
  fontStyle: 'italic' | 'normal';
  textDecorationLine: 'line-through' | 'none';
  lineHeight: keyof Theme['typography']['lineHeights'];
  as?: 'code' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  textAlign?: 'center' | 'justify' | 'left' | 'right';
  name?: string;
  children?: ReactNode;
  theme: Theme;
};
