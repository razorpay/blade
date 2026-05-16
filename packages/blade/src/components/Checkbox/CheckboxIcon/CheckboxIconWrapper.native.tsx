import styled from 'styled-components/native';
import { getCheckboxIconWrapperStyles } from './CheckboxIconWrapperStyles';

import type { CheckboxRectProps } from './CheckboxIconWrapperStyles';

const CheckboxIconWrapper = styled.View<CheckboxRectProps>((props) =>
  getCheckboxIconWrapperStyles(props),
);

export { CheckboxIconWrapper };
