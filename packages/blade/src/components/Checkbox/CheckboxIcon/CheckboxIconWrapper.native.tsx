import styled from 'styled-components/native';
import type { CheckboxRectProps } from './CheckboxIconWrapperStyles';
import { getCheckboxIconWrapperStyles } from './CheckboxIconWrapperStyles';

const CheckboxIconWrapper = styled.View<CheckboxRectProps>((props) =>
  getCheckboxIconWrapperStyles(props),
);

export { CheckboxIconWrapper };
