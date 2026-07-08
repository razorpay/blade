import { composeStories } from '@storybook/react-vite';
import * as datePickerStories from './DatePicker.stories';
import { Box } from '~components/Box';
import { Heading } from '~components/Typography';

const allStories = Object.values(composeStories(datePickerStories));

export const DatePicker = (): JSX.Element => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.7">
      {allStories.map((Story) => {
        return (
          <Box key={Story.storyName} display="flex" flexDirection="column" gap="spacing.4">
            <Heading>{Story.storyName}</Heading>
            <Story />
          </Box>
        );
      })}
    </Box>
  );
};

export default {
  title: 'Components/KitchenSink/DatePicker',
  component: DatePicker,
  parameters: {
    // enable Chromatic's snapshotting only for kitchensink
    // delay allows dynamic dayjs locale scripts and popups to settle before snapshot
    chromatic: { disableSnapshot: false, delay: 700 },
    options: { showPanel: false },
  },
};
