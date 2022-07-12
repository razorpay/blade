import React from 'react';
import { useCheckboxGroupContext } from './CheckboxGroupContext';
import { StyledCheckboxGroupContent } from './StyledElements';

type CheckboxGroupContentProps = {
  children: React.ReactNode;
};

const CheckboxGroupContent = ({ children }: CheckboxGroupContentProps): React.ReactElement => {
  const { labelPosition } = useCheckboxGroupContext();

  return (
    <StyledCheckboxGroupContent labelPosition={labelPosition}>
      {children}
    </StyledCheckboxGroupContent>
  );
};

export { CheckboxGroupContent };
