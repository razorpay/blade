// import chatBubble and create a basic story
import React from 'react';
import { Story } from '@storybook/react';
import { ChatBubble } from './ChatBubble';
import type { ChatBubbleProps } from './ChatBubble';
import { Box } from '~components/Box';
import { RayIcon } from '~components/Icons';

export default {
  title: 'ChatBubble',
  component: ChatBubble,
};

const Template = (args) => (
  <Box display="flex" flexDirection="column" gap={'spacing.10'}>
    <ChatBubble isUserMessage> Demo</ChatBubble>
    <ChatBubble isUserMessage isLastMessage>
      this is a demo message
    </ChatBubble>
    <ChatBubble isUserMessage isLastMessage>
      message
    </ChatBubble>
    <ChatBubble isUserMessage isError onErrorTextClick={() => {}}>
      Hi, can you tell me how can i join fight club?
    </ChatBubble>
    <ChatBubble avatarIcon={RayIcon} avatarColor="surface.background.sea.intense">
      Yo! i am the bot
    </ChatBubble>
    <ChatBubble avatarIcon={RayIcon} avatarColor="surface.background.sea.intense" isLoading>
      {' '}
      Yo! i am the bot. this is a very very very big chat bubble yo yo
    </ChatBubble>
  </Box>
);
export const Default = Template.bind({});
