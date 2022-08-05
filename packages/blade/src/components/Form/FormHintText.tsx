/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable react/display-name */
import React from 'react';
import { CheckIcon, InfoIcon } from '..';
import { FormHintTextWrapper } from './FormHintTextWrapper';
import { BaseText } from '~components/Typography/BaseText';
import { getPlatformType } from '~utils';
import Box from '~components/Box';

type FormHintTextProps = {
  state: 'help' | 'error' | 'success';
  /**
   * Help text for the group
   */
  helpText?: string;
  /**
   * Error text for the group
   *
   * Renders when `state` is set to 'error'
   */
  errorText?: string;
  /**
   * Success text for the group
   *
   * Renders when `state` is set to 'success'
   */
  successText?: string;
  /**
   * Sets the id on errorText.
   * Needed for accessibility reasons.
   */
  errorTextId?: string;
  /**
   * Sets the id on helpText.
   * Needed for accessibility reasons.
   */
  helpTextId?: string;
  /**
   * Sets the id on successText.
   * Needed for accessibility reasons.
   */
  successTextId?: string;
};

const FormHintText = ({
  state,
  errorText,
  successText,
  helpText,
  helpTextId,
  errorTextId,
  successTextId,
}: FormHintTextProps): React.ReactElement => {
  const isReactNative = getPlatformType() === 'react-native';

  const colors = {
    help: 'surface.text.muted.lowContrast',
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
  const Icon = Icons[state];
  const showError = state === 'error' && errorText;
  const showSuccess = state === 'success' && successText;
  const showHelp = !showError && helpText;

  return (
    <>
      {showHelp && (
        <>
          <Box marginTop="spacing.1" />
          <FormHintTextWrapper>
            <Icon />
            <BaseText
              id={helpTextId}
              as={isReactNative ? undefined : 'span'}
              color={colors[state]}
              fontSize={50}
              lineHeight="s"
              fontStyle="italic"
              fontFamily="text"
            >
              {helpText}
            </BaseText>
          </FormHintTextWrapper>
        </>
      )}
      {showError && (
        <>
          <Box marginTop="spacing.1" />
          <FormHintTextWrapper>
            <Icon />
            <BaseText
              id={errorTextId}
              as={isReactNative ? undefined : 'span'}
              color={colors[state]}
              fontSize={50}
              lineHeight="s"
              fontStyle="italic"
              fontFamily="text"
            >
              {errorText}
            </BaseText>
          </FormHintTextWrapper>
        </>
      )}

      {showSuccess && (
        <>
          <Box marginTop="spacing.1" />
          <FormHintTextWrapper>
            <Icon />
            <BaseText
              id={successTextId}
              as={isReactNative ? undefined : 'span'}
              color={colors[state]}
              fontSize={50}
              lineHeight="s"
              fontStyle="italic"
              fontFamily="text"
            >
              {successText}
            </BaseText>
          </FormHintTextWrapper>
        </>
      )}
    </>
  );
};

export { FormHintText };
