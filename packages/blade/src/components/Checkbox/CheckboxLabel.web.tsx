import React from 'react';
import styled from 'styled-components';
import type { CheckboxLabelProps } from './CheckboxLabel.d';

const StyledCheckboxLabel = styled.label({
  display: 'flex',
});

const CheckboxLabel = ({ children }: CheckboxLabelProps): React.ReactElement => {
  return <StyledCheckboxLabel>{children}</StyledCheckboxLabel>;
};

export { CheckboxLabel };
