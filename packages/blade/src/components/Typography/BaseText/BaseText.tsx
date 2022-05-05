import type { ReactElement } from 'react';
import getIn from '../../../utils/getIn';
import { useTheme } from '../../BladeProvider';
import makeTypographySize from '../../../utils/makeTypographySize';
import type { Theme } from '../../BladeProvider';
import type { DotNotationColorStringToken } from '../../../_helpers/types';
import StyledBaseText from './StyledBaseText';

type FeedbackColors = `feedback.text.${DotNotationColorStringToken<
  Theme['colors']['feedback']['text']
>}`;
type SurfaceColors = `surface.text.${DotNotationColorStringToken<
  Theme['colors']['surface']['text']
>}`;
type ActionColors = `action.text.${DotNotationColorStringToken<Theme['colors']['action']['text']>}`;

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
  children,
}: BaseTextProps): ReactElement => {
  const { theme } = useTheme();
  const textColor = getIn(theme.colors, color);
  const themeFontfamily = theme.typography.fonts.family[fontFamily];
  const themeFontSize = makeTypographySize(theme.typography.fonts.size[fontSize]);
  const themeFontWeight = theme.typography.fonts.weight[fontWeight];
  const themeLineHeight = makeTypographySize(theme.typography.lineHeights[lineHeight]);

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
      {children}
    </StyledBaseText>
  );
};

export default BaseText;
