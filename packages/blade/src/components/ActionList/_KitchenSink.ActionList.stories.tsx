import { composeStories } from '@storybook/react';
import * as actionListStories from './ActionList.stories';
import { Box } from '~components/Box';
import { Heading } from '~components/Typography';

const allStories = Object.values(composeStories(actionListStories));

export const ActionList = (): JSX.Element => {
  return (
    (<Box display="flex" flexDirection="column" gap="spacing.4">
      {allStories.map((Story) => {
        return (<>
          <Text size="large">{Story.storyName}</Text>
          <Story />
        </>);
      })}
    </Box>)
  );
};

export default {
  title: 'Components/KitchenSink/ActionList',
  component: ActionList,
  parameters: {
    // enable Chromatic's snapshotting only for kitchensink
    chromatic: { disableSnapshot: false },
    options: { showPanel: false },
  },
};
