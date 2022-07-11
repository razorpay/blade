import React from 'react';
import styled from 'styled-components';
import makeSpace from '../../../utils/makeSpace';

const StyledCheckboxGroupContent = styled.div(({ theme }) => {
  return {
    display: 'flex',
    flexDirection: 'column',
    marginTop: makeSpace(theme.spacing[1]),
    gap: makeSpace(theme.spacing[1]),
  };
});

type CheckboxGroupContentProps = {
  children: React.ReactNode;
};

const CheckboxGroupContent = ({ children }: CheckboxGroupContentProps): React.ReactElement => {
  return <StyledCheckboxGroupContent>{children}</StyledCheckboxGroupContent>;
};

export { CheckboxGroupContent };
