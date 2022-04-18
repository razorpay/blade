import styled from 'styled-components/native';
import getBaseTextStyles from './getBaseTextStyles';
import type { BaseTextProps } from './BaseText.d';

const StyledBaseText = styled.Text<BaseTextProps>(
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
