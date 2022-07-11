import React from 'react';
import { makeAccessible } from '../../../utils';

type CheckboxGroupFieldProps = {
  children: React.ReactNode;
  labelledBy: string;
};

const CheckboxGroupField = ({
  children,
  labelledBy,
}: CheckboxGroupFieldProps): React.ReactElement => {
  return <div {...makeAccessible({ role: 'group', labelledBy })}>{children}</div>;
};

export { CheckboxGroupField };
