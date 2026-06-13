import { composeStories } from '@storybook/react-vite';
import * as sectionSeparatorStories from './SectionSeparator.stories';
import { Box } from '~components/Box';
import { Heading } from '~components/Typography';

const allStories = Object.values(composeStories(sectionSeparatorStories));

export const SectionSeparator = (): JSX.Element => {
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
  title: 'Components/KitchenSink/SectionSeparator',
  component: SectionSeparator,
  parameters: {
    chromatic: { disableSnapshot: false },
    options: { showPanel: false },
  },
};
