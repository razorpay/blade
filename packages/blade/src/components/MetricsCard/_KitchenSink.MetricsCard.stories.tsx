import React from 'react';
import { composeStories } from '@storybook/react-vite';
import * as metricsCardStories from './MetricsCard.stories';
import { Box } from '~components/Box';
import { Heading } from '~components/Typography';

type KitchenSinkStory = React.ComponentType & {
  storyName?: string;
  name?: string;
};

const allStories: KitchenSinkStory[] = Object.values(composeStories(metricsCardStories));

export const MetricsCard = (): JSX.Element => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.6">
      {allStories.map((Story) => {
        const storyName = Story.storyName ?? Story.name;

        return (
          <Box key={storyName} display="flex" flexDirection="column" gap="spacing.4">
            <Heading>{storyName}</Heading>
            <Story />
          </Box>
        );
      })}
    </Box>
  );
};

export default {
  title: 'Components/KitchenSink/MetricsCard',
  component: MetricsCard,
  parameters: {
    // enable Chromatic's snapshotting only for kitchensink
    chromatic: { disableSnapshot: false },
    options: { showPanel: false },
  },
};
