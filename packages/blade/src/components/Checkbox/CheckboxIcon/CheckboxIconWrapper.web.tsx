import styled from 'styled-components';
import { getCheckboxIconWrapperStyles } from './CheckboxIconWrapperStyles';

import type { CheckboxRectProps } from './CheckboxIconWrapperStyles';

const CheckboxIconWrapper = styled.div<CheckboxRectProps>((props) =>
  getCheckboxIconWrapperStyles(props),
);

export { CheckboxIconWrapper };
