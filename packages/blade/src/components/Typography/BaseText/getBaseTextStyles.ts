import type { CSSObject } from 'styled-components';
import type { StyledBaseTextProps } from './types';
import getIn from '~utils/lodashButBetter/get';
import { makeTypographySize } from '~utils/makeTypographySize';
import { isReactNative } from '~utils';
import { makeLetterSpacing } from '~utils/makeLetterSpacing';

const getBaseTextStyles = ({
  color = 'surface.text.gray.normal',
  fontFamily = 'text',
  fontSize = 200,
  fontWeight = 'regular',
  fontStyle = 'normal',
  textDecorationLine = 'none',
  numberOfLines,
  wordBreak,
  lineHeight = 100,
  letterSpacing = 100,
  textAlign,
  opacity,
  theme,
}: StyledBaseTextProps): CSSObject => {
  const textColor = color === 'currentColor' ? 'currentColor' : getIn(theme.colors, color);
  const themeFontFamily = theme.typography.fonts.family[fontFamily];
  const themeFontSize = makeTypographySize(theme.typography.fonts.size[fontSize]);
  const themeFontWeight = theme.typography.fonts.weight[fontWeight];
  const themeLineHeight = makeTypographySize(theme.typography.lineHeights[lineHeight]);
  const themeLetterSpacing = makeLetterSpacing(
    theme.typography.letterSpacings[letterSpacing],
    theme.typography.fonts.size[fontSize],
  );
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
        overflowWrap: 'break-word',
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
    letterSpacing: themeLetterSpacing,
    textAlign,
    margin: 0,
    padding: 0,
    opacity,
    ...truncateStyles,
    ...wordBreakStyles,
  };
};

export default getBaseTextStyles;
