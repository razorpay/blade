import type { ReactElement } from 'react';
import getIn from '../../../utils/getIn';
import { useTheme } from '../../BladeProvider';
import isEmpty from '../../../utils/isEmpty';
import StyledBaseText from './StyledBaseText';
import type { BaseTextProps } from './BaseText.d';

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
 *  'auto', 'left', 'right', 'center', 'justify'
 *  left|right|center|justify|initial|inherit;
 */

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
  textAlign,
}: BaseTextProps): ReactElement => {
  const { theme } = useTheme();
  const textColor = getIn(theme.colors, color);

  if (isEmpty(textColor)) {
    throw new Error(
      // @todo: generate the error message with valid values
      `[Blade:BaseText]: Invalid color value ${color} passed`,
    );
  }

  return (
    <StyledBaseText
      data-blade-component={name}
      theme={theme}
      color={textColor}
      fontFamily={fontFamily}
      fontSize={fontSize}
      fontWeight={fontWeight}
      fontStyle={fontStyle}
      textDecorationLine={textDecorationLine}
      lineHeight={lineHeight}
      as={as}
      textAlign={textAlign}
    >
      {children}
    </StyledBaseText>
  );
};

export default BaseText;
