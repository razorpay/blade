import type { StoryFn, Meta } from '@storybook/react';
import { ChatMessage } from '../ChatMessage';
import type { ChatMessageProps } from '../types';
import { Heading } from '~components/Typography/Heading';
import { Box } from '~components/Box';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { RayIcon } from '~components/Icons';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="ChatMessage"
      componentDescription="A Chat Message is a visual representation of a message in a chat application."
      apiDecisionLink={null}
      figmaURL="https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=100413-32686&t=n9A7LztwEkIsly3v-0"
    >
      <Heading size="large">Usage</Heading>
      <Sandbox showConsole>
        {`
        import { ChatMessage } from '@razorpay/blade/components';
        
        function App() {
          return (
            <ChatMessage > Hi, from ray! </ChatMessage>
          )
        }

        export default App;
      `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

export default {
  title: 'Components/ChatMessage',
  component: ChatMessage,
  tags: ['autodocs'],
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<ChatMessageProps>;

const ChatMessageTemplate: StoryFn<typeof ChatMessage> = () => {
  return (
    <ChatMessage senderType="self" messageType="last">
      Hi, Can you help me with the docs?
    </ChatMessage>
  );
};

export const Default = ChatMessageTemplate.bind({});
Default.storyName = 'Default';

const ChatMessageMessageTypeTemplates: StoryFn<typeof ChatMessage> = () => {
  const messageTypes = ['last', 'default'] as const;
  return (
    <Box display="flex" flexDirection="column" gap="spacing.5">
      {messageTypes.map((message, index) => (
        <ChatMessage senderType="self" messageType={message} key={index}>
          Hi, Can you help me with the docs?
        </ChatMessage>
      ))}
    </Box>
  );
};

export const MessageTypes = ChatMessageMessageTypeTemplates.bind({});
MessageTypes.storyName = 'Message Types';
MessageTypes.args = {};

const ChatMessageSenderTypeTemplates: StoryFn<typeof ChatMessage> = () => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.5">
      <ChatMessage senderType="self" messageType="default">
        Hi, Can you help me with the docs?
      </ChatMessage>
      <ChatMessage
        senderType="other"
        leading={<RayIcon size="xlarge" color="surface.icon.onSea.onSubtle" />}
      >
        Hi, Can you help me with the docs?
      </ChatMessage>
    </Box>
  );
};

export const SenderTypes = ChatMessageSenderTypeTemplates.bind({});
SenderTypes.storyName = 'Sender Types';

const ChatMessageLoadingTemplates: StoryFn<typeof ChatMessage> = () => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.5">
      <ChatMessage
        isLoading
        senderType="other"
        loadingText="Analyzing your response..."
        leading={<RayIcon size="xlarge" color="surface.icon.onSea.onSubtle" />}
      />
    </Box>
  );
};

export const Loading = ChatMessageLoadingTemplates.bind({});
Loading.storyName = 'Loading Chat Message';

const ChatMessageErrorTemplates: StoryFn<typeof ChatMessage> = () => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.5">
      <ChatMessage
        validationState="error"
        senderType="self"
        messageType="last"
        errorText="Message not sent. Tap to retry."
      >
        Can you help me with the docs?
      </ChatMessage>
    </Box>
  );
};

export const Error = ChatMessageErrorTemplates.bind({});
Error.storyName = 'Error Chat Message';
