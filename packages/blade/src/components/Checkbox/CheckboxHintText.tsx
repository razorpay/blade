import React from 'react';
import BaseText from '../Typography/BaseText';
import { getPlatformType } from '~utils';

type CheckboxHintText = {
  id?: string;
  children: React.ReactNode;
  variant: 'help' | 'error';
};

const CheckboxHintText = ({ children, variant, id }: CheckboxHintText): React.ReactElement => {
  const isReactNative = getPlatformType() === 'react-native';

  return (
    <BaseText
      id={id}
      as={isReactNative ? undefined : 'span'}
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

export { CheckboxHintText };
