import React from 'react';
import { Text } from '../Typography';

const CheckboxHelpText = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  return (
    <Text contrast="low" type="muted" variant="caption">
      {children}
    </Text>
  );
};

export { CheckboxHelpText };
