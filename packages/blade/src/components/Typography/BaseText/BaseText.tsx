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
export type SurfaceColors = `surface.text.${DotNotationStringToken<
  Theme['colors']['surface']['text']
>}`;
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
  truncateAfterLines?: number;
  className?: string;
  children?: React.ReactNode;
};

export const getInvalidPropValueError = ({
  propName,
  propValue,
}: {
  propName: string;
  propValue: number | string;
}): string => `[Blade:BaseText]: Invalid value ${propValue} passed for ${propName} prop`;

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
  className,
  children,
  truncateAfterLines,
}: BaseTextProps): ReactElement => {
  const { theme } = useTheme();
  const textColor = getIn(theme.colors, color, '');
  const themeFontfamily = theme.typography.fonts.family?.[fontFamily];
  const themeFontSize = theme.typography.fonts.size[fontSize]
    ? makeTypographySize(theme.typography.fonts.size[fontSize])
    : '';
  const themeFontWeight = theme.typography.fonts.weight?.[fontWeight];
  const themeLineHeight = theme.typography.lineHeights[lineHeight]
    ? makeTypographySize(theme.typography.lineHeights[lineHeight])
    : '';

  if (isEmpty(textColor)) {
    throw new Error(getInvalidPropValueError({ propName: 'color', propValue: color }));
  }

  if (isEmpty(themeFontfamily)) {
    throw new Error(getInvalidPropValueError({ propName: 'fontFamily', propValue: fontFamily }));
  }

  if (isEmpty(themeFontSize)) {
    throw new Error(getInvalidPropValueError({ propName: 'fontSize', propValue: fontSize }));
  }

  if (!themeFontWeight) {
    throw new Error(getInvalidPropValueError({ propName: 'fontWeight', propValue: fontWeight }));
  }

  if (fontStyle && !['italic', 'normal'].includes(fontStyle)) {
    throw new Error(getInvalidPropValueError({ propName: 'fontStyle', propValue: fontStyle }));
  }

  if (textDecorationLine && !['line-through', 'none'].includes(textDecorationLine)) {
    throw new Error(
      getInvalidPropValueError({ propName: 'textDecorationLine', propValue: textDecorationLine }),
    );
  }

  if (isEmpty(themeLineHeight)) {
    throw new Error(getInvalidPropValueError({ propName: 'lineHeight', propValue: lineHeight }));
  }

  if (as && !['code', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span'].includes(as)) {
    throw new Error(getInvalidPropValueError({ propName: 'as', propValue: as }));
  }

  if (textAlign && !['center', 'justify', 'left', 'right'].includes(textAlign)) {
    throw new Error(getInvalidPropValueError({ propName: 'textAlign', propValue: textAlign }));
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
      numberOfLines={truncateAfterLines}
      className={className}
    >
      {children}
    </StyledBaseText>
  );
};

export default BaseText;
