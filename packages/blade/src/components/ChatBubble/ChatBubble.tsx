import React from 'react';
import { UserMessageBubble } from './UserMessageBubble';
import { ResponseMessageBubble } from './ResponseMessageBubble';
import { Text } from '~components/Typography';
import BaseBox from '~components/Box/BaseBox';

export type ChatBubbleProps = {
  messageType?: 'last' | 'default';
  senderType?: 'self' | 'other';
  isLoading?: boolean;
  validationState?: 'error' | 'none';
  errorText?: string;
  onClick?: () => void;
  footerActions?: React.ReactNode;
  children?: React.ReactNode | string;
  leading?: React.ReactNode;
  loadingText?: string;
};
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
}: ChatBubbleProps): React.ReactElement => {
  const childrenToRender = (): React.ReactElement => {
    // their can be a case where childrens are passed like  "{' '} some text" so we need to check if children is string or not
    const shouldWrapInText =
      typeof children === 'string' ||
      (Array.isArray(children) && children.every((child) => typeof child === 'string')) ||
      isLoading;
    // console.log(children.every((child) => typeof child === 'string'));
    // convert children to an array if it is not an array

    if (shouldWrapInText) {
      return (
        <Text
          color={isLoading ? 'surface.text.gray.muted' : 'surface.text.gray.normal'}
          weight="regular"
          variant="body"
          size="medium"
        >
          {isLoading ? loadingText : children}
        </Text>
      );
    }
    return children;
  };
  return (
    <BaseBox>
      {senderType === 'self' ? (
        <UserMessageBubble
          isError={validationState === 'error'}
          onClick={onClick}
          errorText={errorText}
          children={childrenToRender()}
          messageType={messageType}
        />
      ) : (
        <ResponseMessageBubble
          children={childrenToRender()}
          leading={leading}
          onClick={onClick}
          loadingText={loadingText}
          isLoading={isLoading}
        />
      )}
      {footerActions}
    </BaseBox>
  );
};

export { ChatBubble };
