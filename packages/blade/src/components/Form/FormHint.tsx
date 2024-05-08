/* eslint-disable react/display-name */
import type { ReactElement } from 'react';
import React from 'react';
import { FormHintWrapper } from './FormHintWrapper';
import { hintIconSize, hintMarginTop, hintTextSize } from './formTokens';
import type { TextProps } from '~components/Typography/Text';
import { Text } from '~components/Typography/Text';
import BaseBox from '~components/Box/BaseBox';
import { CheckIcon, InfoIcon } from '~components/Icons';
import { getPlatformType } from '~utils/getPlatformType';

type HintTextProps = {
  icon?: React.ElementType;
  children: string;
  id?: string;
  color: TextProps<{ variant: 'caption' }>['color'];
  size: 'small' | 'medium' | 'large';
};

const HintText = ({ icon: Icon, children, id, color, size }: HintTextProps): ReactElement => {
  const isReactNative = getPlatformType() === 'react-native';

  return (
    <BaseBox marginTop={hintMarginTop[size]} id={id}>
      <FormHintWrapper>
        {Icon ? <Icon /> : null}
        <Text
          as={isReactNative ? undefined : 'span'}
          color={color}
          size={hintTextSize[size]}
          variant="caption"
        >
          {children}
        </Text>
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
  /**
   * Sets the size of the hint
   * @default medium
   */
  size?: 'small' | 'medium' | 'large';
};

const Icons = {
  error: ({ size }: { size: 'small' | 'medium' | 'large' }): ReactElement => (
    <>
      <InfoIcon color="feedback.icon.negative.intense" size={hintIconSize[size]} />
      <BaseBox marginRight="spacing.2" />
    </>
  ),
  success: ({ size }: { size: 'small' | 'medium' | 'large' }): ReactElement => (
    <>
      <CheckIcon color="feedback.icon.positive.intense" size={hintIconSize[size]} />
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
  size = 'medium',
}: FormHintProps): React.ReactElement => {
  const colors: Record<string, TextProps<{ variant: 'caption' }>['color']> = {
    help: 'surface.text.gray.muted',
    error: 'feedback.text.negative.intense',
    success: 'feedback.text.positive.intense',
  };

  const showError = type === 'error' && errorText;
  const showSuccess = type === 'success' && successText;
  const showHelp = !showError && !showSuccess && helpText;

  return (
    <>
      {showHelp && (
        <HintText size={size} id={helpTextId} color={colors.help}>
          {helpText}
        </HintText>
      )}

      {showError && (
        <HintText
          size={size}
          id={errorTextId}
          icon={() => Icons.error({ size })}
          color={colors.error}
        >
          {errorText}
        </HintText>
      )}

      {showSuccess && (
        <HintText
          size={size}
          id={successTextId}
          icon={() => Icons.success({ size })}
          color={colors.success}
        >
          {successText}
        </HintText>
      )}
    </>
  );
};

export { FormHint };
