import React from 'react';
import { useCheckboxGroupContext } from './CheckboxGroupContext';
import Box from '~components/Box';

type CheckboxGroupContentProps = {
  children: React.ReactNode;
};

const CheckboxGroupContent = ({ children }: CheckboxGroupContentProps): React.ReactElement => {
  const { labelPosition } = useCheckboxGroupContext();

  return (
    <Box
      display="flex"
      flexDirection="column"
      marginTop={labelPosition === 'top' ? 'spacing.1' : 'auto'}
      marginBottom="spacing.1"
      gap="spacing.1"
    >
      {children}
    </Box>
  );
};

export { CheckboxGroupContent };
