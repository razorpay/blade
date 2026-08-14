import { composeStories } from '@storybook/react-vite';
import * as treeViewStories from './TreeView.stories';
import { Box } from '~components/Box';
import { Heading } from '~components/Typography';

const allStories = Object.values(composeStories(treeViewStories));

export const TreeView = (): JSX.Element => {
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
  title: 'Components/KitchenSink/TreeView',
  component: TreeView,
  parameters: {
    // enable Chromatic's snapshotting only for kitchensink
    chromatic: { disableSnapshot: false },
    options: { showPanel: false },
  },
};
