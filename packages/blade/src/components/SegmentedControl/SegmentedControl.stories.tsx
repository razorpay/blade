import type { StoryFn, Meta } from '@storybook/react-vite';
import React from 'react';
import type { SegmentedControlProps } from './types';
import { SegmentedControl } from './SegmentedControl';
import { SegmentedControlItem } from './SegmentedControlItem';
import { Box } from '~components/Box';
import { Text, Heading } from '~components/Typography';
import { CalendarIcon, ClockIcon, TrendingUpIcon } from '~components/Icons';
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
                <SegmentedControl defaultValue="daily">
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
    isFullWidth: {
      control: { type: 'boolean' },
    },
    isDisabled: {
      control: { type: 'boolean' },
    },
  },
} as Meta<SegmentedControlProps>;

const DefaultTemplate: StoryFn<SegmentedControlProps> = (args) => {
  return (
    <Box padding="spacing.5">
      <SegmentedControl {...args} defaultValue="daily">
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
  isFullWidth: false,
  isDisabled: false,
};

export const Sizes: StoryFn<SegmentedControlProps> = () => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.6" padding="spacing.5">
      <Box>
        <Text marginBottom="spacing.3" weight="semibold">
          Small
        </Text>
        <SegmentedControl size="small" defaultValue="daily">
          <SegmentedControlItem value="daily">Daily</SegmentedControlItem>
          <SegmentedControlItem value="weekly">Weekly</SegmentedControlItem>
          <SegmentedControlItem value="monthly">Monthly</SegmentedControlItem>
        </SegmentedControl>
      </Box>
      <Box>
        <Text marginBottom="spacing.3" weight="semibold">
          Medium
        </Text>
        <SegmentedControl size="medium" defaultValue="daily">
          <SegmentedControlItem value="daily">Daily</SegmentedControlItem>
          <SegmentedControlItem value="weekly">Weekly</SegmentedControlItem>
          <SegmentedControlItem value="monthly">Monthly</SegmentedControlItem>
        </SegmentedControl>
      </Box>
      <Box>
        <Text marginBottom="spacing.3" weight="semibold">
          Large
        </Text>
        <SegmentedControl size="large" defaultValue="daily">
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
    <Box padding="spacing.5">
      <SegmentedControl defaultValue="day">
        <SegmentedControlItem value="day" icon={CalendarIcon}>
          Day
        </SegmentedControlItem>
        <SegmentedControlItem value="hour" icon={ClockIcon}>
          Hour
        </SegmentedControlItem>
        <SegmentedControlItem value="trend" icon={TrendingUpIcon}>
          Trend
        </SegmentedControlItem>
      </SegmentedControl>
    </Box>
  );
};

export const FullWidth: StoryFn<SegmentedControlProps> = () => {
  return (
    <Box padding="spacing.5" width="400px">
      <SegmentedControl isFullWidth defaultValue="overview">
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
        <SegmentedControl isDisabled defaultValue="daily">
          <SegmentedControlItem value="daily">Daily</SegmentedControlItem>
          <SegmentedControlItem value="weekly">Weekly</SegmentedControlItem>
          <SegmentedControlItem value="monthly">Monthly</SegmentedControlItem>
        </SegmentedControl>
      </Box>
      <Box>
        <Text marginBottom="spacing.3" weight="semibold">
          Single item disabled
        </Text>
        <SegmentedControl defaultValue="daily">
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
      <SegmentedControl value={selected} onChange={setSelected}>
        <SegmentedControlItem value="daily">Daily</SegmentedControlItem>
        <SegmentedControlItem value="weekly">Weekly</SegmentedControlItem>
        <SegmentedControlItem value="monthly">Monthly</SegmentedControlItem>
      </SegmentedControl>
    </Box>
  );
};
