import { composeStories } from '@storybook/react-vite';

import { Box } from '~components/Box';
import { Heading } from '~components/Typography';

import * as tabsStories from './Tabs.stories';

const allStories = Object.values(composeStories(tabsStories));

export const Tabs = (): JSX.Element => {
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
  title: 'Components/KitchenSink/Tabs',
  component: Tabs,
  parameters: {
    // enable Chromatic's snapshotting only for kitchensink
    chromatic: { disableSnapshot: false },
    options: { showPanel: false },
  },
};
