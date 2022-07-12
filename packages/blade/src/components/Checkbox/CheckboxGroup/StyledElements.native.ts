import styled from 'styled-components/native';
import type { CheckboxGroupProps } from './CheckboxGroup';
import { getCheckboxGroupContentStyles, getCheckboxGroupFieldStyles } from './styles';

const StyledCheckboxGroupContent = styled.View<Pick<CheckboxGroupProps, 'labelPosition'>>((props) =>
  getCheckboxGroupContentStyles(props),
);

const StyledCheckboxGroupField = styled.View<Pick<CheckboxGroupProps, 'labelPosition'>>((props) =>
  getCheckboxGroupFieldStyles(props),
);

export { StyledCheckboxGroupContent, StyledCheckboxGroupField };
