import React from 'react';
import { useCheckboxGroupContext } from './CheckboxGroupContext';
import { getPlatformType } from '~utils';
import BaseText from '~components/Typography/BaseText';

type CheckboxGroupLabelProps = {
  children: React.ReactNode;
  id: string;
};

const CheckboxGroupLabel = ({ children, id }: CheckboxGroupLabelProps): React.ReactElement => {
  const { labelPosition } = useCheckboxGroupContext();
  const isReactNative = getPlatformType() === 'react-native';

  const textNode = (
    <BaseText
      lineHeight="s"
      fontFamily="text"
      fontWeight="bold"
      color="surface.text.subtle.lowContrast"
      fontSize={75}
    >
      {children}
    </BaseText>
  );

  // What harm can it do?
  if (isReactNative) {
    return textNode;
  }

  return (
    <span style={{ width: labelPosition === 'left' ? '120px' : 'auto' }} id={id}>
      {textNode}
    </span>
  );
};

export { CheckboxGroupLabel };
