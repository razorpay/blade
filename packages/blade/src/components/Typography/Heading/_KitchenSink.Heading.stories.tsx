import { composeStories } from '@storybook/react';
import * as headingStories from './Heading.stories';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';

const allStories = Object.values(composeStories(headingStories));

export const AllStories = (): JSX.Element => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.4">
      {allStories.map((Story) => {
        return (
          <>
            <Text>{Story.storyName}</Text>
            <Story />
          </>
        );
      })}
    </Box>
  );
};

export default {
  title: 'Components/KitchenSink/Heading',
  component: AllStories,
  parameters: {
    // enable Chromatic's snapshotting only for kitchensink
    chromatic: { disableSnapshot: false },
    options: { showPanel: false },
  },
};
