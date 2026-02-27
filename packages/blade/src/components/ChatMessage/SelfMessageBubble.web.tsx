import React from 'react';
import styled from 'styled-components';
import type { CommonChatMessageProps } from './types';
import { chatMessageToken } from './token';
import { getMessageBubbleBoxShadow } from './utils';
import BaseBox from '~components/Box/BaseBox';
import { FormHint } from '~components/Form/FormHint';
import { useTheme } from '~utils';

const StyledSelfMessageBubble = styled(BaseBox)(() => {
  const { colorScheme } = useTheme();
  return getMessageBubbleBoxShadow(colorScheme);
});

const SelfMessageBubble = ({
  children,
  validationState,
  errorText = 'Message not sent. Tap to retry.',
  isChildText,
}: Pick<CommonChatMessageProps, 'children' | 'validationState' | 'errorText'> & {
  // is child is text then only add padding otherwise no need to add padding
  isChildText: boolean;
}): React.ReactElement => {
  const isError = validationState === 'error';

  return (
    <BaseBox display="flex" flexDirection="column">
      <StyledSelfMessageBubble
        backgroundColor={chatMessageToken.self.backgroundColor.default}
        padding={isChildText ? 'spacing.5' : 'spacing.0'}
        borderRadius="large"
        width="fit-content"
        height="auto"
        alignSelf="flex-end"
        border="thin"
        borderColor="surface.border.gray.muted"
      >
        {children}
      </StyledSelfMessageBubble>
      <BaseBox alignSelf="flex-end">
        {isError && <FormHint type="error" errorText={errorText} size="small" />}
      </BaseBox>
    </BaseBox>
  );
};

export { SelfMessageBubble };
