import { composeStories } from '@storybook/react';
import * as fileUploadStories from './FileUpload.stories';
import { Box } from '~components/Box';
import { Heading } from '~components/Typography';

const allStories = Object.values(composeStories(fileUploadStories));

export const FileUpload = (): JSX.Element => {
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
  title: 'Components/KitchenSink/FileUpload',
  component: FileUpload,
  parameters: {
    // enable Chromatic's snapshots only for kitchen sink
    chromatic: { disableSnapshot: false },
    options: { showPanel: false },
  },
};
