import React from 'react';
import { Text } from '../../Typography';

type CheckboxGroupHelpTextProps = {
  children: React.ReactNode;
};

const CheckboxGroupHelpText = ({ children }: CheckboxGroupHelpTextProps): React.ReactElement => {
  return (
    <Text contrast="low" type="muted" variant="caption">
      {children}
    </Text>
  );
};

export { CheckboxGroupHelpText };
