import type { StoryFn, Meta } from '@storybook/react-vite';
import React from 'react';
import { ChatMessage } from './ChatMessage';
import type { ChatMessageProps } from './types';
import { Box } from '~components/Box';
import { RayIcon } from '~components/Icons';

export default {
  title: 'Components/ChatMessage',
  component: ChatMessage,
  parameters: {
    docs: { disable: true },
  },
} as Meta<ChatMessageProps>;

const SelfMessageTemplate: StoryFn<ChatMessageProps> = (args) => {
  return (
    <Box padding="spacing.4">
      <ChatMessage {...args} senderType="self">
        How do I integrate Razorpay payment gateway?
      </ChatMessage>
    </Box>
  );
};

export const SelfMessage = SelfMessageTemplate.bind({});

const OtherMessageTemplate: StoryFn<ChatMessageProps> = (args) => {
  return (
    <Box padding="spacing.4">
      <ChatMessage {...args} senderType="other" leading={<RayIcon size="medium" />}>
        You can integrate the Razorpay payment gateway by following these steps. First, install the
        SDK and configure your API keys.
      </ChatMessage>
    </Box>
  );
};

export const OtherMessage = OtherMessageTemplate.bind({});

const LoadingTemplate: StoryFn<ChatMessageProps> = (args) => {
  return (
    <Box padding="spacing.4">
      <ChatMessage
        {...args}
        senderType="other"
        isLoading={true}
        loadingText="Thinking..."
        leading={<RayIcon size="medium" />}
      />
    </Box>
  );
};

export const NativeLoading = LoadingTemplate.bind({});

const ErrorTemplate: StoryFn<ChatMessageProps> = (args) => {
  return (
    <Box padding="spacing.4">
      <ChatMessage
        {...args}
        senderType="self"
        validationState="error"
        errorText="Failed to send message. Please try again."
      >
        This message failed to send
      </ChatMessage>
    </Box>
  );
};

export const ErrorState = ErrorTemplate.bind({});

const WithReasoningTemplate: StoryFn<ChatMessageProps> = (args) => {
  return (
    <Box padding="spacing.4">
      <ChatMessage
        {...args}
        senderType="other"
        leading={<RayIcon size="medium" />}
        reasoningTraces={[
          { label: 'Understanding the question...' },
          { label: 'Looking up payment gateway docs...' },
          { label: 'Generating integration steps...' },
        ]}
        reasoningStatus="complete"
        reasoningTitle="Explored"
      >
        Here are the integration steps for the Razorpay payment gateway.
      </ChatMessage>
    </Box>
  );
};

export const WithReasoning = WithReasoningTemplate.bind({});

const ConversationTemplate: StoryFn<ChatMessageProps> = () => {
  return (
    <Box padding="spacing.4" display="flex" flexDirection="column" gap="spacing.3">
      <ChatMessage senderType="self">What is Razorpay?</ChatMessage>
      <ChatMessage senderType="other" leading={<RayIcon size="medium" />}>
        Razorpay is a full-stack financial solutions company that provides payment gateway, business
        banking, and other financial products.
      </ChatMessage>
      <ChatMessage senderType="self">How do I get started?</ChatMessage>
      <ChatMessage senderType="other" leading={<RayIcon size="medium" />}>
        You can sign up on the Razorpay dashboard, complete KYC verification, and then integrate
        using our SDKs.
      </ChatMessage>
    </Box>
  );
};

export const Conversation = ConversationTemplate.bind({});
