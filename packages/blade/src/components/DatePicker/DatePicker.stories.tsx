import type { StoryFn, Meta } from '@storybook/react';
import { DatesProvider } from '@mantine/dates';
import { HeadlessMantineProvider } from '@mantine/core';
import dayjs from 'dayjs';
import type { CalendarProps } from './types';
import { Calendar as CalendarComponent, DatePicker } from './';
import { Box } from '~components/Box';

export default {
  title: 'Components/DatePicker',
  component: CalendarComponent,
  tags: ['autodocs'],
} as Meta<CalendarProps<'single' | 'range'>>;

export const Calendar: StoryFn<typeof CalendarComponent> = ({ ...args }) => {
  return (
    <Box>
      <HeadlessMantineProvider>
        <DatesProvider settings={{ locale: 'en-US' }}>
          <DatePicker
            {...args}
            selectionType="range"
            onChange={(date) => {
              console.log(date);
            }}
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
