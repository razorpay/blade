import React from 'react';
import { SelfMessageBubble } from './SelfMessageBubble';
import { DefaultMessageBubble } from './DefaultMessageBubble';
import type { ChatBubbleProps } from './types';
import { Text } from '~components/Typography';
import BaseBox from '~components/Box/BaseBox';
import { getStringFromReactText } from '~utils/getStringChildren';

const ChatBubble = ({
  messageType = 'default',
  senderType = 'self',
  isLoading = false,
  validationState = 'none',
  errorText = '',
  onClick,
  footerActions,
  children,
  leading,
  loadingText,
  ...props
}: ChatBubbleProps): React.ReactElement => {
  const childrenToRender = (): React.ReactElement => {
    // their can be a case where childrens are passed like  "{' '} some text" so we need to check if children is string or not
    const shouldWrapInText =
      typeof children === 'string' ||
      (Array.isArray(children) && children.every((child) => typeof child === 'string')) ||
      isLoading;
    if (shouldWrapInText) {
      return (
        <Text
          color={isLoading ? 'surface.text.gray.muted' : 'surface.text.gray.normal'}
          weight="regular"
          variant="body"
          size="medium"
        >
          {isLoading ? loadingText : getStringFromReactText(children)}
        </Text>
      );
    }
    return children;
  };
  return (
    <BaseBox {...props}>
      {senderType === 'self' ? (
        <SelfMessageBubble
          isError={validationState === 'error'}
          onClick={onClick}
          errorText={errorText}
          children={childrenToRender()}
          messageType={messageType}
        />
      ) : (
        <DefaultMessageBubble
          children={childrenToRender()}
          leading={leading}
          onClick={onClick}
          isLoading={isLoading}
        />
      )}
      {footerActions}
    </BaseBox>
  );
};

export { ChatBubble };
