import { composeStories } from '@storybook/react';
import * as visuallyHiddenStories from './VisuallyHidden.stories';
import { Box } from '~components/Box';
import { Heading } from '~components/Typography';

const allStories = Object.values(composeStories(visuallyHiddenStories));

export const VisuallyHidden = (): JSX.Element => {
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
  title: 'Components/KitchenSink/VisuallyHidden',
  component: VisuallyHidden,
  parameters: {
    // enable Chromatic's snapshotting only for kitchensink
    chromatic: { disableSnapshot: false },
    options: { showPanel: false },
  },
};
