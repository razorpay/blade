import { composeStories } from '@storybook/react';
import * as otpInputStories from './OTPInput.stories';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';

const allStories = Object.values(composeStories(otpInputStories));

export const AllStories = (): JSX.Element => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.4">
      {allStories.map((Story) => {
        return (
          <>
            <Text>{Story.storyName}</Text>
            <Story />
          </>
        );
      })}
    </Box>
  );
};

export default {
  title: 'Components/KitchenSink/OTPInput',
  component: AllStories,
  parameters: {
    // enable Chromatic's snapshotting only for kitchensink
    chromatic: { disableSnapshot: false },
    options: { showPanel: false },
  },
};
