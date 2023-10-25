import styled from 'styled-components';
import type { RadioRectProps } from './RadioIconWrapperStyles';
import { getRadioIconWrapperStyles } from './RadioIconWrapperStyles';

const RadioIconWrapper = styled.div<RadioRectProps>((props) => ({
  '&&&&&': {
    ...getRadioIconWrapperStyles(props),
  },
}));

export { RadioIconWrapper };
