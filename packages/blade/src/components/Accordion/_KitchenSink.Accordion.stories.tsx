import { composeStories } from '@storybook/react-vite';

import { Box } from '~components/Box';
import { Heading } from '~components/Typography';

import * as accordionStories from './Accordion.stories';

const allStories = Object.values(composeStories(accordionStories));

export const Accordion = (): JSX.Element => {
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
  title: 'Components/KitchenSink/Accordion',
  component: Accordion,
  parameters: {
    // enable Chromatic's snapshotting only for kitchensink
    chromatic: { disableSnapshot: false },
    options: { showPanel: false },
  },
};
