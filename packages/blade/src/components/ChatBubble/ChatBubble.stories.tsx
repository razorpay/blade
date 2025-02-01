// import chatBubble and create a basic story
import React from 'react';
import { ChatBubble } from './ChatBubble';
import { Box } from '~components/Box';
import { RayIcon } from '~components/Icons';
import { Card, CardHeaderLeading, CardHeader, CardFooter, CardBody } from '~components/Card';
import { Text } from '~components/Typography';
import { Radio, RadioGroup } from '~components/Radio';

export default {
  title: 'ChatBubble',
  component: ChatBubble,
};

const Template = (args) => (
  <Box width="350px" display="flex" flexDirection="column" gap="12px">
    <ChatBubble
      senderType="other"
      leading={<RayIcon size="xlarge" color="surface.background.sea.intense" />}
      style={{ alignSelf: 'flex-start' }}
    >
      Hi, my name is Ray. How can I help you today?
    </ChatBubble>
    <ChatBubble senderType="self" style={{ alignSelf: 'flex-end' }}>
      Can you help me with payment intregation?
    </ChatBubble>
    <ChatBubble
      senderType="other"
      leading={<RayIcon size="xlarge" color="surface.background.sea.intense" />}
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
    </ChatBubble>
    <ChatBubble
      senderType="self"
      style={{ alignSelf: 'flex-end' }}
      validationState="error"
      errorText="Unable to send the message"
      messageType="last"
    >
      can you share the link of docs?
    </ChatBubble>
    <ChatBubble
      senderType="other"
      leading={<RayIcon size="xlarge" color="surface.background.sea.intense" />}
      isLoading
      loadingText="Searching your link..."
    />
  </Box>
);
export const Default = Template.bind({});
