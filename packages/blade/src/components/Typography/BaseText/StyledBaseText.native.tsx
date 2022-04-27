import styled from 'styled-components/native';
import getBaseTextStyles from './getBaseTextStyles';
import type { StyledBaseTextProps } from './StyledBaseText.d';

const ERROR_AS_PROP_NOT_SUPPORTED = `[Blade: BaseText]: "as" prop is not supported for BaseText on React Native`;

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
      throw new Error(ERROR_AS_PROP_NOT_SUPPORTED);
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
