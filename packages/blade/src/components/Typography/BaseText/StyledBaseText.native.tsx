import styled from 'styled-components/native';
import getBaseTextStyles from './getBaseTextStyles';
import type { StyledBaseTextProps } from './StyledBaseText.d';

const StyledBaseText = styled.Text<StyledBaseTextProps>(
  ({
    color,
    fontFamily,
    fontSize,
    fontWeight,
    fontStyle,
    textDecorationLine,
    lineHeight,
    textAlign,
    as,
  }) => {
    if (as) {
      throw new Error(`[Blade: BaseText]: "as" prop is not supported for BaseText on React Native`);
    } else {
      return getBaseTextStyles({
        color,
        fontFamily,
        fontSize,
        fontWeight,
        fontStyle,
        textDecorationLine,
        lineHeight,
        textAlign,
      });
    }
  },
);

export default StyledBaseText;
