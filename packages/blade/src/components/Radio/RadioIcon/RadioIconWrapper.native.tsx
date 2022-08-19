import styled from 'styled-components/native';
import type { RadioRectProps } from './RadioIconWrapperStyles';
import { getRadioIconWrapperStyles } from './RadioIconWrapperStyles';

const RadioIconWrapper = styled.View<RadioRectProps>((props) => getRadioIconWrapperStyles(props));

export { RadioIconWrapper };
