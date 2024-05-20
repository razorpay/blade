/* eslint-disable import/no-extraneous-dependencies */
import type { StoryFn } from '@storybook/react';
import { within, userEvent } from '@storybook/testing-library';
import { expect, jest } from '@storybook/jest';
import type { Mock } from 'jest-mock';
import React from 'react';
import type { DateValue } from '@mantine/dates';
import { DatesProvider } from '@mantine/dates';
import { HeadlessMantineProvider } from '@mantine/core';
import dayjs from 'dayjs';
import type { DatePickerProps } from '../';
import { DatePicker as DatePickerComponent } from '../';
import { Box } from '~components/Box';
import { Button } from '~components/Button';

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

let onOpenChange: Mock<unknown, unknown[]> | null = null;

const BasicDatePicker = (props: DatePickerProps<'range' | 'range'>): React.ReactElement => (
  <Box margin="auto" width={{ base: '100%', m: '100%' }} padding="spacing.4">
    <HeadlessMantineProvider>
      <DatesProvider settings={{ locale: 'en-US' }}>
        <DatePickerComponent {...props} />
      </DatesProvider>
    </HeadlessMantineProvider>
  </Box>
);

export const DatePickerShouldShow: StoryFn<typeof DatePickerComponent> = (
  props,
): React.ReactElement => {
  onOpenChange = jest.fn();
  return (
    <BasicDatePicker {...props} accessibilityLabel="Select Date" onOpenChange={onOpenChange} />
  );
};

DatePickerShouldShow.play = async () => {
  const { getByRole, queryByText } = within(document.body);
  const input = getByRole('combobox', { name: /Select Date/i });
  // open
  await userEvent.click(input);
  await sleep(400);
  await expect(onOpenChange).toBeCalledWith({ isOpen: true });
  await expect(queryByText('Sun')).toBeVisible();
  // close
  await userEvent.click(input);
  await sleep(400);
  await expect(onOpenChange).toBeCalledWith({ isOpen: false });
  await expect(queryByText('Sun')).not.toBeInTheDocument();
  await expect(input).toHaveFocus();
  await expect(onOpenChange).toBeCalledTimes(2);
};

export const DatePickerSingleSelect: StoryFn<typeof DatePickerComponent> = (
  props,
): React.ReactElement => {
  onOpenChange = jest.fn();
  return (
    <BasicDatePicker {...props} accessibilityLabel="Select Date" onOpenChange={onOpenChange} />
  );
};

DatePickerSingleSelect.play = async () => {
  const { getByRole, queryByText } = within(document.body);
  const input = getByRole('combobox', { name: /Select Date/i });
  // open
  await userEvent.click(input);
  await sleep(400);
  await expect(onOpenChange).toBeCalledWith({ isOpen: true });
  await expect(queryByText('Sun')).toBeVisible();
  // select
  const dateToSelect = dayjs().add(1, 'day');
  const date = getByRole('button', { name: dateToSelect.format('DD MMM YYYY') });
  await userEvent.click(date);
  // press apply button
  const applyButton = getByRole('button', { name: /Apply/i });
  await userEvent.click(applyButton);
  await sleep(400);
  await expect(date).not.toBeVisible();
  // assert inputs value
  await expect(input).toHaveValue(dateToSelect.format('DD/MM/YYYY'));
  await expect(onOpenChange).toBeCalledTimes(2);
};

export const DatePickerSingleSelectCancel: StoryFn<typeof DatePickerComponent> = (
  props,
): React.ReactElement => {
  onOpenChange = jest.fn();
  return (
    <BasicDatePicker {...props} accessibilityLabel="Select Date" onOpenChange={onOpenChange} />
  );
};

DatePickerSingleSelectCancel.play = async () => {
  const { getByRole, queryByText } = within(document.body);
  const input = getByRole('combobox', { name: /Select Date/i });
  // open
  await userEvent.click(input);
  await sleep(400);
  await expect(onOpenChange).toBeCalledWith({ isOpen: true });
  await expect(queryByText('Sun')).toBeVisible();
  // select
  const dateToSelect = dayjs().add(1, 'day');
  const date = getByRole('button', { name: dateToSelect.format('DD MMM YYYY') });
  await userEvent.click(date);
  // assert inputs value
  await expect(input).toHaveValue(dateToSelect.format('DD/MM/YYYY'));
  // press cancel button
  const cancelButton = getByRole('button', { name: /Cancel/i });
  await userEvent.click(cancelButton);
  await sleep(400);
  await expect(date).not.toBeVisible();
  await expect(input).toHaveValue('');
  await expect(onOpenChange).toBeCalledTimes(2);
};

export const DatePickerSingleSelectControlled: StoryFn<
  typeof DatePickerComponent
> = (): React.ReactElement => {
  const [value, setValue] = React.useState<DateValue>(dayjs().add(1, 'day').toDate());

  return (
    <Box>
      <Button onClick={() => setValue(dayjs().add(5, 'day').toDate())}>Change Date</Button>
      <HeadlessMantineProvider>
        <DatesProvider settings={{ locale: 'en-US' }}>
          <DatePickerComponent
            selectionType="single"
            accessibilityLabel="Select Date"
            value={value}
            onChange={(date) => {
              setValue(date);
            }}
          />
        </DatesProvider>
      </HeadlessMantineProvider>
    </Box>
  );
};

DatePickerSingleSelectControlled.play = async () => {
  const { getByRole, queryByText } = within(document.body);
  // assert inputs value
  const input = getByRole('combobox', { name: /Select Date/i });
  await expect(input).toHaveValue(dayjs().add(1, 'day').format('DD/MM/YYYY'));
  // open
  await userEvent.click(input);
  await sleep(400);
  await expect(queryByText('Sun')).toBeVisible();
  // select
  const changeButton = getByRole('button', { name: 'Change Date', hidden: true });
  await userEvent.click(changeButton);
  await sleep(400);
  // open again
  await userEvent.click(input);
  await sleep(400);
  await expect(queryByText('Sun')).toBeVisible();
  // assert inputs value
  await expect(input).toHaveValue(dayjs().add(5, 'day').format('DD/MM/YYYY'));
  // select another date
  const dateToSelect = dayjs().add(6, 'day');
  const date = getByRole('button', { name: dateToSelect.format('DD MMM YYYY') });
  await userEvent.click(date);
  // press apply button
  const applyButton = getByRole('button', { name: /Apply/i });
  await userEvent.click(applyButton);
  await sleep(400);
  await expect(date).not.toBeVisible();
  // assert inputs value
  await expect(input).toHaveValue(dateToSelect.format('DD/MM/YYYY'));
};

export const DatePickerSingleChangePicker: StoryFn<
  typeof DatePickerComponent
> = (): React.ReactElement => {
  return (
    <Box>
      <HeadlessMantineProvider>
        <DatesProvider settings={{ locale: 'en-US' }}>
          <DatePickerComponent selectionType="single" accessibilityLabel="Select Date" />
        </DatesProvider>
      </HeadlessMantineProvider>
    </Box>
  );
};

DatePickerSingleChangePicker.play = async () => {
  const { getByRole, queryByText } = within(document.body);
  const input = getByRole('combobox', { name: /Select Date/i });
  // open
  await userEvent.click(input);
  await sleep(400);
  await expect(queryByText('Sun')).toBeVisible();
  await userEvent.tab();
  await userEvent.tab();
  // go to month
  const month = getByRole('button', { name: /Change month/i });
  await expect(month).toHaveFocus();
  await userEvent.click(month);
  const year = getByRole('button', { name: /Change decade/i });
  await userEvent.click(year);
  getByRole('button', { name: /previous/i }).focus();
  await userEvent.tab();
  await userEvent.tab();
  await sleep(400);
  await expect(getByRole('button', { name: dayjs().format('YYYY') })).toHaveFocus();
  await sleep(400);
  getByRole('button', { name: /previous/i }).focus();
  await userEvent.tab();
  await userEvent.tab();
  await userEvent.keyboard('{ArrowRight}');
  await userEvent.keyboard('{Enter}');
  await sleep(400);
  getByRole('button', { name: /previous/i }).focus();
  await userEvent.tab();
  await userEvent.tab();
  await userEvent.tab();
  await userEvent.keyboard('{ArrowRight}');
  await userEvent.keyboard('{Enter}');
  await sleep(400);
  getByRole('button', { name: /previous/i }).focus();
  await userEvent.tab();
  await userEvent.tab();
  await userEvent.tab();
  await userEvent.keyboard('{ArrowRight}');
  await userEvent.keyboard('{Enter}');
  // press apply
  const applyButton = getByRole('button', { name: /Apply/i });
  await userEvent.click(applyButton);
  await sleep(400);
  // assert inputs value
  await expect(input).toHaveValue(dayjs('02/02/2025').format('DD/MM/YYYY'));
};

export default {
  title: 'Components/Interaction Tests/DatePicker',
  component: DatePickerComponent,
  parameters: {
    controls: {
      disable: true,
    },
    a11y: { disable: true },
    essentials: { disable: true },
    actions: { disable: true },
  },
};
