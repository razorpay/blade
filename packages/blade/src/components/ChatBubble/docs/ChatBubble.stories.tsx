import type { StoryFn, Meta } from '@storybook/react';
import { ChatBubble } from '../ChatBubble';
import type { ChatBubbleProps } from '../types';
import { Heading } from '~components/Typography/Heading';
import { Box } from '~components/Box';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { RayIcon } from '~components/Icons';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="ChatBubble"
      componentDescription="A chat bubble is a visual representation of a message in a chat application. It is used to distinguish between messages sent by the user and messages received from other users."
      apiDecisionLink={null}
      figmaURL="https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=100413-32686&t=n9A7LztwEkIsly3v-0"
    >
      <Heading size="large">Usage</Heading>
      <Sandbox showConsole>
        {`
        import { ChatBubble } from '@razorpay/blade/components';
        
        function App() {
          return (
            <ChatBubble > Hi, from ray! </ChatBubble>
          )
        }

        export default App;
      `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

export default {
  title: 'Components/ChatBubble',
  component: ChatBubble,
  tags: ['autodocs'],
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<ChatBubbleProps>;

const ChatBubbleTemplate: StoryFn<typeof ChatBubble> = () => {
  return (
    <ChatBubble senderType="self" messageType="last">
      Hi, Can you help me with the docs?
    </ChatBubble>
  );
};

export const Default = ChatBubbleTemplate.bind({});
Default.storyName = 'Default';

const ChatBubbleMessageTypeTemplates: StoryFn<typeof ChatBubble> = () => {
  const messageTypes = ['last', 'default'] as const;
  return (
    <Box display="flex" flexDirection="column" gap="spacing.5">
      {messageTypes.map((message, index) => (
        <ChatBubble senderType="self" messageType={message} key={index}>
          Hi, Can you help me with the docs?
        </ChatBubble>
      ))}
    </Box>
  );
};

export const MessageTypes = ChatBubbleMessageTypeTemplates.bind({});
MessageTypes.storyName = 'Message Types';
MessageTypes.args = {};

const ChatBubbleSenderTypeTemplates: StoryFn<typeof ChatBubble> = () => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.5">
      <ChatBubble senderType="self" messageType="default">
        Hi, Can you help me with the docs?
      </ChatBubble>
      <ChatBubble
        senderType="other"
        leading={<RayIcon size="xlarge" color="surface.background.sea.intense" />}
      >
        Hi, Can you help me with the docs?
      </ChatBubble>
    </Box>
  );
};

export const SenderTypes = ChatBubbleSenderTypeTemplates.bind({});
SenderTypes.storyName = 'Sender Types';

const ChatBubbleLoadingTemplates: StoryFn<typeof ChatBubble> = () => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.5">
      <ChatBubble
        isLoading
        senderType="other"
        loadingText="Analyzing your response..."
        leading={<RayIcon size="xlarge" color="surface.background.sea.intense" />}
      />
    </Box>
  );
};

export const Loading = ChatBubbleLoadingTemplates.bind({});
Loading.storyName = 'Loading Chat Bubble';

const ChatBubbleErrorTemplates: StoryFn<typeof ChatBubble> = () => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.5">
      <ChatBubble
        validationState="error"
        senderType="self"
        messageType="last"
        errorText="Message not sent. Tap to retry."
      >
        Can you help me with the docs?
      </ChatBubble>
    </Box>
  );
};

export const Error = ChatBubbleErrorTemplates.bind({});
Error.storyName = 'Error Chat Bubble';
