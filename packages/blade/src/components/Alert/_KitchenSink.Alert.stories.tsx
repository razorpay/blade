import { composeStories } from '@storybook/react-vite';

import { Box } from '~components/Box';
import { Heading } from '~components/Typography';

import * as alertStories from './Alert.stories';

const allStories = Object.values(composeStories(alertStories));

export const Alert = (): JSX.Element => {
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
  title: 'Components/KitchenSink/Alert',
  component: Alert,
  parameters: {
    // enable Chromatic's snapshotting only for kitchensink
    chromatic: { disableSnapshot: false },
    options: { showPanel: false },
  },
};
