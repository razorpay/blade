import React from 'react';
import type { CommonChatMessageProps } from './types';
import { chatMessageToken } from './token';
import BaseBox from '~components/Box/BaseBox';
import { FormHint } from '~components/Form/FormHint';
import { useTheme } from '~utils';

const SelfMessageBubble = ({
  children,
  validationState,
  errorText = 'Message not sent. Tap to retry.',
  isChildText,
}: Pick<CommonChatMessageProps, 'children' | 'validationState' | 'errorText'> & {
  isChildText: boolean;
}): React.ReactElement => {
  const isError = validationState === 'error';
  const { colorScheme } = useTheme();

  return (
    <BaseBox display="flex" flexDirection="column">
      <BaseBox
        backgroundColor={chatMessageToken.self.backgroundColor.default}
        padding={isChildText ? 'spacing.4' : 'spacing.0'}
        borderRadius="large"
        alignSelf="flex-end"
        borderWidth="thin"
        borderColor="surface.border.gray.muted"
        // Match web's subtle bubble shadow instead of the heavier `lowRaised` elevation token.
        style={chatMessageToken.messageBubble.nativeShadow[colorScheme]}
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
