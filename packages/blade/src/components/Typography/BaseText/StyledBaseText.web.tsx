import styled from 'styled-components';
import getBaseTextStyles from './getBaseTextStyles';
import type { BaseTextProps } from './BaseText.d';

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
    textAlign,
  }) =>
    getBaseTextStyles({
      theme,
      color,
      fontFamily,
      fontSize,
      fontWeight,
      fontStyle,
      textDecorationLine,
      lineHeight,
      textAlign,
    }),
);

export default StyledBaseText;
