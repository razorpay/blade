import { composeStories } from '@storybook/react';
import * as listView from './ListView.stories';
import { Box } from '~components/Box';
import { Heading } from '~components/Typography';

const allStories = [...Object.values(composeStories(listView))];

export const ListView = (): JSX.Element => {
  return (
    <Box>
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
  title: 'Patterns/ListView',
  component: ListView,
  parameters: {
    // enable Chromatic's snapshots only for kitchen sink
    chromatic: { disableSnapshot: false },
    options: { showPanel: false },
  },
};
