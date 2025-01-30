import React from 'react';
import BaseBox from '~components/Box/BaseBox';
import { AlertCircleIcon } from '~components/Icons';
import { Text } from '~components/Typography';

const UserMessageBubble = ({
  children,
  isError,
  onErrorTextClick,
  isLastMessage,
  isUserMessage,
  errorText = 'Message not sent. Tap to retry.',
}: {
  children: React.ReactNode | string;
  isError?: boolean;
  onErrorTextClick?: () => void;
  isLastMessage?: boolean;
  isUserMessage?: boolean;
  errorText?: string;
}): React.ReactElement => {
  return (
    <BaseBox
      display="flex"
      gap="10px"
      flexDirection="column"
      onClick={isError ? onErrorTextClick : () => {}}
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
        borderBottomRightRadius={isLastMessage && isUserMessage ? 'none' : 'large'}
        width="fit-content"
        height="auto"
        word-break="break-word"
      >
        {children}
      </BaseBox>
      {isError && (
        <BaseBox
          maxWidth="240px"
          display="flex"
          justifyContent="center"
          alignItems="center"
          gap="4px"
        >
          <AlertCircleIcon size="small" color="feedback.icon.negative.intense" />
          <Text
            color="feedback.text.negative.intense"
            weight="regular"
            variant="caption"
            size="medium"
          >
            {errorText}
          </Text>
        </BaseBox>
      )}
    </BaseBox>
  );
};

export { UserMessageBubble };
