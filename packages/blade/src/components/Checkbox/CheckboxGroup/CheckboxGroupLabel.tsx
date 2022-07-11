import React from 'react';
import BaseText from '../../Typography/BaseText';

type CheckboxGroupLabelProps = {
  children: React.ReactNode;
  id: string;
};

const CheckboxGroupLabel = ({ children, id }: CheckboxGroupLabelProps): React.ReactElement => {
  return (
    <span id={id}>
      <BaseText
        lineHeight="s"
        fontFamily="text"
        fontWeight="bold"
        color="surface.text.subtle.lowContrast"
        fontSize={50}
      >
        {children}
      </BaseText>
    </span>
  );
};

export { CheckboxGroupLabel };
