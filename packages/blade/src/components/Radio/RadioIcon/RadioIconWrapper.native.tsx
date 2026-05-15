import styled from 'styled-components/native';
import { getRadioIconWrapperStyles } from './RadioIconWrapperStyles';

import type { RadioRectProps } from './RadioIconWrapperStyles';

const RadioIconWrapper = styled.View<RadioRectProps>((props) => getRadioIconWrapperStyles(props));

export { RadioIconWrapper };
