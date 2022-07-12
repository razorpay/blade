import React from 'react';
import BaseText from '../../Typography/BaseText';

type CheckboxGroupHintTextProps = {
  children: React.ReactNode;
  variant: 'help' | 'error';
};

const CheckboxGroupHintText = ({
  children,
  variant,
}: CheckboxGroupHintTextProps): React.ReactElement => {
  return (
    <BaseText
      color={
        variant === 'error'
          ? 'feedback.text.negative.lowContrast'
          : 'surface.text.subtle.lowContrast'
      }
      fontSize={50}
      lineHeight="s"
      fontStyle="italic"
      fontFamily="text"
    >
      {children}
    </BaseText>
  );
};

export { CheckboxGroupHintText };
