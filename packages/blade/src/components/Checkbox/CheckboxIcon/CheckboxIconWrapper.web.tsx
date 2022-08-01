import styled from 'styled-components';
import type { CheckboxRectProps } from './CheckboxIconWrapperStyles';
import { getCheckboxIconWrapperStyles } from './CheckboxIconWrapperStyles';

const CheckboxIconWrapper = styled.div<CheckboxRectProps>((props) =>
  getCheckboxIconWrapperStyles(props),
);

export { CheckboxIconWrapper };
