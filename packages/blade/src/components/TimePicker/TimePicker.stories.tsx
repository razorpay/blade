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
          "A modern TimePicker component that uses Mantine's TimeInput with Floating UI's navigation system for accessibility and keyboard navigation.",
      },
    },
  },
} as Meta<typeof TimePicker>;

// Basic 12-hour TimePicker example
export const Basic: StoryFn<typeof TimePicker> = () => {
  const [time, setTime] = useState<Date | null>(null);

  return (
    <Box padding="spacing.5" maxWidth="400px">
      <TimePicker
        label="Select Time"
        size="medium"
        value={time}
        minuteStep={15}
        onChange={({ value }) => {
          setTime(value);
          console.log('Selected time:', value);
        }}
      />
      <Text marginTop="spacing.3" size="small" color="surface.text.gray.muted">
        Selected: {time ? time.toLocaleTimeString() : 'None'}
      </Text>
    </Box>
  );
};

// 24-hour format example
export const TwentyFourHour: StoryFn<typeof TimePicker> = () => {
  const [time, setTime] = useState<Date | null>(null);

  return (
    <Box padding="spacing.5" maxWidth="400px">
      <TimePicker
        label="Select Time (24h)"
        value={time}
        onChange={({ value }) => {
          setTime(value);
          console.log('Selected time:', value);
        }}
      />
      <Text marginTop="spacing.3" size="small" color="surface.text.gray.muted">
        Selected: {time ? time.toLocaleTimeString([], { hour12: false }) : 'None'}
      </Text>
    </Box>
  );
};

// Disabled state
export const Disabled: StoryFn<typeof TimePicker> = () => {
  return (
    <Box padding="spacing.5" maxWidth="400px">
      <TimePicker label="Disabled TimePicker" placeholder="Cannot select time" isDisabled={true} />
    </Box>
  );
};

// Without action buttons (streamlined experience)
export const WithoutActions: StoryFn<typeof TimePicker> = () => {
  const [time, setTime] = useState<Date | null>(null);

  return (
    <Box padding="spacing.5" maxWidth="400px">
      <TimePicker
        label="Quick Time Selection"
        value={time}
        onChange={({ value }) => {
          setTime(value);
          console.log('Selected time:', value);
        }}
        onApply={({ value }) => {
          console.log('Applied time:', value);
        }}
        showFooterActions={false}
      />
      <Text marginTop="spacing.3" size="small" color="surface.text.gray.muted">
        Selected: {time ? time.toLocaleTimeString() : 'None'}
      </Text>
      <Text marginTop="spacing.2" size="small" color="surface.text.gray.muted">
        Click any time value or press Enter to apply immediately
      </Text>
    </Box>
  );
};

Basic.args = {
  label: 'Select Time',
  placeholder: 'Choose a time',
};
