import type { StoryFn, Meta } from '@storybook/react';
import dayjs from 'dayjs';
import React from 'react';
import { Title } from '@storybook/addon-docs';
import { I18nProvider } from '@razorpay/i18nify-react';
import type { DatePickerProps, DatesRangeValue } from './types';
import { DatePicker as DatePickerComponent, FilterChipDatePicker } from './';
import { Box } from '~components/Box';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Sandbox } from '~utils/storybook/Sandbox';
import { Code, Text } from '~components/Typography';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { Button } from '~components/Button';

const propsCategory = {
  BASE_PROPS: 'DatePicker Props',
  INPUT_PROPS: 'Input Props',
};

const baseProp = {
  table: {
    category: propsCategory.BASE_PROPS,
  },
} as const;
const inputProp = {
  table: {
    category: propsCategory.INPUT_PROPS,
  },
} as const;
export default {
  title: 'Components/DatePicker',
  component: DatePickerComponent,
  tags: ['autodocs'],
  argTypes: {
    ...getStyledPropsArgTypes(),
    value: baseProp,
    isOpen: baseProp,
    onChange: baseProp,
    selectionType: baseProp,
    presets: baseProp,
    minDate: baseProp,
    maxDate: baseProp,
    excludeDate: baseProp,
    picker: baseProp,
    onOpenChange: baseProp,
    allowSingleDateInRange: baseProp,
    defaultIsOpen: baseProp,
    defaultPicker: baseProp,
    defaultValue: baseProp,
    firstDayOfWeek: baseProp,
    onMonthSelect: baseProp,
    onYearSelect: baseProp,
    onNext: baseProp,
    onNextDecade: baseProp,
    onNextMonth: baseProp,
    onNextYear: baseProp,
    onPickerChange: baseProp,
    onPrevious: baseProp,
    onPreviousDecade: baseProp,
    onPreviousMonth: baseProp,
    onPreviousYear: baseProp,
    locale: baseProp,
    accessibilityLabel: inputProp,
    errorText: inputProp,
    helpText: inputProp,
    isDisabled: inputProp,
    isRequired: inputProp,
    label: inputProp,
    labelPosition: inputProp,
    size: inputProp,
    successText: inputProp,
    validationState: inputProp,
    name: inputProp,
    autoFocus: inputProp,
    necessityIndicator: inputProp,
  },
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
          <Sandbox editorHeight={600}>
            {`
              import { DatePicker } from '@razorpay/blade/components';
import { m } from 'framer-motion';

              function App() {
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
  if (args.selectionType === 'range' && typeof args.label === 'string') {
    throw new Error(
      '[Storybook Controls]: Cannot use string label for range selection, please switch to the RangeDatePicker story',
    );
  }
  if (args.selectionType === 'single' && typeof args.label === 'object') {
    throw new Error(
      '[Storybook Controls]: Cannot use {start,end} label for single selection, please switch to the SingleDatePicker story',
    );
  }

  return (
    <DatePickerComponent
      onChange={(date) => {
        console.log(date);
      }}
      {...args}
    />
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
    </Box>
  );
};

DatePickerPresets.storyName = 'With Presets';
DatePickerPresets.args = {
  label: { start: 'Start Date', end: 'End Date' },
};

export const DatePickerControlled: StoryFn<typeof DatePickerComponent> = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [dateRange, setDateRange] = React.useState<DatesRangeValue>([
    dayjs().subtract(3, 'months').toDate(),
    dayjs().add(3, 'day').subtract(3, 'months').toDate(),
  ]);
  const [date, setDate] = React.useState(dayjs().subtract(3, 'months').toDate());

  return (
    <Box>
      <Text marginBottom="spacing.5">
        With <Code size="medium">isOpen</Code>, <Code size="medium">value</Code> and associated
        event handlers you can control the DatePicker.
      </Text>
      <Box marginBottom="spacing.5">
        <Text>
          Selected: [{dayjs(dateRange[0]).format('DD-MM-YYYY')},{' '}
          {dayjs(dateRange[1]).format('DD-MM-YYYY')}]
        </Text>
        <Text marginTop="spacing.2">IsOpen: {JSON.stringify(isOpen)}</Text>
      </Box>
      <DatePickerComponent
        label={{ start: 'Start Date', end: 'End Date' }}
        selectionType="range"
        isOpen={isOpen}
        onOpenChange={({ isOpen }) => setIsOpen(isOpen)}
        value={dateRange}
        onChange={(date) => {
          setDateRange(date);
        }}
      />
      <Box marginTop="spacing.5">
        <Text marginBottom="spacing.5">Single Date Picker</Text>
        <Text>Selected: {dayjs(date).format('DD-MM-YYYY')}</Text>
        <DatePickerComponent
          label="Select a date"
          selectionType="single"
          value={date}
          onChange={(date) => {
            setDate(date);
          }}
        />
      </Box>

      <Button
        onClick={() => {
          setDate(
            dayjs()
              .subtract(Math.round(Math.random() * 10), 'month')
              .toDate(),
          );
        }}
        marginTop="spacing.5"
      >
        {' '}
        Change Date
      </Button>
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
      <DatePickerComponent
        validationState={hasError ? 'error' : 'none'}
        errorText={{ start: 'Cannot select a range which is more than 3 days' }}
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
    </Box>
  );
};

Validations.storyName = 'Validations';

export const MinMaxDates: StoryFn<typeof DatePickerComponent> = () => {
  return (
    <Box>
      <Text marginBottom="spacing.5">
        With <Code size="medium">minDate</Code> and <Code size="medium">maxDate</Code> props you can
        set minimum and maximum dates that can be selected.
      </Text>
      <Box marginY="spacing.4" display="flex" gap="spacing.2" flexDirection="column">
        <Text>Example: </Text>
        <Text size="small">{`minDate={dayjs().subtract(1, 'week').toDate()}`}</Text>
        <Text size="small">{`maxDate={dayjs().add(1, 'week').toDate()}`}</Text>
      </Box>
      <DatePickerComponent
        label={{ start: 'Start Date', end: 'End Date' }}
        selectionType="range"
        minDate={dayjs().subtract(1, 'week').toDate()}
        maxDate={dayjs().add(1, 'week').toDate()}
      />
    </Box>
  );
};

MinMaxDates.storyName = 'MinMaxDates';

export const ExcludeDates: StoryFn<typeof DatePickerComponent> = () => {
  return (
    <Box>
      <Text marginBottom="spacing.5">
        With <Code size="medium">excludeDate</Code> function you can exclude specific dates from
        being selected.
      </Text>
      <Box marginY="spacing.4" display="flex" gap="spacing.2" flexDirection="column">
        <Text>Example, exclude weekends: </Text>
        <Text size="small">{`excludeDate={(date) => dayjs(date).day() === 0 || dayjs(date).day() === 6}`}</Text>
      </Box>
      <DatePickerComponent
        label="Select Dates Without Weekends"
        selectionType="single"
        excludeDate={(date) => dayjs(date).day() === 0 || dayjs(date).day() === 6}
      />
    </Box>
  );
};

ExcludeDates.storyName = 'ExcludeDates';

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
      <Box display="flex" gap="spacing.5" flexDirection="column">
        <DatePickerComponent
          labelPosition="left"
          selectionType="range"
          label={{ start: 'Select a range' }}
        />
        <DatePickerComponent selectionType="single" labelPosition="left" label="Select a date" />
      </Box>
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
      <DatePickerComponent picker="month" selectionType="single" {...args} />
    </Box>
  );
};

MonthPicker.storyName = 'Month/Year Picker';

export const Localization: StoryFn<typeof DatePickerComponent> = () => {
  console.log(Intl.DateTimeFormat.supportedLocalesOf('en'));
  return (
    <Box>
      <Text marginBottom="spacing.5">
        The DatePicker component supports localization using the i18nify-js. You can pass the locale
        prop to the
        <Code size="medium">I18nProvider</Code> to change the locale of the DatePicker.
      </Text>
      <I18nProvider initData={{ locale: 'hi-IN' }}>
        <DatePickerComponent label={`initData={{ locale: 'hi-IN' }}`} />
      </I18nProvider>

      <I18nProvider initData={{ locale: 'ms-MY' }}>
        <DatePickerComponent marginTop="spacing.5" label={`initData={{ locale: 'ms-MY' }}`} />
      </I18nProvider>
    </Box>
  );
};

Localization.storyName = 'Localization';

export const FilterChipDatePickerStorySingleStory: StoryFn<typeof FilterChipDatePicker> = () => {
  return (
    <Box>
      <FilterChipDatePicker
        label="Date"
        selectionType="single"
        onChange={(date) => {
          console.log('date', date);
        }}
      />
    </Box>
  );
};

FilterChipDatePickerStorySingleStory.storyName = 'FilterChipDatePicker (Single Selection)';

export const FilterChipDatePickerStoryMultiSelectionStory: StoryFn<
  typeof FilterChipDatePicker
> = () => {
  return (
    <Box>
      <FilterChipDatePicker
        label="Date"
        selectionType="range"
        onChange={(date) => {
          console.log(date);
        }}
      />
    </Box>
  );
};

FilterChipDatePickerStoryMultiSelectionStory.storyName = 'FilterChipDatePicker (Multi Selection)';

export const FilterChipDatePickerStorySingleStoryWithPreset: StoryFn<
  typeof FilterChipDatePicker
> = () => {
  return (
    <Box>
      <FilterChipDatePicker
        label="Date"
        selectionType="range"
        presets={[
          { label: 'In 7 days', value: (date) => [dayjs(date).subtract(7, 'days').toDate(), date] },
          {
            label: 'In a month',
            value: (date) => [dayjs(date).subtract(15, 'days').toDate(), date],
          },
        ]}
        onChange={(date) => {
          console.log(date);
        }}
      />
    </Box>
  );
};

FilterChipDatePickerStorySingleStoryWithPreset.storyName =
  'FilterChipDatePicker (Single Selection) with Presets';

export const ControlledFilterChipDatePickerSingle: StoryFn<typeof FilterChipDatePicker> = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <Box>
      <Text marginBottom="spacing.5">
        With <Code size="medium">isOpen</Code>, <Code size="medium">value</Code> and associated
        event handlers you can control the FilterChipDatePicker.
      </Text>
      <Box marginBottom="spacing.5">
        <Text>Selected: {dayjs(date).format('DD-MM-YYYY')}</Text>
        <Text marginTop="spacing.2">IsOpen: {JSON.stringify(isOpen)}</Text>
      </Box>
      <FilterChipDatePicker
        label="Date"
        selectionType="single"
        isOpen={isOpen}
        onOpenChange={({ isOpen }) => setIsOpen(isOpen)}
        value={date}
        onChange={(date) => {
          setDate(date as Date);
        }}
      />
    </Box>
  );
};

export const ControlledFilterChipDatePickerRange: StoryFn<typeof FilterChipDatePicker> = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [date, setDate] = React.useState<DatesRangeValue>([
    new Date(),
    dayjs().add(3, 'day').toDate(),
  ]);

  return (
    <Box>
      <Text marginBottom="spacing.5">
        With <Code size="medium">isOpen</Code>, <Code size="medium">value</Code> and associated
        event handlers you can control the FilterChipDatePicker.
      </Text>
      <Box marginBottom="spacing.5">
        <Text>
          Selected: [{dayjs(date[0]).format('DD-MM-YYYY')}, {dayjs(date[1]).format('DD-MM-YYYY')}]
        </Text>
        <Text marginTop="spacing.2">IsOpen: {JSON.stringify(isOpen)}</Text>
      </Box>
      <FilterChipDatePicker
        label="Date"
        selectionType="range"
        isOpen={isOpen}
        onOpenChange={({ isOpen }) => setIsOpen(isOpen)}
        value={date}
        onChange={(date) => {
          setDate(date as DatesRangeValue);
        }}
        onClearButtonClick={() => {
          setDate([null, null]);
        }}
      />
    </Box>
  );
};
