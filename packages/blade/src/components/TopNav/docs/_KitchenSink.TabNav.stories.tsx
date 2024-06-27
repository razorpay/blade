import { composeStories } from '@storybook/react';

import * as tabNavStories from './TabNav.stories';
import { Box } from '~components/Box';

const allStories = Object.values(composeStories(tabNavStories));

export const TabNav = (): JSX.Element => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.4">
      {allStories.map((Story, index) => {
        return <Story key={index} />;
      })}
    </Box>
  );
};

export default {
  title: 'Components/KitchenSink/TabNav',
  component: TabNav,
  parameters: {
    // enable Chromatic's snapshotting only for kitchensink
    chromatic: { disableSnapshot: false },
    options: { showPanel: false },
  },
};
