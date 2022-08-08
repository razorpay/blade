/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable react/display-name */
import React from 'react';
import { CheckIcon, InfoIcon } from '..';
import { FormHintWrapper } from './FormHintWrapper';
import type { BaseTextProps } from '~components/Typography/BaseText';
import { BaseText } from '~components/Typography/BaseText';
import { getPlatformType } from '~utils';
import Box from '~components/Box';

type HintTextProps = {
  icon: React.ElementType;
  children: string;
  id?: string;
  color: BaseTextProps['color'];
};

const HintText = ({ icon: Icon, children, id, color }: HintTextProps) => {
  const isReactNative = getPlatformType() === 'react-native';

  return (
    <>
      <Box marginTop="spacing.1" />
      <FormHintWrapper>
        <Icon />
        <BaseText
          id={id}
          as={isReactNative ? undefined : 'span'}
          color={color}
          fontSize={50}
          lineHeight="s"
          fontStyle="italic"
          fontFamily="text"
        >
          {children}
        </BaseText>
      </FormHintWrapper>
    </>
  );
};

type FormHintProps = {
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

const FormHint = ({
  state,
  errorText,
  successText,
  helpText,
  helpTextId,
  errorTextId,
  successTextId,
}: FormHintProps): React.ReactElement => {
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
  // TODO: add condition for !success
  const showHelp = !showError && helpText;

  return (
    <>
      {showHelp && (
        <HintText id={helpTextId} icon={Icon} color={colors[state]}>
          {helpText}
        </HintText>
      )}

      {showError && (
        <HintText id={errorTextId} icon={Icon} color={colors[state]}>
          {errorText}
        </HintText>
      )}

      {showSuccess && (
        <HintText id={successTextId} icon={Icon} color={colors[state]}>
          {successText}
        </HintText>
      )}
    </>
  );
};

export { FormHint };
