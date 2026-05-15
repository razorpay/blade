/* eslint-disable @typescript-eslint/no-explicit-any */
import { composeStories } from '@storybook/react-vite';

import { Box } from '~components/Box';
import { Heading } from '~components/Typography';

import * as menuStories from './Menu.stories';

const allStories = Object.values(composeStories(menuStories));

export const Menu = (): JSX.Element => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.4">
      {allStories.map((Story) => {
        return (
          <>
            <Heading>{Story.storyName}</Heading>
            <Story isOpen={true} />
          </>
        );
      })}
    </Box>
  );
};

export default {
  title: 'Components/KitchenSink/Menu',
  component: Menu,
  parameters: {
    // enable Chromatic's snapshotting only for kitchensink
    chromatic: { disableSnapshot: false, delay: 700 },
    options: { showPanel: false },
  },
};
