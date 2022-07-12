import React from 'react';
import BaseText from '../../Typography/BaseText';
import { useCheckboxGroupContext } from './CheckboxGroupContext';

type CheckboxGroupLabelProps = {
  children: React.ReactNode;
  id: string;
};

const CheckboxGroupLabel = ({ children, id }: CheckboxGroupLabelProps): React.ReactElement => {
  const { labelPosition } = useCheckboxGroupContext();

  return (
    <span style={{ width: labelPosition === 'left' ? '120px' : 'auto' }} id={id}>
      <BaseText
        lineHeight="s"
        fontFamily="text"
        fontWeight="bold"
        color="surface.text.subtle.lowContrast"
        fontSize={75}
      >
        {children}
      </BaseText>
    </span>
  );
};

export { CheckboxGroupLabel };
