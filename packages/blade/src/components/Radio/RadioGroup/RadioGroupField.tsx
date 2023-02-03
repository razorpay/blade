import React from 'react';
import { useRadioGroupContext } from './RadioContext';
import { makeAccessible } from '~utils';
import Box from '~components/Box/BaseBox';

type RadioGroupFieldProps = {
  children: React.ReactNode;
  labelledBy: string;
};

const RadioGroupField = ({ children, labelledBy }: RadioGroupFieldProps): React.ReactElement => {
  const { labelPosition } = useRadioGroupContext();

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

export { RadioGroupField };
