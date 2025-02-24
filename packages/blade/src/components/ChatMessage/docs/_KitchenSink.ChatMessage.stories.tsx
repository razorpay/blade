import { composeStories } from '@storybook/react';
import * as chatMessage from './ChatMessage.stories';
import { Box } from '~components/Box';
import { Heading } from '~components/Typography';

const allStories = [...Object.values(composeStories(chatMessage))];

export const ChatMessage = (): JSX.Element => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.4">
      {allStories.map((Story) => {
        return (
          <>
            <Heading>{Story.storyName}</Heading>
            <Story />
          </>
        );
      })}
    </Box>
  );
};

export default {
  title: 'Components/KitchenSink/ChatMessage',
  component: ChatMessage,
  parameters: {
    // enable Chromatic's snapshots only for kitchen sink
    chromatic: { disableSnapshot: false },
    options: { showPanel: false },
  },
};
