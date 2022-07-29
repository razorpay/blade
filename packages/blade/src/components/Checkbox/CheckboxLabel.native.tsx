import React from 'react';
import styled from 'styled-components/native';
import type { CheckboxLabelProps } from './CheckboxLabel';

const StyledCheckboxLabel = styled.Pressable({
  display: 'flex',
  flexDirection: 'row',
});

const CheckboxLabel = ({ children, inputProps }: CheckboxLabelProps): React.ReactElement => {
  return <StyledCheckboxLabel {...inputProps}>{children}</StyledCheckboxLabel>;
};

export { CheckboxLabel };
