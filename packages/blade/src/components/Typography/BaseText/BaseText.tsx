import type { ReactElement } from 'react';
import getIn from '../../../utils/getIn';
import { useTheme } from '../../BladeProvider';
import isEmpty from '../../../utils/isEmpty';
import StyledBaseText from './StyledBaseText';
import type { BaseTextProps } from './BaseText.d';

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
  const textColor = getIn(theme.colors, color);

  if (isEmpty(textColor)) {
    throw new Error(`[Blade:BaseText]: Invalid value ${color} for color prop passed`);
  }

  return (
    <StyledBaseText
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
      {rest.children}
    </StyledBaseText>
  );
};

export default BaseText;
