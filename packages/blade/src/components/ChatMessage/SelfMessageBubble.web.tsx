import React from 'react';
import type { CommonChatMessageProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import { FormHint } from '~components/Form/FormHint';

const SelfMessageBubble = ({
  children,
  validationState,
  errorText = 'Message not sent. Tap to retry.',
  onClick,
  messageType,
}: Pick<
  CommonChatMessageProps,
  'children' | 'validationState' | 'errorText' | 'onClick' | 'messageType'
>): React.ReactElement => {
  const isError = validationState === 'error';
  return (
    <BaseBox
      display="flex"
      flexDirection="column"
      onClick={onClick}
      cursor={isError ? 'pointer' : 'default'}
    >
      <BaseBox
        maxWidth="240px"
        backgroundColor={
          isError ? 'feedback.background.negative.subtle' : 'surface.background.primary.subtle'
        }
        padding="spacing.4"
        borderTopLeftRadius="large"
        borderTopRightRadius="large"
        borderBottomLeftRadius="large"
        borderBottomRightRadius={messageType === 'last' ? 'none' : 'large'}
        width="fit-content"
        height="auto"
      >
        {children}
      </BaseBox>
      {isError && <FormHint type="error" errorText={errorText} size="small" />}
    </BaseBox>
  );
};

export { SelfMessageBubble };
