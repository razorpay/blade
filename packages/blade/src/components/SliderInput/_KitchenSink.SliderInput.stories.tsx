import { composeStories } from '@storybook/react-vite';
import * as sliderInputStories from './SliderInput.stories';
import { Box } from '~components/Box';
import { Heading } from '~components/Typography';

const allStories = Object.values(composeStories(sliderInputStories));

export const SliderInput = (): JSX.Element => {
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
  title: 'Components/KitchenSink/SliderInput',
  component: SliderInput,
  parameters: {
    chromatic: { disableSnapshot: false },
    options: { showPanel: false },
  },
};
