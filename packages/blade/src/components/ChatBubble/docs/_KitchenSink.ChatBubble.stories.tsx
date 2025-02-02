import { composeStories } from '@storybook/react';
import * as chatBubble from './ChatBubble.stories';
import { Box } from '~components/Box';
import { Heading } from '~components/Typography';

const allStories = [...Object.values(composeStories(chatBubble))];

export const ChatBubble = (): JSX.Element => {
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
  title: 'Components/KitchenSink/ChatBubble',
  component: ChatBubble,
  parameters: {
    // enable Chromatic's snapshots only for kitchen sink
    chromatic: { disableSnapshot: false },
    options: { showPanel: false },
  },
};
