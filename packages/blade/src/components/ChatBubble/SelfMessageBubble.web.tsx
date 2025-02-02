import React from 'react';
import BaseBox from '~components/Box/BaseBox';
import { AlertCircleIcon } from '~components/Icons';
import { Text } from '~components/Typography';

const SelfMessageBubble = ({
  children,
  isError,
  errorText = 'Message not sent. Tap to retry.',
  onClick,
  messageType,
}: {
  children: React.ReactNode | string;
  isError?: boolean;
  errorText?: string;
  onClick?: () => void;
  messageType: 'last' | 'default';
}): React.ReactElement => {
  return (
    <BaseBox
      display="flex"
      gap="10px"
      flexDirection="column"
      onClick={onClick}
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
        borderBottomRightRadius={messageType === 'last' ? 'none' : 'large'}
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
          justifyContent="flex-start"
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

export { SelfMessageBubble };
