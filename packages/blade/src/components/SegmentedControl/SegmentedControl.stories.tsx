import type { StoryFn, Meta } from '@storybook/react-vite';
import React from 'react';
import type { SegmentedControlProps } from './types';
import { SegmentedControl } from './SegmentedControl';
import { SegmentedControlItem } from './SegmentedControlItem';
import { Box } from '~components/Box';
import { Text, Heading } from '~components/Typography';
import { CalendarIcon, ClockIcon, TrendingUpIcon, ListIcon, LayoutIcon } from '~components/Icons';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Sandbox } from '~utils/storybook/Sandbox';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentDescription="SegmentedControl allows users to select a single option from a set of 2-5 options, displayed as a horizontal group of buttons."
      componentName="SegmentedControl"
      imports={`import { SegmentedControl, SegmentedControlItem } from '@razorpay/blade/components';`}
    >
      <Heading size="large">Usage</Heading>
      <Sandbox editorHeight={300}>
        {`
          import { Box, SegmentedControl, SegmentedControlItem } from '@razorpay/blade/components';

          function App() {
            return (
              <Box padding="spacing.5">
                <SegmentedControl defaultValue="daily" label="Time Period">
                  <SegmentedControlItem value="daily">Daily</SegmentedControlItem>
                  <SegmentedControlItem value="weekly">Weekly</SegmentedControlItem>
                  <SegmentedControlItem value="monthly">Monthly</SegmentedControlItem>
                </SegmentedControl>
              </Box>
            )
          }

          export default App;
        `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

export default {
  title: 'Components/SegmentedControl',
  component: SegmentedControl,
  tags: ['autodocs'],
  parameters: {
    docs: {
      page: Page,
    },
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    isDisabled: {
      control: { type: 'boolean' },
    },
    label: {
      control: { type: 'text' },
    },
    labelPosition: {
      control: { type: 'select' },
      options: ['top', 'left'],
    },
    helpText: {
      control: { type: 'text' },
    },
    errorText: {
      control: { type: 'text' },
    },
    validationState: {
      control: { type: 'select' },
      options: ['none', 'error'],
    },
    necessityIndicator: {
      control: { type: 'select' },
      options: ['none', 'required', 'optional'],
    },
    isRequired: {
      control: { type: 'boolean' },
    },
    name: {
      control: { type: 'text' },
    },
    defaultValue: {
      control: { type: 'text' },
    },
    value: {
      table: { disable: true },
    },
    onChange: {
      table: { disable: true },
    },
    children: {
      table: { disable: true },
    },
  },
} as Meta<SegmentedControlProps>;

const DefaultTemplate: StoryFn<SegmentedControlProps> = (args) => {
  return (
    <Box padding="spacing.5">
      <SegmentedControl {...args} defaultValue={args.defaultValue || 'daily'}>
        <SegmentedControlItem value="daily">Daily</SegmentedControlItem>
        <SegmentedControlItem value="weekly">Weekly</SegmentedControlItem>
        <SegmentedControlItem value="monthly">Monthly</SegmentedControlItem>
      </SegmentedControl>
    </Box>
  );
};

export const Default = DefaultTemplate.bind({});
Default.args = {
  size: 'medium',
  isDisabled: false,
  label: 'Time Period',
  labelPosition: 'top',
  helpText: '',
  errorText: '',
  validationState: 'none',
  necessityIndicator: 'none',
  isRequired: false,
};

export const Sizes: StoryFn<SegmentedControlProps> = () => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.6" padding="spacing.5">
      <Box>
        <Text marginBottom="spacing.3" weight="semibold">
          Small
        </Text>
        <SegmentedControl size="small" defaultValue="daily" accessibilityLabel="Time period">
          <SegmentedControlItem value="daily">Daily</SegmentedControlItem>
          <SegmentedControlItem value="weekly">Weekly</SegmentedControlItem>
          <SegmentedControlItem value="monthly">Monthly</SegmentedControlItem>
        </SegmentedControl>
      </Box>
      <Box>
        <Text marginBottom="spacing.3" weight="semibold">
          Medium
        </Text>
        <SegmentedControl size="medium" defaultValue="daily" accessibilityLabel="Time period">
          <SegmentedControlItem value="daily">Daily</SegmentedControlItem>
          <SegmentedControlItem value="weekly">Weekly</SegmentedControlItem>
          <SegmentedControlItem value="monthly">Monthly</SegmentedControlItem>
        </SegmentedControl>
      </Box>
      <Box>
        <Text marginBottom="spacing.3" weight="semibold">
          Large
        </Text>
        <SegmentedControl size="large" defaultValue="daily" accessibilityLabel="Time period">
          <SegmentedControlItem value="daily">Daily</SegmentedControlItem>
          <SegmentedControlItem value="weekly">Weekly</SegmentedControlItem>
          <SegmentedControlItem value="monthly">Monthly</SegmentedControlItem>
        </SegmentedControl>
      </Box>
    </Box>
  );
};

export const WithIcons: StoryFn<SegmentedControlProps> = () => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.6" padding="spacing.5">
      <Box>
        <Text marginBottom="spacing.3" weight="semibold">
          Icon with label
        </Text>
        <SegmentedControl defaultValue="day" accessibilityLabel="Time view">
          <SegmentedControlItem value="day" leading={CalendarIcon}>
            Day
          </SegmentedControlItem>
          <SegmentedControlItem value="hour" leading={ClockIcon}>
            Hour
          </SegmentedControlItem>
          <SegmentedControlItem value="trend" leading={TrendingUpIcon}>
            Trend
          </SegmentedControlItem>
        </SegmentedControl>
      </Box>
      <Box>
        <Text marginBottom="spacing.3" weight="semibold">
          Icon only
        </Text>
        <SegmentedControl defaultValue="list" accessibilityLabel="View mode">
          <SegmentedControlItem value="list" leading={ListIcon} accessibilityLabel="List view" />
          <SegmentedControlItem value="grid" leading={LayoutIcon} accessibilityLabel="Grid view" />
        </SegmentedControl>
      </Box>
    </Box>
  );
};

export const InContainer: StoryFn<SegmentedControlProps> = () => {
  return (
    <Box padding="spacing.5" width="400px">
      <SegmentedControl defaultValue="overview" accessibilityLabel="Navigation">
        <SegmentedControlItem value="overview">Overview</SegmentedControlItem>
        <SegmentedControlItem value="analytics">Analytics</SegmentedControlItem>
        <SegmentedControlItem value="reports">Reports</SegmentedControlItem>
      </SegmentedControl>
    </Box>
  );
};

export const Disabled: StoryFn<SegmentedControlProps> = () => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.6" padding="spacing.5">
      <Box>
        <Text marginBottom="spacing.3" weight="semibold">
          Entire group disabled
        </Text>
        <SegmentedControl isDisabled defaultValue="daily" accessibilityLabel="Time period">
          <SegmentedControlItem value="daily">Daily</SegmentedControlItem>
          <SegmentedControlItem value="weekly">Weekly</SegmentedControlItem>
          <SegmentedControlItem value="monthly">Monthly</SegmentedControlItem>
        </SegmentedControl>
      </Box>
      <Box>
        <Text marginBottom="spacing.3" weight="semibold">
          Single item disabled
        </Text>
        <SegmentedControl defaultValue="daily" accessibilityLabel="Time period">
          <SegmentedControlItem value="daily">Daily</SegmentedControlItem>
          <SegmentedControlItem value="weekly">Weekly</SegmentedControlItem>
          <SegmentedControlItem value="monthly" isDisabled>
            Monthly
          </SegmentedControlItem>
        </SegmentedControl>
      </Box>
    </Box>
  );
};

export const Controlled: StoryFn<SegmentedControlProps> = () => {
  const [selected, setSelected] = React.useState('weekly');

  return (
    <Box padding="spacing.5">
      <Text marginBottom="spacing.3">Selected: {selected}</Text>
      <SegmentedControl
        value={selected}
        onChange={({ value: v }) => setSelected(v)}
        accessibilityLabel="Time period"
      >
        <SegmentedControlItem value="daily">Daily</SegmentedControlItem>
        <SegmentedControlItem value="weekly">Weekly</SegmentedControlItem>
        <SegmentedControlItem value="monthly">Monthly</SegmentedControlItem>
      </SegmentedControl>
    </Box>
  );
};

export const WithLabel: StoryFn<SegmentedControlProps> = () => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.6" padding="spacing.5">
      <SegmentedControl
        label="Time Period"
        defaultValue="daily"
        helpText="Select how often you'd like reports"
      >
        <SegmentedControlItem value="daily">Daily</SegmentedControlItem>
        <SegmentedControlItem value="weekly">Weekly</SegmentedControlItem>
        <SegmentedControlItem value="monthly">Monthly</SegmentedControlItem>
      </SegmentedControl>

      <SegmentedControl
        label="Frequency"
        defaultValue="daily"
        validationState="error"
        errorText="Please select a valid frequency"
        necessityIndicator="required"
      >
        <SegmentedControlItem value="daily">Daily</SegmentedControlItem>
        <SegmentedControlItem value="weekly">Weekly</SegmentedControlItem>
        <SegmentedControlItem value="monthly">Monthly</SegmentedControlItem>
      </SegmentedControl>

      <SegmentedControl label="View Mode" labelPosition="left" defaultValue="list">
        <SegmentedControlItem value="list">List</SegmentedControlItem>
        <SegmentedControlItem value="grid">Grid</SegmentedControlItem>
      </SegmentedControl>
    </Box>
  );
};

export const Showcase: StoryFn<SegmentedControlProps> = () => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.8" padding="spacing.5">
      {/* Sizes */}
      <Box>
        <Heading size="medium" marginBottom="spacing.4">
          Sizes
        </Heading>
        <Box display="flex" flexDirection="column" gap="spacing.4">
          <Box>
            <Text size="small" color="surface.text.gray.muted" marginBottom="spacing.2">
              Small
            </Text>
            <SegmentedControl size="small" defaultValue="daily" accessibilityLabel="Time period">
              <SegmentedControlItem value="daily">Daily</SegmentedControlItem>
              <SegmentedControlItem value="weekly">Weekly</SegmentedControlItem>
              <SegmentedControlItem value="monthly">Monthly</SegmentedControlItem>
            </SegmentedControl>
          </Box>
          <Box>
            <Text size="small" color="surface.text.gray.muted" marginBottom="spacing.2">
              Medium
            </Text>
            <SegmentedControl size="medium" defaultValue="daily" accessibilityLabel="Time period">
              <SegmentedControlItem value="daily">Daily</SegmentedControlItem>
              <SegmentedControlItem value="weekly">Weekly</SegmentedControlItem>
              <SegmentedControlItem value="monthly">Monthly</SegmentedControlItem>
            </SegmentedControl>
          </Box>
          <Box>
            <Text size="small" color="surface.text.gray.muted" marginBottom="spacing.2">
              Large
            </Text>
            <SegmentedControl size="large" defaultValue="daily" accessibilityLabel="Time period">
              <SegmentedControlItem value="daily">Daily</SegmentedControlItem>
              <SegmentedControlItem value="weekly">Weekly</SegmentedControlItem>
              <SegmentedControlItem value="monthly">Monthly</SegmentedControlItem>
            </SegmentedControl>
          </Box>
        </Box>
      </Box>

      {/* With Icons */}
      <Box>
        <Heading size="medium" marginBottom="spacing.4">
          With Icons
        </Heading>
        <Box display="flex" flexDirection="column" gap="spacing.4">
          <Box>
            <Text size="small" color="surface.text.gray.muted" marginBottom="spacing.2">
              Icon + Label
            </Text>
            <SegmentedControl defaultValue="day" accessibilityLabel="Time view">
              <SegmentedControlItem value="day" leading={CalendarIcon}>
                Day
              </SegmentedControlItem>
              <SegmentedControlItem value="hour" leading={ClockIcon}>
                Hour
              </SegmentedControlItem>
              <SegmentedControlItem value="trend" leading={TrendingUpIcon}>
                Trend
              </SegmentedControlItem>
            </SegmentedControl>
          </Box>
          <Box>
            <Text size="small" color="surface.text.gray.muted" marginBottom="spacing.2">
              Icon Only
            </Text>
            <SegmentedControl defaultValue="list" accessibilityLabel="View mode">
              <SegmentedControlItem
                value="list"
                leading={ListIcon}
                accessibilityLabel="List view"
              />
              <SegmentedControlItem
                value="grid"
                leading={LayoutIcon}
                accessibilityLabel="Grid view"
              />
            </SegmentedControl>
          </Box>
        </Box>
      </Box>

      {/* Disabled States */}
      <Box>
        <Heading size="medium" marginBottom="spacing.4">
          Disabled
        </Heading>
        <Box display="flex" flexDirection="column" gap="spacing.4">
          <Box>
            <Text size="small" color="surface.text.gray.muted" marginBottom="spacing.2">
              Group Disabled
            </Text>
            <SegmentedControl isDisabled defaultValue="daily" accessibilityLabel="Time period">
              <SegmentedControlItem value="daily">Daily</SegmentedControlItem>
              <SegmentedControlItem value="weekly">Weekly</SegmentedControlItem>
              <SegmentedControlItem value="monthly">Monthly</SegmentedControlItem>
            </SegmentedControl>
          </Box>
          <Box>
            <Text size="small" color="surface.text.gray.muted" marginBottom="spacing.2">
              Single Item Disabled
            </Text>
            <SegmentedControl defaultValue="daily" accessibilityLabel="Time period">
              <SegmentedControlItem value="daily">Daily</SegmentedControlItem>
              <SegmentedControlItem value="weekly">Weekly</SegmentedControlItem>
              <SegmentedControlItem value="monthly" isDisabled>
                Monthly
              </SegmentedControlItem>
            </SegmentedControl>
          </Box>
        </Box>
      </Box>

      {/* With Label & Help Text */}
      <Box>
        <Heading size="medium" marginBottom="spacing.4">
          Label & Help Text
        </Heading>
        <Box display="flex" flexDirection="column" gap="spacing.4">
          <SegmentedControl
            label="Report Frequency"
            helpText="Choose how often to receive reports"
            defaultValue="weekly"
          >
            <SegmentedControlItem value="daily">Daily</SegmentedControlItem>
            <SegmentedControlItem value="weekly">Weekly</SegmentedControlItem>
            <SegmentedControlItem value="monthly">Monthly</SegmentedControlItem>
          </SegmentedControl>
        </Box>
      </Box>

      {/* Validation State */}
      <Box>
        <Heading size="medium" marginBottom="spacing.4">
          Validation
        </Heading>
        <Box display="flex" flexDirection="column" gap="spacing.4">
          <SegmentedControl
            label="Priority"
            defaultValue="low"
            validationState="error"
            errorText="High priority items require approval"
            necessityIndicator="required"
          >
            <SegmentedControlItem value="low">Low</SegmentedControlItem>
            <SegmentedControlItem value="medium">Medium</SegmentedControlItem>
            <SegmentedControlItem value="high">High</SegmentedControlItem>
          </SegmentedControl>
        </Box>
      </Box>

      {/* Label Position */}
      <Box>
        <Heading size="medium" marginBottom="spacing.4">
          Label Position
        </Heading>
        <Box display="flex" flexDirection="column" gap="spacing.4">
          <Box>
            <Text size="small" color="surface.text.gray.muted" marginBottom="spacing.2">
              Top (default)
            </Text>
            <SegmentedControl label="Period" defaultValue="daily">
              <SegmentedControlItem value="daily">Daily</SegmentedControlItem>
              <SegmentedControlItem value="weekly">Weekly</SegmentedControlItem>
            </SegmentedControl>
          </Box>
          <Box>
            <Text size="small" color="surface.text.gray.muted" marginBottom="spacing.2">
              Left
            </Text>
            <SegmentedControl label="Period" labelPosition="left" defaultValue="daily">
              <SegmentedControlItem value="daily">Daily</SegmentedControlItem>
              <SegmentedControlItem value="weekly">Weekly</SegmentedControlItem>
            </SegmentedControl>
          </Box>
        </Box>
      </Box>

      {/* Necessity Indicator */}
      <Box>
        <Heading size="medium" marginBottom="spacing.4">
          Necessity Indicator
        </Heading>
        <Box display="flex" flexDirection="column" gap="spacing.4">
          <SegmentedControl label="Required Field" necessityIndicator="required" defaultValue="a">
            <SegmentedControlItem value="a">Option A</SegmentedControlItem>
            <SegmentedControlItem value="b">Option B</SegmentedControlItem>
          </SegmentedControl>
          <SegmentedControl label="Optional Field" necessityIndicator="optional" defaultValue="a">
            <SegmentedControlItem value="a">Option A</SegmentedControlItem>
            <SegmentedControlItem value="b">Option B</SegmentedControlItem>
          </SegmentedControl>
        </Box>
      </Box>
    </Box>
  );
};
