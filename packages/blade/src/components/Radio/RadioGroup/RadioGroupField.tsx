import React from 'react';
import { useRadioGroupContext } from './RadioContext';
import { makeAccessible } from '~utils';
import BaseBox from '~components/Box/BaseBox';

type RadioGroupFieldProps = {
  children: React.ReactNode;
  labelledBy: string;
};

const RadioGroupField = ({ children, labelledBy }: RadioGroupFieldProps): React.ReactElement => {
  const { labelPosition } = useRadioGroupContext();

  return (
    <BaseBox
      display="flex"
      flexDirection={labelPosition === 'top' ? 'column' : 'row'}
      {...makeAccessible({ role: 'group', labelledBy })}
    >
      {children}
    </BaseBox>
  );
};

export { RadioGroupField };
