import type { CSSObject } from 'styled-components';
import type { StyledBaseTextProps } from './types';
import { getIn, makeTypographySize } from '~utils';

const getBaseTextStyles = ({
  color = 'surface.text.normal.lowContrast',
  fontFamily = 'text',
  fontSize = 200,
  fontWeight = 'regular',
  fontStyle = 'normal',
  textDecorationLine = 'none',
  lineHeight = 100,
  textAlign,
  theme,
}: StyledBaseTextProps): CSSObject => {
  const textColor = getIn(theme.colors, color);
  const themeFontFamily = theme.typography.fonts.family[fontFamily];
  const themeFontSize = makeTypographySize(theme.typography.fonts.size[fontSize]);
  const themeFontWeight = theme.typography.fonts.weight[fontWeight];
  const themeLineHeight = makeTypographySize(theme.typography.lineHeights[lineHeight]);

  return {
    color: textColor,
    fontFamily: themeFontFamily,
    fontSize: themeFontSize,
    fontWeight: themeFontWeight,
    fontStyle,
    textDecorationLine,
    lineHeight: themeLineHeight,
    textAlign,
    margin: 0,
    padding: 0,
  };
};

export default getBaseTextStyles;
