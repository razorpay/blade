import React from 'react';
import { composeStories } from '@storybook/react-vite';
import * as sliderInputStories from './Slider.stories';
import { Box } from '~components/Box';
import { Heading } from '~components/Typography';

const allStories = Object.values(composeStories(sliderInputStories));

export const Slider = (): JSX.Element => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.4">
      {allStories.map((Story) => {
        return (
          <React.Fragment key={Story.storyName}>
            <Heading>{Story.storyName}</Heading>
            <Story />
          </React.Fragment>
        );
      })}
    </Box>
  );
};

export default {
  title: 'Components/KitchenSink/Slider',
  component: Slider,
  parameters: {
    chromatic: { disableSnapshot: false },
    options: { showPanel: false },
  },
};
