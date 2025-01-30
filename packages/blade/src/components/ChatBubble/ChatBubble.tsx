import React from 'react';
import { UserMessageBubble } from './UserMessageBubble';
import { Box } from '~components/Box';
import BaseBox from '~components/Box/BaseBox';
import { AlertCircleIcon } from '~components/Icons';
import { Text } from '~components/Typography';

export type ChatBubbleProps = {
  isLastMessage?: boolean;
  isUserMessage?: boolean;
  isLoading?: boolean;
  isError?: boolean;
  feedbackOptions?: Array<{ icon: React.ReactNode; onClick: () => void }>;
  errorText?: string;
  onErrorTextClick?: () => void;
  children: React.ReactNode | string;
  avatarIcon?: React.ReactNode;
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
    if (typeof children === 'string') {
      return (
        <Text color="surface.text.gray.normal" weight="regular" variant="body" size="medium">
          {children}
        </Text>
      );
    }
    return children;
  };
  return (
    <UserMessageBubble
      isError={isError}
      onErrorTextClick={onErrorTextClick}
      isLastMessage={isLastMessage}
      isUserMessage={isUserMessage}
      errorText={errorText}
      children={childrenToRender()}
    />
  );
};

export { ChatBubble };
