import styled from 'styled-components';
import getBaseTextStyles from './getBaseTextStyles';
import type { StyledBaseTextProps } from './StyledBaseText.d';

const StyledBaseText = styled.div<StyledBaseTextProps>(
  ({
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
