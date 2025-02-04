import React from 'react';
import type { CommonChatMessageProps } from './types';
import { chatMessageToken } from './token';
import BaseBox from '~components/Box/BaseBox';
import { FormHint } from '~components/Form/FormHint';

const SelfMessageBubble = ({
  children,
  validationState,
  errorText = 'Message not sent. Tap to retry.',
  messageType,
}: Pick<
  CommonChatMessageProps,
  'children' | 'validationState' | 'errorText' | 'messageType'
>): React.ReactElement => {
  const isError = validationState === 'error';
  return (
    <BaseBox display="flex" flexDirection="column">
      <BaseBox
        maxWidth={chatMessageToken.self.maxWidth}
        backgroundColor={
          isError
            ? chatMessageToken.self.backgroundColor.error
            : chatMessageToken.self.backgroundColor.default
        }
        padding="spacing.4"
        borderTopLeftRadius={chatMessageToken.self.borderTopLeftRadius}
        borderTopRightRadius={chatMessageToken.self.borderTopRightRadius}
        borderBottomLeftRadius={chatMessageToken.self.borderBottomLeftRadius}
        borderBottomRightRadius={
          messageType === 'last'
            ? chatMessageToken.self.borderBottomRightRadiusForLastMessage
            : chatMessageToken.self.borderBottomRightRadius
        }
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
