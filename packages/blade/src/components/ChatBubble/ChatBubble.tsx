import React from 'react';
import { UserMessageBubble } from './UserMessageBubble';
import { ResponseMessageBubble } from './ResponseMessageBubble';
import { Text } from '~components/Typography';
import type { IconComponent } from '~components/Icons';

export type ChatBubbleProps = {
  isLastMessage?: boolean;
  isUserMessage?: boolean;
  isLoading?: boolean;
  isError?: boolean;
  feedbackOptions?: Array<{ icon: React.ReactNode; onClick: () => void }>;
  errorText?: string;
  onErrorTextClick?: () => void;
  children: React.ReactNode | string;
  avatarIcon?: IconComponent;
  avatarColor?: string;
};
const ChatBubble = ({
  isLastMessage,
  isUserMessage,
  isLoading,
  isError,
  feedbackOptions,
  errorText,
  onErrorTextClick,
  children,
  avatarIcon,
  avatarColor,
}: ChatBubbleProps): React.ReactElement => {
  console.log({
    isLastMessage,
    isUserMessage,
    isLoading,
    isError,
    feedbackOptions,
    errorText,
    onErrorTextClick,
    children,
    avatarIcon,
  });
  const childrenToRender = (): React.ReactElement => {
    // their can be a case where childrens are passed like  "{' '} some text" so we need to check if children is string or not
    const shouldWrapInText =
      typeof children === 'string' ||
      (Array.isArray(children) && children.every((child) => typeof child === 'string'));
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
          {children}
        </Text>
      );
    }
    return children;
  };
  return isUserMessage ? (
    <UserMessageBubble
      isError={isError}
      onErrorTextClick={onErrorTextClick}
      isLastMessage={isLastMessage}
      isUserMessage={isUserMessage}
      errorText={errorText}
      children={childrenToRender()}
    />
  ) : (
    <ResponseMessageBubble
      children={childrenToRender()}
      avatarIcon={avatarIcon}
      avatarColor={avatarColor}
    />
  );
};

export { ChatBubble };
