import React from 'react';
import { useCheckboxGroupContext } from './CheckboxGroupContext';
import { StyledCheckboxGroupField } from './StyledElements';
import { makeAccessible } from '~utils';

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
