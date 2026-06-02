import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import { Slider } from './';
import type { SliderProps } from './';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';

export default {
  title: 'Components/Slider',
  component: Slider,
  args: {
    label: 'Volume',
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 40,
    size: 'medium',
    labelPosition: 'top',
    isDisabled: false,
    isRequired: false,
    validationState: 'none',
  },
  argTypes: {
    value: { control: { disable: true } },
    onChange: { action: 'onChange' },
  },
} as Meta<SliderProps>;

const Template: StoryFn<SliderProps> = (args) => (
  <Box maxWidth="400px">
    <Slider {...args} />
  </Box>
);

export const Basic = Template.bind({});
Basic.storyName = 'Basic (uncontrolled)';

export const Controlled: StoryFn<SliderProps> = () => {
  const [value, setValue] = React.useState(40);
  return (
    <Box maxWidth="400px" display="flex" flexDirection="column" gap="spacing.4">
      <Slider
        label="Controlled slider"
        value={value}
        min={0}
        max={100}
        onChange={({ value: v }) => setValue(v)}
      />
      <Text>Current value: {value}</Text>
    </Box>
  );
};

export const Sizes: StoryFn = () => (
  <Box display="flex" flexDirection="column" gap="spacing.6" maxWidth="400px">
    <Slider label="Medium (default)" size="medium" defaultValue={50} />
    <Slider label="Large" size="large" defaultValue={50} />
  </Box>
);

export const LabelPositions: StoryFn = () => (
  <Box display="flex" flexDirection="column" gap="spacing.6" maxWidth="400px">
    <Slider label="Label on top" labelPosition="top" defaultValue={30} />
    <Slider label="Label on left" labelPosition="left" defaultValue={60} />
  </Box>
);

export const WithHelpText = Template.bind({});
WithHelpText.args = {
  label: 'Zoom level',
  helpText: 'Drag to adjust zoom',
  defaultValue: 50,
};

export const ErrorState = Template.bind({});
ErrorState.args = {
  label: 'Confidence threshold',
  validationState: 'error',
  errorText: 'Value must be between 10 and 90',
  defaultValue: 5,
};

export const Disabled = Template.bind({});
Disabled.args = {
  label: 'Disabled slider',
  isDisabled: true,
  defaultValue: 60,
};

export const Required = Template.bind({});
Required.args = {
  label: 'Required slider',
  isRequired: true,
  defaultValue: 50,
};

export const MinMaxStep: StoryFn = () => (
  <Box display="flex" flexDirection="column" gap="spacing.6" maxWidth="400px">
    <Slider label="Step 10" min={0} max={100} step={10} defaultValue={50} />
    <Slider label="Step 0.5" min={0} max={5} step={0.5} defaultValue={2.5} />
    <Slider label="Negative range" min={-50} max={50} step={5} defaultValue={0} />
  </Box>
);
