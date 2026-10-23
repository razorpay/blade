import { composeStories } from '@storybook/react-vite';
import React from 'react';
import * as chatInput from './ChatInput.stories';
import { Box } from '~components/Box';
import { Heading } from '~components/Typography';

// Static stories only: the chat and playground stories run timers and rotating suggestions, which
// would make Chromatic snapshots flaky
const { Default, Disabled, WithValidationError, SizeComparison } = composeStories(chatInput);
const stories = [Default, Disabled, WithValidationError, SizeComparison];

export const ChatInput = (): React.ReactElement => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.4">
      {stories.map((Story) => (
        <React.Fragment key={Story.storyName}>
          <Heading>{Story.storyName}</Heading>
          <Story />
        </React.Fragment>
      ))}
    </Box>
  );
};

export default {
  title: 'Components/KitchenSink/ChatInput',
  component: ChatInput,
  parameters: {
    // enable Chromatic's snapshots only for kitchen sink
    chromatic: { disableSnapshot: false },
    options: { showPanel: false },
  },
};
