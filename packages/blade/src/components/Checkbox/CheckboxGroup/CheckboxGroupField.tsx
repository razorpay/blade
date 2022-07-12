import React from 'react';
import styled from 'styled-components';
import { makeAccessible } from '../../../utils';
import type { CheckboxGroupProps } from './CheckboxGroup';
import { useCheckboxGroupContext } from './CheckboxGroupContext';

type CheckboxGroupFieldProps = {
  children: React.ReactNode;
  labelledBy: string;
};

const StyledCheckboxGroupField = styled.div<Pick<CheckboxGroupProps, 'labelPosition'>>(
  ({ labelPosition }) => {
    return {
      display: 'flex',
      flexDirection: labelPosition === 'top' ? 'column' : 'row',
    };
  },
);

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
