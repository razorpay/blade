import React from 'react';
import { useCheckboxGroupContext } from './CheckboxGroupContext';
import { makeAccessible } from '~utils';
import Box from '~components/Box';

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
    <Box
      display="flex"
      flexDirection={labelPosition === 'top' ? 'column' : 'row'}
      {...makeAccessible({ role: 'group', labelledBy })}
    >
      {children}
    </Box>
  );
};

export { CheckboxGroupField };
