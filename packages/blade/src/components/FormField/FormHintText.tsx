/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable react/display-name */
import React from 'react';
import { CheckIcon, InfoIcon } from '..';
import { FormHintTextWrapper } from './FormHintTextWrapper';
import BaseText from '~components/Typography/BaseText';
import { getPlatformType } from '~utils';
import Box from '~components/Box';

type FormHintTextProps = {
  id?: string;
  children: React.ReactNode;
  variant: 'help' | 'error' | 'success';
};

const FormHintText = ({
  id,
  children,
  variant = 'help',
}: FormHintTextProps): React.ReactElement => {
  const isReactNative = getPlatformType() === 'react-native';

  const colors = {
    help: 'surface.text.subtle.lowContrast',
    error: 'feedback.text.negative.lowContrast',
    success: 'feedback.text.positive.lowContrast',
  } as const;

  const Icons = {
    help: () => null,
    error: () => (
      <>
        <InfoIcon color="feedback.icon.negative.lowContrast" size="xsmall" />
        <Box marginRight="spacing.1" />
      </>
    ),
    success: () => (
      <>
        <CheckIcon color="feedback.icon.positive.lowContrast" size="xsmall" />
        <Box marginRight="spacing.1" />
      </>
    ),
  };
  const Icon = Icons[variant];

  return (
    <FormHintTextWrapper>
      <Icon />
      <BaseText
        id={id}
        as={isReactNative ? undefined : 'span'}
        color={colors[variant]}
        fontSize={50}
        lineHeight="s"
        fontStyle="italic"
        fontFamily="text"
      >
        {children}
      </BaseText>
    </FormHintTextWrapper>
  );
};

export { FormHintText };
