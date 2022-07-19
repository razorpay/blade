import React from 'react';
import getPlatformType from '../../utils/getPlatformType';
import BaseText from '../Typography/BaseText';

type CheckboxHintText = {
  children: React.ReactNode;
  variant: 'help' | 'error';
};

const CheckboxHintText = ({ children, variant }: CheckboxHintText): React.ReactElement => {
  const isReactNative = getPlatformType() === 'react-native';

  return (
    <BaseText
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
