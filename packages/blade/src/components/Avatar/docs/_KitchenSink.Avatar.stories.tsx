import { composeStories } from '@storybook/react';
import * as avatarGroupStories from './AvatarGroup.stories';
import * as avatarStories from './Avatar.stories';
import { Box } from '~components/Box';
import { Heading } from '~components/Typography';

const allStories = [
  ...Object.values(composeStories(avatarStories)),
  ...Object.values(composeStories(avatarGroupStories)),
];

export const Avatar = (): JSX.Element => {
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
  title: 'Components/KitchenSink/Avatar',
  component: Avatar,
  parameters: {
    // enable Chromatic's snapshots only for kitchen sink
    chromatic: { disableSnapshot: false },
    options: { showPanel: false },
  },
};
