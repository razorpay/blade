// import chatBubble and create a basic story
import React from 'react';
import { ChatBubble } from './ChatBubble';
import { Box } from '~components/Box';
import { RayIcon } from '~components/Icons';

export default {
  title: 'ChatBubble',
  component: ChatBubble,
};

const Template = (args) => (
  <Box display="flex" flexDirection="column" gap={'spacing.10'}>
    <ChatBubble messageType="last" senderType="self">
      {' '}
      Demo
    </ChatBubble>
    <ChatBubble
      senderType="other"
      leading={<RayIcon size="xlarge" color="surface.background.sea.intense" />}
    >
      this is a demo message
    </ChatBubble>
    <ChatBubble messageType="self" senderType="self">
      message
    </ChatBubble>
    <ChatBubble>Hi, can you tell me how can i join fight club?</ChatBubble>
    <ChatBubble
      senderType="other"
      leading={<RayIcon size="xlarge" color="surface.background.sea.intense" />}
      isLoading
      loadingText="Analyzing your response..."
    />

    <ChatBubble
      senderType="other"
      leading={<RayIcon size="xlarge" color="surface.background.sea.intense" />}
    >
      {' '}
      Yo! i am the bot. this is a very very very big chat bubble yo yo
    </ChatBubble>
  </Box>
);
export const Default = Template.bind({});
