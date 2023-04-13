/* eslint-disable react/display-name */
import type { ReactElement } from 'react';
import React from 'react';
import { FormHintWrapper } from './FormHintWrapper';
import { BaseText } from '~components/Typography/BaseText';
import { getPlatformType } from '~utils';
import BaseBox from '~components/Box/BaseBox';
import { CheckIcon, InfoIcon } from '~components/Icons';
import type { BaseTextProps } from '~components/Typography/BaseText/types';

type HintTextProps = {
  icon?: React.ElementType;
  children: string;
  id?: string;
  color: BaseTextProps['color'];
};

const HintText = ({ icon: Icon, children, id, color }: HintTextProps): ReactElement => {
  const isReactNative = getPlatformType() === 'react-native';

  return (
    <BaseBox marginTop="spacing.2">
      <FormHintWrapper>
        {Icon ? <Icon /> : null}
        <BaseText
          id={id}
          as={isReactNative ? undefined : 'span'}
          color={color}
          fontSize={50}
          lineHeight={50}
          fontStyle="italic"
          fontFamily="text"
        >
          {children}
        </BaseText>
      </FormHintWrapper>
    </BaseBox>
  );
};

export type FormHintProps = {
  type: 'help' | 'error' | 'success';
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

const Icons = {
  error: (): ReactElement => (
    <>
      <InfoIcon color="feedback.icon.negative.lowContrast" size="small" />
      <BaseBox marginRight="spacing.2" />
    </>
  ),
  success: (): ReactElement => (
    <>
      <CheckIcon color="feedback.icon.positive.lowContrast" size="small" />
      <BaseBox marginRight="spacing.2" />
    </>
  ),
};

const FormHint = ({
  type,
  helpText,
  errorText,
  successText,
  helpTextId,
  errorTextId,
  successTextId,
}: FormHintProps): React.ReactElement => {
  const colors = {
    help: 'surface.text.muted.lowContrast',
    error: 'feedback.text.negative.lowContrast',
    success: 'feedback.text.positive.lowContrast',
  } as const;

  const showError = type === 'error' && errorText;
  const showSuccess = type === 'success' && successText;
  const showHelp = !showError && !showSuccess && helpText;

  return (
    <>
      {showHelp && (
        <HintText id={helpTextId} color={colors.help}>
          {helpText}
        </HintText>
      )}

      {showError && (
        <HintText id={errorTextId} icon={Icons.error} color={colors.error}>
          {errorText}
        </HintText>
      )}

      {showSuccess && (
        <HintText id={successTextId} icon={Icons.success} color={colors.success}>
          {successText}
        </HintText>
      )}
    </>
  );
};

export { FormHint };
