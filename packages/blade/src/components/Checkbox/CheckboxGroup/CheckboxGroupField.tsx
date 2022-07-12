import React from 'react';
import { makeAccessible } from '../../../utils';
import { useCheckboxGroupContext } from './CheckboxGroupContext';
import { StyledCheckboxGroupField } from './StyledElements';

type CheckboxGroupFieldProps = {
  children: React.ReactNode;
  labelledBy: string;
};

const CheckboxGroupField = ({
  children,
  labelledBy,
}: CheckboxGroupFieldProps): React.ReactElement => {
  const { labelPosition } = useCheckboxGroupContext();

  return (
    <StyledCheckboxGroupField
      labelPosition={labelPosition}
      {...makeAccessible({ role: 'group', labelledBy })}
    >
      {children}
    </StyledCheckboxGroupField>
  );
};

export { CheckboxGroupField };
