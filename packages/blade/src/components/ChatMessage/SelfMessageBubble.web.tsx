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
        padding={isChildText ? 'spacing.5' : 'spacing.0'}
        borderRadius="large"
        width="fit-content"
        height="auto"
        alignSelf="flex-end"
        border="thin"
        borderColor="surface.border.gray.muted"
        style={{
          //TODO: ask for tokens  design
          boxShadow: '0 2px 2px 0 rgba(237, 236, 236, 0.16)',
        }}
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
