import getIn from 'lodash/get';
import type { CSSObject } from 'styled-components';
import type { StyledBaseTextProps } from './types';
import { makeTypographySize } from '~utils/makeTypographySize';
import { isReactNative } from '~utils';

const getBaseTextStyles = ({
  color = 'surface.text.normal.lowContrast',
  fontFamily = 'text',
  fontSize = 200,
  fontWeight = 'regular',
  fontStyle = 'normal',
  textDecorationLine = 'none',
  numberOfLines,
  wordBreak,
  lineHeight = 100,
  textAlign,
  theme,
}: StyledBaseTextProps): CSSObject => {
  const textColor = getIn(theme.colors, color);
  const themeFontFamily = theme.typography.fonts.family[fontFamily];
  const themeFontSize = makeTypographySize(theme.typography.fonts.size[fontSize]);
  const themeFontWeight = theme.typography.fonts.weight[fontWeight];
  const themeLineHeight = makeTypographySize(theme.typography.lineHeights[lineHeight]);
  let truncateStyles: CSSObject = {};
  let wordBreakStyles: CSSObject = {};
  if (numberOfLines !== undefined) {
    if (isReactNative()) {
      truncateStyles = {};
    } else {
      truncateStyles = {
        overflow: 'hidden',
        display: '-webkit-box',
        'line-clamp': `${numberOfLines}`,
        '-webkit-line-clamp': `${numberOfLines}`,
        '-webkit-box-orient': 'vertical',
      };
    }
  }
  if (wordBreak !== undefined) {
    if (isReactNative()) {
      wordBreakStyles = {};
    } else {
      wordBreakStyles = {
        wordBreak,
      };
    }
  }

  return {
    color: textColor,
    fontFamily: themeFontFamily,
    fontSize: themeFontSize,
    fontWeight: themeFontWeight,
    fontStyle,
    textDecorationLine,
    ...(textDecorationLine !== 'none' && {
      textDecorationColor: textColor,
    }),
    lineHeight: themeLineHeight,
    textAlign,
    margin: 0,
    padding: 0,
    ...truncateStyles,
    ...wordBreakStyles,
  };
};

export default getBaseTextStyles;
