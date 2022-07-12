import styled from 'styled-components';
import type { CheckboxGroupProps } from './CheckboxGroup';
import { getCheckboxGroupContentStyles, getCheckboxGroupFieldStyles } from './styles';

const StyledCheckboxGroupContent = styled.div<Pick<CheckboxGroupProps, 'labelPosition'>>((props) =>
  getCheckboxGroupContentStyles(props),
);

const StyledCheckboxGroupField = styled.div<Pick<CheckboxGroupProps, 'labelPosition'>>((props) =>
  getCheckboxGroupFieldStyles(props),
);

export { StyledCheckboxGroupContent, StyledCheckboxGroupField };
