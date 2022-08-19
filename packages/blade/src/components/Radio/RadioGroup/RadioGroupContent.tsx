import React from 'react';
import { useRadioGroupContext } from './RadioContext';
import Box from '~components/Box';

type RadioGroupContentProps = {
  children: React.ReactNode;
};

const RadioGroupContent = ({ children }: RadioGroupContentProps): React.ReactElement => {
  const { labelPosition } = useRadioGroupContext();

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

export { RadioGroupContent };
