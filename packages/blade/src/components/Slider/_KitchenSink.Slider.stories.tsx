import { composeStories } from '@storybook/react-vite';
import * as sliderStories from './Slider.stories';
import { Box } from '~components/Box';
import { Heading } from '~components/Typography';

const allStories = Object.values(composeStories(sliderStories));

export const Slider = (): JSX.Element => (
  <Box display="flex" flexDirection="column" gap="spacing.6">
    {allStories.map((Story) => (
      <Box key={Story.storyName} display="flex" flexDirection="column" gap="spacing.4">
        <Heading>{Story.storyName}</Heading>
        <Story />
      </Box>
    ))}
  </Box>
);

export default {
  title: 'Components/KitchenSink/Slider',
  component: Slider,
  parameters: {
    chromatic: { disableSnapshot: false },
    options: { showPanel: false },
  },
};
