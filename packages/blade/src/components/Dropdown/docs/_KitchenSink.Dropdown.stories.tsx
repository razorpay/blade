import { composeStories } from '@storybook/react';
import * as dropddownWithButtonStories from './DropdownWithButton.stories';
import * as dropddownWithSelectStories from './DropdownWithSelect.stories';
import { Box } from '~components/Box';
import { Heading } from '~components/Typography';

const allStories = [
  // ...Object.values(composeStories(dropddownWithButtonStories)),
  ...Object.values(composeStories(dropddownWithSelectStories)),
];

export const Dropdown = (): JSX.Element => {
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
  title: 'Components/KitchenSink/Dropdown',
  component: Dropdown,
  parameters: {
    // enable Chromatic's snapshotting only for kitchensink
    chromatic: { disableSnapshot: false },
    options: { showPanel: false },
  },
};
