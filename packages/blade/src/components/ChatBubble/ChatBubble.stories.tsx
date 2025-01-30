// import chatBubble and create a basic story
import React from 'react';
import { Story } from '@storybook/react';
import { ChatBubble } from './ChatBubble';
import type { ChatBubbleProps } from './ChatBubble';
import { Box } from '~components/Box';

export default {
  title: 'ChatBubble',
  component: ChatBubble,
};

const Template = (args) => (
  <Box display="flex" flexDirection="column" gap={'spacing.10'}>
    <ChatBubble> Demo</ChatBubble>
    <ChatBubble isLastMessage> this is a demo message </ChatBubble>
    <ChatBubble isUserMessage isLastMessage>
      message
    </ChatBubble>
    <ChatBubble isError onErrorTextClick={() => {}}>
      {' '}
      Hi, can you tell me how can i join fight club?{' '}
    </ChatBubble>
  </Box>
);
export const Default = Template.bind({});
