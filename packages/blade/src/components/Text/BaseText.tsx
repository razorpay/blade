import { ReactNode, ReactElement } from 'react';
import styled from 'styled-components';
import { ColorContrast } from '../../tokens/theme/theme';
import getIn from '../../utils/getIn';
import { useTheme } from '../BladeProvider';
import type { Theme } from '../BladeProvider';
import isEmpty from '../../utils/isEmpty';

/**
 * - type of typography text to be the value of text/code - done
 * - create types for BaseText - done
 * - make autocomplete work with TS - done
 * - write helper to resolve color - done
 * - filter unwanted dom attrs - done
 * - create function to add data-* elements - deferred
 * - write helper to resolve text - deferred
 * - Organise the storybook
 * - write text component for React native
 */

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
  as: 'code' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  name?: string;
  children?: ReactNode;
};

const StyledBaseText = styled.div<BaseTextProps>(
  ({
    theme,
    color,
    fontFamily,
    fontSize,
    fontWeight,
    fontStyle,
    textDecorationLine,
    lineHeight,
  }) => `
  color: ${color};
  font-family: ${theme.typography.fonts.family[fontFamily]};
  font-size: ${theme.typography.fonts.size[fontSize]}rem;
  font-weight: ${theme.typography.fonts.weight[fontWeight]};
  font-style: ${fontStyle};
  text-decoration-line: ${textDecorationLine};
  line-height: ${lineHeight};
`,
);

const BaseText = ({
  color,
  fontFamily,
  fontSize,
  fontWeight,
  fontStyle,
  textDecorationLine,
  lineHeight,
  as,
  name,
  children,
}: BaseTextProps): ReactElement => {
  const { theme: bladeTheme } = useTheme();
  const textColor = getIn(bladeTheme.colors, color);

  if (isEmpty(textColor)) {
    throw new Error(
      // @todo: generate the error message with valid values
      `[Blade:BaseText]: Invalid color prop ${color} passed, expected value to be one of theme color value from surface.text, feedback.text or action.text`,
    );
  }

  return (
    <StyledBaseText
      data-blade-component={name}
      theme={bladeTheme}
      color={textColor}
      fontFamily={fontFamily}
      fontSize={fontSize}
      fontWeight={fontWeight}
      fontStyle={fontStyle}
      textDecorationLine={textDecorationLine}
      lineHeight={lineHeight}
      as={as}
    >
      {children}
    </StyledBaseText>
  );
};

export default BaseText;
