import React from 'react';
import BaseText from '../Typography/BaseText';

const CheckboxHelpText = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  return (
    <BaseText
      color="surface.text.subtle.lowContrast"
      fontSize={50}
      lineHeight="s"
      fontStyle="italic"
      fontFamily="text"
    >
      {children}
    </BaseText>
  );
};

export { CheckboxHelpText };
