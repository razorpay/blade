import React from 'react';
import BaseText from '../../Typography/BaseText';
import { getPlatformType } from '~utils';

type CheckboxGroupHintTextProps = {
  children: React.ReactNode;
  variant: 'help' | 'error';
};

const CheckboxGroupHintText = ({
  children,
  variant,
}: CheckboxGroupHintTextProps): React.ReactElement => {
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

export { CheckboxGroupHintText };
