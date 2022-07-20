import type { ReactElement } from 'react';
import getIn from '../../../utils/getIn';
import { useTheme } from '../../BladeProvider';
import makeTypographySize from '../../../utils/makeTypographySize';
import type { Theme } from '../../BladeProvider';
import type { DotNotationColorStringToken } from '../../../_helpers/types';
import type { Feedback } from '../../../tokens/theme/theme.d';
import type { AccessibilityProps } from '../../../utils/makeAccessible';
import makeAccessible from '../../../utils/makeAccessible';
import StyledBaseText from './StyledBaseText';

type FeedbackColors = `feedback.text.${DotNotationColorStringToken<
  Theme['colors']['feedback']['text']
>}`;
type FeedbackActionColors = `feedback.${Feedback}.action.text.${DotNotationColorStringToken<
  Theme['colors']['feedback'][Feedback]['action']['text']
>}`;
type SurfaceColors = `surface.text.${DotNotationColorStringToken<
  Theme['colors']['surface']['text']
>}`;
type ActionColors = `action.text.${DotNotationColorStringToken<Theme['colors']['action']['text']>}`;

export type BaseTextProps = {
  id?: string;
  color?: ActionColors | FeedbackColors | SurfaceColors | FeedbackActionColors;
  fontFamily?: keyof Theme['typography']['fonts']['family'];
  fontSize?: keyof Theme['typography']['fonts']['size'];
  fontWeight?: keyof Theme['typography']['fonts']['weight'];
  fontStyle?: 'italic' | 'normal';
  textDecorationLine?: 'line-through' | 'none';
  lineHeight?: keyof Theme['typography']['lineHeights'];
  as?: 'code' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  textAlign?: 'center' | 'justify' | 'left' | 'right';
  truncateAfterLines?: number;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  accessibilityProps?: Partial<AccessibilityProps>;
};

const BaseText = ({
  id,
  color = 'surface.text.normal.lowContrast',
  fontFamily = 'text',
  fontSize = 200,
  fontWeight = 'regular',
  fontStyle = 'normal',
  textDecorationLine = 'none',
  lineHeight = 'l',
  as,
  textAlign = 'left',
  children,
  truncateAfterLines,
  className,
  style,
  accessibilityProps = {},
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
      numberOfLines={truncateAfterLines}
      className={className}
      style={style}
      id={id}
      {...makeAccessible(accessibilityProps)}
    >
      {children}
    </StyledBaseText>
  );
};

export default BaseText;
