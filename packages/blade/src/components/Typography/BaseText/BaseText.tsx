import type { ReactElement } from 'react';
import getIn from '../../../utils/getIn';
import { useTheme } from '../../BladeProvider';
import isEmpty from '../../../utils/isEmpty';
import makeTypographySize from '../../../utils/makeTypographySize';
import type { ColorContrast } from '../../../tokens/theme/theme';
import type { Theme } from '../../BladeProvider';
import StyledBaseText from './StyledBaseText';

/**
 * @template TokenType token type generic
 * @description Tokenises objects to dot notation strings, eg: `surface.text.normal.lowContrast`
 */
type DotNotationStringToken<TokenType> = {
  [K in keyof TokenType]: `${Extract<K, number | string>}.${TokenType[K] extends Record<
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
  fontStyle?: 'italic' | 'normal';
  textDecorationLine?: 'line-through' | 'none';
  lineHeight: keyof Theme['typography']['lineHeights'];
  as?: 'code' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  textAlign?: 'center' | 'justify' | 'left' | 'right';
  children?: React.ReactNode | undefined;
};

export const getInvalidColorPropValueError = (color: string): string =>
  `[Blade:BaseText]: Invalid value ${color} for color prop passed`;

const BaseText = ({
  color,
  fontFamily,
  fontSize,
  fontWeight,
  fontStyle,
  textDecorationLine,
  lineHeight,
  as,
  textAlign,
  ...rest
}: BaseTextProps): ReactElement => {
  const { theme } = useTheme();
  const textColor: string = getIn(theme.colors, color, '');
  const themeFontfamily = theme.typography.fonts.family[fontFamily];
  const themeFontSize = makeTypographySize(theme.typography.fonts.size[fontSize]);
  const themeFontWeight = theme.typography.fonts.weight[fontWeight];
  const themeLineHeight = makeTypographySize(theme.typography.lineHeights[lineHeight]);

  if (isEmpty(textColor)) {
    throw new Error(getInvalidColorPropValueError(color));
  }

  return (
    <StyledBaseText
      color={textColor}
      fontFamily={themeFontfamily}
      fontSize={themeFontSize}
      fontWeight={themeFontWeight}
      fontStyle={fontStyle}
      textDecorationLine={textDecorationLine}
      lineHeight={themeLineHeight}
      as={as}
      textAlign={textAlign}
    >
      {rest.children}
    </StyledBaseText>
  );
};

export default BaseText;
