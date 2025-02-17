import { composeStories } from '@storybook/react';
import * as QuickFilterGroupStories from './QuickFilter.stories';
import { Box } from '~components/Box';
import { Heading } from '~components/Typography';

const allStories = [...Object.values(composeStories(QuickFilterGroupStories))];

export const QuickFilter = (): JSX.Element => {
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
  title: 'Components/KitchenSink/QuickFilter',
  component: QuickFilter,
  parameters: {
    // enable Chromatic's snapshots only for kitchen sink
    chromatic: { disableSnapshot: false },
    options: { showPanel: false },
  },
};
