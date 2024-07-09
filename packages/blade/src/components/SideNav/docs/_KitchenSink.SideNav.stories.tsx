/* eslint-disable @typescript-eslint/no-explicit-any */
import { composeStories } from '@storybook/react';

import * as tabsStories from './SideNav.stories';
import { Box } from '~components/Box';
import { Heading } from '~components/Typography';

const allStories = Object.values(composeStories(tabsStories));

export const SideNav = (): JSX.Element => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.4">
      {allStories
        .filter((Story) => Story.storyName?.includes('Dashboard'))
        .map((Story) => {
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
  title: 'Components/KitchenSink/SideNav',
  component: SideNav,
  parameters: {
    // enable Chromatic's snapshotting only for kitchensink
    chromatic: { disableSnapshot: false },
    options: { showPanel: false },
    // eslint-disable-next-line babel/new-cap
    // decorators: [StoryRouter(undefined, { initialEntries: ['/settings/user/home'] })] as unknown,
  },
};
