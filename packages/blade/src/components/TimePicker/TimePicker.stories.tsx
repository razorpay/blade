import React, { useState } from 'react';
import type { StoryFn, Meta } from '@storybook/react';
import { TimePicker } from './TimePicker';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';

export default {
  title: 'Components/TimePicker',
  component: TimePicker,
  parameters: {
    docs: {
      description: {
        component:
          "A TimePicker component that uses Mantine's TimeInput with a custom dropdown interface built using Blade components.",
      },
    },
  },
} as Meta<typeof TimePicker>;

// Basic TimePicker example
export const Basic: StoryFn<typeof TimePicker> = () => {
  const [time, setTime] = useState(null);

  return (
    <Box padding="spacing.5" maxWidth="400px">
      <TimePicker
        label="Select Timeeee"
        value={time}
        onChange={(newTime) => {
          setTime(newTime);
          console.log('Selected time:', newTime);
        }}
      />
      <Text marginTop="spacing.3" size="small" color="surface.text.gray.muted">
        Selected: {time || 'None'}
      </Text>
    </Box>
  );
};

Basic.args = {
  label: 'Select Time',
  placeholder: 'Choose a time',
};
