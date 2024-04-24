import { composeStories } from '@storybook/react';
import * as stepGroupStories from './StepGroup.stories';
import { Box } from '~components/Box';
import { Heading } from '~components/Typography';

const allStories = Object.values(composeStories(stepGroupStories)).filter(
  (Story) => Story.storyName !== 'StepGroupWithReactRouter',
);

export const StepGroup = (): JSX.Element => {
  return (
    <Box display="flex" flexDirection="row" gap="spacing.4" flexWrap="wrap" width="100%">
      {allStories.map((Story) => {
        return (
          <Box key={Story.storyName}>
            <Heading>{Story.storyName}</Heading>
            <Story minWidth="300px" />
          </Box>
        );
      })}
    </Box>
  );
};

export default {
  title: 'Components/KitchenSink/StepGroup',
  component: StepGroup,
  parameters: {
    // enable Chromatic's snapshotting only for kitchensink
    chromatic: { disableSnapshot: false },
    options: { showPanel: false },
  },
};
