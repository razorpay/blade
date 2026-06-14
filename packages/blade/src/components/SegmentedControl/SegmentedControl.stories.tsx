import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import { SegmentedControl } from './SegmentedControl';
import { SegmentedControlItem } from './SegmentedControlItem';
import type { SegmentedControlProps } from './types';
import { Box } from '~components/Box';
import { CalendarIcon, ClockIcon, RepeatIcon, SettingsIcon } from '~components/Icons';

export default {
  title: 'Components/SegmentedControl',
  component: SegmentedControl,
  args: {
    size: 'medium',
    isDisabled: false,
    isFullWidth: false,
    labelPosition: 'top',
    validationState: 'none',
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['medium', 'large'],
    },
    labelPosition: {
      control: { type: 'select' },
      options: ['top', 'left'],
    },
    validationState: {
      control: { type: 'select' },
      options: ['none', 'error', 'success'],
    },
  },
} as Meta<SegmentedControlProps>;

const BasicTemplate: StoryFn<SegmentedControlProps> = (args) => {
  return (
    <Box maxWidth="400px">
      <SegmentedControl {...args} label="Billing duration" name="billing">
        <SegmentedControlItem value="monthly" label="Monthly" />
        <SegmentedControlItem value="quarterly" label="Quarterly" />
        <SegmentedControlItem value="yearly" label="Yearly" />
      </SegmentedControl>
    </Box>
  );
};

export const Default = BasicTemplate.bind({});

const WithIconsTemplate: StoryFn<SegmentedControlProps> = (args) => {
  return (
    <Box maxWidth="500px">
      <SegmentedControl {...args} label="Billing duration" name="billing">
        <SegmentedControlItem value="until-cancelled" label="Until cancelled" icon={CalendarIcon} />
        <SegmentedControlItem value="fixed-cycles" label="Fixed cycles" icon={RepeatIcon} />
      </SegmentedControl>
    </Box>
  );
};

export const WithIcons = WithIconsTemplate.bind({});

const ControlledTemplate: StoryFn<SegmentedControlProps> = (args) => {
  const [value, setValue] = React.useState('monthly');
  return (
    <Box maxWidth="400px">
      <SegmentedControl
        {...args}
        label="Billing frequency"
        name="frequency"
        value={value}
        onChange={({ value: v }) => setValue(v)}
      >
        <SegmentedControlItem value="monthly" label="Monthly" />
        <SegmentedControlItem value="quarterly" label="Quarterly" />
        <SegmentedControlItem value="yearly" label="Yearly" />
      </SegmentedControl>
      <Box marginTop="spacing.4">
        <code>Selected: {value}</code>
      </Box>
    </Box>
  );
};

export const Controlled = ControlledTemplate.bind({});

const SizesTemplate: StoryFn<SegmentedControlProps> = () => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.6" maxWidth="400px">
      <SegmentedControl label="Medium size" size="medium" name="medium-example">
        <SegmentedControlItem value="option1" label="Option 1" />
        <SegmentedControlItem value="option2" label="Option 2" />
        <SegmentedControlItem value="option3" label="Option 3" />
      </SegmentedControl>
      <SegmentedControl label="Large size" size="large" name="large-example">
        <SegmentedControlItem value="option1" label="Option 1" />
        <SegmentedControlItem value="option2" label="Option 2" />
        <SegmentedControlItem value="option3" label="Option 3" />
      </SegmentedControl>
    </Box>
  );
};

export const Sizes = SizesTemplate.bind({});

const DisabledTemplate: StoryFn<SegmentedControlProps> = () => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.6" maxWidth="400px">
      <SegmentedControl label="Fully disabled" isDisabled defaultValue="option1" name="disabled">
        <SegmentedControlItem value="option1" label="Option 1" />
        <SegmentedControlItem value="option2" label="Option 2" />
        <SegmentedControlItem value="option3" label="Option 3" />
      </SegmentedControl>
      <SegmentedControl label="Item disabled" defaultValue="option1" name="item-disabled">
        <SegmentedControlItem value="option1" label="Option 1" />
        <SegmentedControlItem value="option2" label="Option 2" isDisabled />
        <SegmentedControlItem value="option3" label="Option 3" />
      </SegmentedControl>
    </Box>
  );
};

export const Disabled = DisabledTemplate.bind({});

const ValidationTemplate: StoryFn<SegmentedControlProps> = () => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.6" maxWidth="400px">
      <SegmentedControl label="With help text" helpText="Choose a billing cycle" name="help">
        <SegmentedControlItem value="monthly" label="Monthly" />
        <SegmentedControlItem value="yearly" label="Yearly" />
      </SegmentedControl>
      <SegmentedControl
        label="Error state"
        validationState="error"
        errorText="Please select a billing duration"
        name="error"
      >
        <SegmentedControlItem value="monthly" label="Monthly" />
        <SegmentedControlItem value="yearly" label="Yearly" />
      </SegmentedControl>
      <SegmentedControl
        label="Success state"
        validationState="success"
        helpText="Selection confirmed"
        defaultValue="monthly"
        name="success"
      >
        <SegmentedControlItem value="monthly" label="Monthly" />
        <SegmentedControlItem value="yearly" label="Yearly" />
      </SegmentedControl>
    </Box>
  );
};

export const Validation = ValidationTemplate.bind({});

const FullWidthTemplate: StoryFn<SegmentedControlProps> = () => {
  return (
    <Box maxWidth="600px">
      <SegmentedControl label="Full width" isFullWidth name="fullwidth">
        <SegmentedControlItem value="day" label="Day" icon={CalendarIcon} />
        <SegmentedControlItem value="week" label="Week" icon={ClockIcon} />
        <SegmentedControlItem value="month" label="Month" icon={RepeatIcon} />
        <SegmentedControlItem value="year" label="Year" icon={SettingsIcon} />
      </SegmentedControl>
    </Box>
  );
};

export const FullWidth = FullWidthTemplate.bind({});

const LabelPositionTemplate: StoryFn<SegmentedControlProps> = () => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.6" maxWidth="500px">
      <SegmentedControl label="Top label" labelPosition="top" name="top-label">
        <SegmentedControlItem value="option1" label="Option 1" />
        <SegmentedControlItem value="option2" label="Option 2" />
      </SegmentedControl>
      <SegmentedControl label="Left label" labelPosition="left" name="left-label">
        <SegmentedControlItem value="option1" label="Option 1" />
        <SegmentedControlItem value="option2" label="Option 2" />
      </SegmentedControl>
    </Box>
  );
};

export const LabelPosition = LabelPositionTemplate.bind({});
