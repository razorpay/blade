import type { StoryFn, Meta } from '@storybook/react';
import React from 'react';
import { ChatMessage } from '../ChatMessage';
import type { ChatMessageProps } from '../types';
import { Heading } from '~components/Typography/Heading';
import { Box } from '~components/Box';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { RayIcon } from '~components/Icons';
import { Card, CardBody } from '~components/Card';
import { Text } from '~components/Typography';
import { Radio, RadioGroup } from '~components/Radio';
import { Move } from '~components/Move';
import { Chip, ChipGroup } from '~components/Chip';
import { Stagger } from '~components/Stagger';
import { Fade } from '~components/Fade';

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

const ChatMessageTemplate: StoryFn<typeof ChatMessage> = (args) => {
  return <ChatMessage {...args}>Hi, Can you help me with the docs?</ChatMessage>;
};

export const Default = ChatMessageTemplate.bind({});
Default.storyName = 'Default';
Default.args = {
  senderType: 'self',
  messageType: 'default',
};

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
      <ChatMessage senderType="self" messageType="last">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
        voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
        cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </ChatMessage>
      <ChatMessage
        senderType="other"
        leading={<RayIcon size="xlarge" color="surface.icon.onSea.onSubtle" />}
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
        voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
        cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </ChatMessage>
      <ChatMessage senderType="other" marginLeft="24px">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
        voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
        cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </ChatMessage>
    </Box>
  );
};

export const SenderTypes = ChatMessageSenderTypeTemplates.bind({});
SenderTypes.storyName = 'Sender Types';

const SenderTypeWithAndWithoutIconsTemplate: StoryFn<typeof ChatMessage> = () => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.5">
      <ChatMessage
        senderType="other"
        leading={<RayIcon size="xlarge" color="surface.icon.onSea.onSubtle" />}
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
        voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
        cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </ChatMessage>
      <ChatMessage senderType="other" marginLeft="24px">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
        voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
        cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </ChatMessage>
    </Box>
  );
};
export const SenderTypeWithAndWithoutIcons = SenderTypeWithAndWithoutIconsTemplate.bind({});
SenderTypeWithAndWithoutIcons.storyName = 'Sender Type With and Without Icons';

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
        onClick={() => {
          console.log('Retrying...');
        }}
      >
        Can you help me with the docs?
      </ChatMessage>
    </Box>
  );
};

export const Error = ChatMessageErrorTemplates.bind({});
Error.storyName = 'Error Chat Message';

const ChatMessageBodyTemplates: StoryFn<typeof ChatMessage> = () => {
  return (
    <Box>
      <ChatMessage
        senderType="other"
        leading={<RayIcon size="xlarge" color="surface.icon.onSea.onSubtle" />}
      >
        <Card>
          <CardBody>
            <Box display="flex" gap="8px" flexDirection="column">
              <Text variant="body" size="medium">
                Where do you want to collect payments?
              </Text>
              <RadioGroup>
                <Radio value="website">Website</Radio>
                <Radio value="android">Android App</Radio>
                <Radio value="ios">iOS App</Radio>
              </RadioGroup>
            </Box>
          </CardBody>
        </Card>
      </ChatMessage>
    </Box>
  );
};

export const ChatMessageBody = ChatMessageBodyTemplates.bind({});
ChatMessageBody.storyName = 'Chat Message Body';

const AnimatedChatMessageTemplate: StoryFn<typeof ChatMessage> = () => {
  return (
    <Box display="flex" flexDirection="column" gap="4px">
      <Box display="flex" flexDirection="column" alignContent="end" gap="4px" width="300px">
        <Move isVisible motionTriggers={['mount']} type="inout">
          <ChatMessage senderType="self" messageType="last">
            This is a demo message
          </ChatMessage>
        </Move>
      </Box>
    </Box>
  );
};

export const AnimatedChatMessage = AnimatedChatMessageTemplate.bind({});
AnimatedChatMessage.storyName = 'Animated Chat Message';

const ChatMessageWithClickTemplate: StoryFn<typeof ChatMessage> = () => {
  return (
    <Box display="flex" flexDirection="column" gap="4px">
      <Box display="flex" flexDirection="column" alignContent="end" gap="4px" width="300px">
        <ChatMessage
          senderType="self"
          messageType="last"
          onClick={() => {
            console.log('this is a demo message');
          }}
        >
          This is a demo message
        </ChatMessage>
      </Box>
    </Box>
  );
};

export const ChatMessageWithClick = ChatMessageWithClickTemplate.bind({});
ChatMessageWithClick.storyName = 'Chat Message with Click';

const ChatMessageWithFooterActionsTemplate: StoryFn<typeof ChatMessage> = () => {
  return (
    <Box display="flex" flexDirection="column" gap="4px">
      <Box display="flex" flexDirection="column" alignContent="end" gap="4px" width="300px">
        <ChatMessage
          senderType="self"
          messageType="last"
          footerActions={
            <Box margin="4px">
              {/* TODO: replace with icon only one */}
              <ChipGroup label="">
                <Chip>Option 1</Chip>
                <Chip>Option 2</Chip>
              </ChipGroup>
            </Box>
          }
        >
          This is a demo message
        </ChatMessage>
        <ChatMessage
          senderType="other"
          footerActions={
            <Box margin="4px">
              {/* TODO: replace with icon only one */}
              <ChipGroup label="">
                <Chip>Option 1</Chip>
                <Chip>Option 2</Chip>
              </ChipGroup>
            </Box>
          }
          leading={<RayIcon size="xlarge" color="surface.icon.onSea.onSubtle" />}
        >
          This is a demo message
        </ChatMessage>
      </Box>
    </Box>
  );
};

export const ChatMessageWithFooterActions = ChatMessageWithFooterActionsTemplate.bind({});
ChatMessageWithFooterActions.storyName = 'Chat Message with Footer Actions';

const TypingText = ({ text }: { text: string }): React.ReactElement => {
  return (
    <Stagger>
      {text.split(' ').map((letter, index) => (
        <Fade key={index}>
          <Text
            display="inline"
            color="surface.text.gray.normal"
            weight="regular"
            variant="body"
            size="medium"
          >
            {letter}{' '}
          </Text>
        </Fade>
      ))}
    </Stagger>
  );
};
const ChatMessageWithCustomTypingAnimationTemplate: StoryFn<typeof ChatMessage> = () => {
  return (
    <Box display="flex" flexDirection="column" gap="4px">
      <Box display="flex" flexDirection="column" alignContent="end" gap="4px" width="300px">
        <ChatMessage
          senderType="other"
          leading={<RayIcon size="xlarge" color="surface.icon.onSea.onSubtle" />}
        >
          <Box>
            <TypingText text="This is a demo message." />
          </Box>
        </ChatMessage>
      </Box>
    </Box>
  );
};
export const ChatMessageWithCustomTypingAnimation = ChatMessageWithCustomTypingAnimationTemplate.bind(
  {},
);
ChatMessageWithCustomTypingAnimation.storyName = 'Chat Message with Custom Typing Animation';
