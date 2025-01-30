// import chatBubble and create a basic story 
import { ChatBubble } from './ChatBubble';
import React from 'react';
import { Story } from '@storybook/react';
import { ChatBubbleProps } from './ChatBubble.types';

export default {
  title: 'ChatBubble',
  component: ChatBubble,
};

const Template: Story<ChatBubbleProps> = (args) => <ChatBubble {...args} />;
export const Default = Template.bind({});
Default.args = {
  message: 'Hello',
  isLastMessage: false,
  isUserMessage: false,
  isLoading: false,
  isError: false,
  cardBody: null,
  feedbackOptions: [],
  ErrorText: '',
  onErrorTextClick: () => {},
};