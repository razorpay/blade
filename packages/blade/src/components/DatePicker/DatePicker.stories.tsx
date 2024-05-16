import type { StoryFn, Meta } from '@storybook/react';
import type { DatesRangeValue } from '@mantine/dates';
import { DatesProvider } from '@mantine/dates';
import { HeadlessMantineProvider } from '@mantine/core';
import React from 'react';
import { Title } from '@storybook/addon-docs';
import dayjs from 'dayjs';
import type { DatePickerProps } from './types';
import { DatePicker as DatePickerComponent } from './';
import { Box } from '~components/Box';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Sandbox } from '~utils/storybook/Sandbox';
import { Code, Text } from '~components/Typography';

export default {
  title: 'Components/DatePicker',
  component: DatePickerComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      page: () => (
        <StoryPageWrapper
          componentDescription="The DatePicker component is used to select a date or a range of dates."
          componentName="DatePicker"
          apiDecisionLink="https://github.com/razorpay/blade/blob/master/packages/blade/src/components/DatePicker/_decisions/decisions.md"
          figmaURL="https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=88832-1762629&t=oSH8pSWjSoiOUnXo-0"
        >
          <Title>Usage</Title>
          <Sandbox>
            {`
              import { DatePicker } from '@razorpay/blade/components';

              function App(): React.ReactElement {
                return (
                  <DatePicker 
                    label="Name"
                    onChange={(e) => console.log(e)}
                  />
                )
              }

              export default App;
            `}
          </Sandbox>
        </StoryPageWrapper>
      ),
    },
  },
} as Meta<DatePickerProps<'single' | 'range'>>;

const DatePickerTemplate: StoryFn<typeof DatePickerComponent> = ({ ...args }) => {
  return (
    <HeadlessMantineProvider>
      <DatesProvider settings={{ locale: 'en-US' }}>
        <DatePickerComponent
          onChange={(date) => {
            console.log(date);
          }}
          {...args}
        />
      </DatesProvider>
    </HeadlessMantineProvider>
  );
};

export const SingleDatePicker = DatePickerTemplate.bind({});
SingleDatePicker.storyName = 'SingleDatePicker';
SingleDatePicker.args = {
  label: 'Select a date',
  selectionType: 'single',
};

export const RangeDatePicker = DatePickerTemplate.bind({});
RangeDatePicker.storyName = 'RangeDatePicker';
RangeDatePicker.args = {
  label: { start: 'Start Date', end: 'End Date' },
  selectionType: 'range',
};

export const DatePickerPresets: StoryFn<typeof DatePickerComponent> = ({ ...args }) => {
  return (
    <Box>
      <Text>
        In Range DatePicker you can pass <Code size="medium">presets</Code> which will render a
        quick selection panel inside DatePicker for easy to use range selections
      </Text>
      <Text marginTop="spacing.4">
        presets accepts an array of objects with <Code>label</Code> and{' '}
        <Code size="medium">value</Code> properties.
      </Text>
      <Text marginTop="spacing.2" marginBottom="spacing.5">
        Example:
        <Code size="medium">
          {`
            [ { label: 'Past 7 days', value: (date) => [dayjs(date).subtract(7, 'days').toDate(), date]} ]
          `}
        </Code>
      </Text>
      <HeadlessMantineProvider>
        <DatesProvider settings={{ locale: 'en-US' }}>
          <DatePickerComponent
            selectionType="range"
            onChange={(date) => {
              console.log(date);
            }}
            presets={[
              {
                label: 'Past 7 days',
                value: (date) => [dayjs(date).subtract(7, 'days').toDate(), date],
              },
              {
                label: 'Past 15 days',
                value: (date) => [dayjs(date).subtract(15, 'days').toDate(), date],
              },
              {
                label: 'Past month',
                value: (date) => [dayjs(date).subtract(1, 'month').toDate(), date],
              },
              {
                label: 'Past year',
                value: (date) => [dayjs(date).subtract(1, 'year').toDate(), date],
              },
            ]}
            {...args}
          />
        </DatesProvider>
      </HeadlessMantineProvider>
    </Box>
  );
};

DatePickerPresets.storyName = 'With Presets';
DatePickerPresets.args = {
  label: { start: 'Start Date', end: 'End Date' },
};

export const DatePickerControlled: StoryFn<typeof DatePickerComponent> = () => {
  const [isOpen, setIsOpen] = React.useState(true);
  const [date, setDate] = React.useState<DatesRangeValue>([
    new Date(),
    dayjs().add(3, 'day').toDate(),
  ]);

  return (
    <Box>
      <Text marginBottom="spacing.5">
        With <Code size="medium">isOpen</Code>, <Code size="medium">value</Code> and associated
        event handlers you can control the DatePicker.
      </Text>
      <Box marginBottom="spacing.5">
        <Text>
          Selected: [{dayjs(date[0]).format('DD-MM-YYYY')}, {dayjs(date[1]).format('DD-MM-YYYY')}]
        </Text>
        <Text marginTop="spacing.2">IsOpen: {JSON.stringify(isOpen)}</Text>
      </Box>
      <HeadlessMantineProvider>
        <DatesProvider settings={{ locale: 'en-US' }}>
          <DatePickerComponent
            label={{ start: 'Start Date', end: 'End Date' }}
            selectionType="range"
            isOpen={isOpen}
            onOpenChange={({ isOpen }) => setIsOpen(isOpen)}
            value={date}
            onChange={(date) => {
              setDate(date);
            }}
          />
        </DatesProvider>
      </HeadlessMantineProvider>
    </Box>
  );
};

DatePickerControlled.storyName = 'Controlled DatePicker';

export const Validations: StoryFn<typeof DatePickerComponent> = () => {
  const [date, setDate] = React.useState<DatesRangeValue>([
    new Date(),
    dayjs().add(3, 'day').toDate(),
  ]);
  const [hasError, setHasError] = React.useState(false);

  return (
    <Box>
      <Text marginBottom="spacing.5">
        DatePicker supports all common Input props like <Code size="medium">validationState</Code>,{' '}
        <Code size="medium">isRequired</Code>, <Code size="medium">isDisabled</Code> etc.
      </Text>
      <HeadlessMantineProvider>
        <DatesProvider settings={{ locale: 'en-US' }}>
          <DatePickerComponent
            validationState={hasError ? 'error' : 'none'}
            errorText="Cannot select a range which is more than 3 days"
            label={{ start: 'Start Date', end: 'End Date' }}
            selectionType="range"
            value={date}
            onChange={(date) => {
              setDate(date);
              if (dayjs(date[1]).diff(date[0], 'day') > 3) {
                setHasError(true);
              } else {
                setHasError(false);
              }
            }}
          />
        </DatesProvider>
      </HeadlessMantineProvider>
    </Box>
  );
};

Validations.storyName = 'Validations';

export const LabelPositionLeft: StoryFn<typeof DatePickerComponent> = () => {
  return (
    <Box>
      <Text marginBottom="spacing.5">
        The <Code size="medium">label</Code> prop accepts a string or an object{' '}
        <Code size="medium">{`{start, end}`}</Code> depending on the
        <Code size="medium">selectionType</Code>. When the{' '}
        <Code size="medium">labelPositionLeft</Code> prop is set & selectionType is range, the label
        will be rendered on the left with the <Code size="medium">{`{start}`}</Code> string.
      </Text>
      <HeadlessMantineProvider>
        <DatesProvider settings={{ locale: 'en-US' }}>
          <Box display="flex" gap="spacing.5" flexDirection="column">
            <DatePickerComponent
              labelPosition="left"
              selectionType="range"
              label={{ start: 'Select a range' }}
            />
            <DatePickerComponent
              selectionType="single"
              labelPosition="left"
              label="Select a date"
            />
          </Box>
        </DatesProvider>
      </HeadlessMantineProvider>
    </Box>
  );
};

LabelPositionLeft.storyName = 'LabelPositionLeft';

export const MonthPicker: StoryFn<typeof DatePickerComponent> = ({ ...args }) => {
  return (
    <Box>
      <Text>
        By passing <Code size="medium">picker</Code> prop as <Code size="medium">month</Code> or{' '}
        <Code size="medium">year</Code> you can render a month/year picker
      </Text>
      <Text marginTop="spacing.2">
        You can also hook into onMonthSelect and onYearSelect events
      </Text>
      <Text
        color="surface.text.gray.muted"
        size="small"
        marginTop="spacing.2"
        marginBottom="spacing.4"
      >
        Note: picker is only supported in single selection mode
      </Text>
      <HeadlessMantineProvider>
        <DatesProvider settings={{ locale: 'en-US' }}>
          <DatePickerComponent picker="month" selectionType="single" {...args} />
        </DatesProvider>
      </HeadlessMantineProvider>
    </Box>
  );
};

MonthPicker.storyName = 'Month/Year Picker';
