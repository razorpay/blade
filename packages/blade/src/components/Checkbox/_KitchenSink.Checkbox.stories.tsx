import { composeStories } from '@storybook/react';
import * as checkboxStories from './Checkbox.stories';
import * as checkboxGroupStories from './CheckboxGroup.stories';
import { Box } from '~components/Box';
import { Heading } from '~components/Typography';

const allStories = [
  ...Object.values(composeStories(checkboxStories)),
  ...Object.values(composeStories(checkboxGroupStories)),
];

export const Checkbox = (): JSX.Element => {
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
  title: 'Components/KitchenSink/Checkbox',
  component: Checkbox,
  parameters: {
    // enable Chromatic's snapshotting only for kitchensink
    chromatic: { disableSnapshot: false },
    options: { showPanel: false },
  },
};
