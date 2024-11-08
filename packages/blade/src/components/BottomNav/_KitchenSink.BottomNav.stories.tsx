import { composeStories } from '@storybook/react';
import * as bottomNavStories from './BottomNav.stories';
import { Box } from '~components/Box';
import { Heading } from '~components/Typography';

const allStories = Object.values(composeStories(bottomNavStories));

export const BottomNav = (): JSX.Element => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.4">
      {allStories.map((Story) => {
        return (
          <>
            <Heading>{Story.storyName}</Heading>
            <Story position="relative" />
          </>
        );
      })}
    </Box>
  );
};

export default {
  title: 'Components/KitchenSink/BottomNav',
  component: BottomNav,
  parameters: {
    // enable Chromatic's snapshotting only for kitchensink
    chromatic: { disableSnapshot: false },
    options: { showPanel: false },
  },
};
