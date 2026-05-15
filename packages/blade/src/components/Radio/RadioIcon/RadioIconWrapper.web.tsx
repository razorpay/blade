import styled from 'styled-components';
import { getRadioIconWrapperStyles } from './RadioIconWrapperStyles';

import type { RadioRectProps } from './RadioIconWrapperStyles';

const RadioIconWrapper = styled.div<RadioRectProps>((props) => getRadioIconWrapperStyles(props));

export { RadioIconWrapper };
