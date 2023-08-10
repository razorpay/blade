import { composeStories } from '@storybook/react';
import * as boxStories from './Box.stories';
import { Box as BoxComponent } from '~components/Box';
import { Heading } from '~components/Typography';

const allStories = Object.values(composeStories(boxStories));

export const Box = (): JSX.Element => {
  return (
    <BoxComponent display="flex" flexDirection="column" gap="spacing.4">
      {allStories.map((Story) => {
        return (
          <>
            <Heading>{Story.storyName}</Heading>
            <Story />
          </>
        );
      })}
    </BoxComponent>
  );
};

export default {
  title: 'Components/KitchenSink/Box',
  component: Box,
  parameters: {
    // enable Chromatic's snapshotting only for kitchensink
    chromatic: { disableSnapshot: false },
    options: { showPanel: false },
  },
};
