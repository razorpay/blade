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
  isChildText,
}: Pick<CommonChatMessageProps, 'children' | 'validationState' | 'errorText' | 'messageType'> & {
  // is child is text then only add padding otherwise no need to add padding
  isChildText: boolean;
}): React.ReactElement => {
  const isError = validationState === 'error';
  return (
    <BaseBox display="flex" flexDirection="column">
      <BaseBox
        backgroundColor={
          isError
            ? chatMessageToken.self.backgroundColor.error
            : chatMessageToken.self.backgroundColor.default
        }
        padding={isChildText ? 'spacing.4' : 'spacing.0'}
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
        alignSelf="flex-end"
      >
        {children}
      </BaseBox>
      <BaseBox alignSelf="flex-end">
        {isError && <FormHint type="error" errorText={errorText} size="small" />}
      </BaseBox>
    </BaseBox>
  );
};

export { SelfMessageBubble };
