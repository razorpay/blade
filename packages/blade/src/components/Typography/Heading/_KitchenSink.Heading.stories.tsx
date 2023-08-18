import { composeStories } from '@storybook/react';
import * as headingStories from './Heading.stories';
import { Box } from '~components/Box';
import { Heading as HeadingComponent } from '~components/Typography';

const allStories = Object.values(composeStories(headingStories));

export const Heading = (): JSX.Element => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.4">
      {allStories.map((Story) => {
        return (
          <>
            <HeadingComponent>{Story.storyName}</HeadingComponent>
            <Story />
          </>
        );
      })}
    </Box>
  );
};

export default {
  title: 'Components/KitchenSink/Heading',
  component: Heading,
  parameters: {
    // enable Chromatic's snapshotting only for kitchensink
    chromatic: { disableSnapshot: false },
    options: { showPanel: false },
  },
};
