import type { StoryFn, Meta } from '@storybook/react';
import { DatesProvider } from '@mantine/dates';
import { HeadlessMantineProvider } from '@mantine/core';
import dayjs from 'dayjs';
import React from 'react';
import type { CalendarProps, DatesRangeValue } from './types';
import { DatePicker } from './';
import { Box } from '~components/Box';

export default {
  title: 'Components/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
} as Meta<CalendarProps<'single' | 'range'>>;

export const Calendar: StoryFn<typeof DatePicker> = ({ ...args }) => {
  const [isOpen, setIsOpen] = React.useState(true);
  const [date, setDate] = React.useState<DatesRangeValue>([
    new Date(),
    dayjs().add(3, 'day').toDate(),
  ]);

  return (
    <Box>
      <HeadlessMantineProvider>
        <DatesProvider settings={{ locale: 'en-US' }}>
          <DatePicker
            size="medium"
            isRequired
            validationState="none"
            helpText="Cannot select this range"
            selectionType="range"
            isOpen={isOpen}
            onOpenChange={({ isOpen }) => setIsOpen(isOpen)}
            value={date}
            labelPosition="top"
            onChange={(date) => {
              console.log(date);
              setDate(date);
            }}
            label={{ start: 'Start Date', end: 'End Date' }}
            presets={[
              {
                label: 'Past 3 days',
                value: (date) => [dayjs(date).subtract(3, 'day').toDate(), date],
              },
              {
                label: 'Past 7 days',
                value: (date) => [dayjs(date).subtract(7, 'day').toDate(), date],
              },
              {
                label: 'Past 30 days',
                value: (date) => [dayjs(date).subtract(30, 'day').toDate(), date],
              },
              {
                label: 'Last Year',
                value: (date) => [dayjs(date).subtract(1, 'year').toDate(), date],
              },
            ]}
          />
        </DatesProvider>
      </HeadlessMantineProvider>
    </Box>
  );
};
