/* eslint-disable import/no-extraneous-dependencies */
import type { StoryFn } from '@storybook/react';
import { within, userEvent } from '@storybook/testing-library';
import { expect, jest } from '@storybook/jest';
import type { Mock } from 'jest-mock';
import React from 'react';
import dayjs from 'dayjs';
import { I18nProvider, useI18nContext } from '@razorpay/i18nify-react';
import type { DatesRangeValue, DateValue } from '../types';
import { DatePicker as DatePickerComponent } from '../';
import { Box } from '~components/Box';
import { Button } from '~components/Button';

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

let onOpenChange: Mock<unknown, unknown[]> | null = null;

export const DatePickerShouldShow: StoryFn<typeof DatePickerComponent> = (): React.ReactElement => {
  onOpenChange = jest.fn();
  return <DatePickerComponent accessibilityLabel="Select Date" onOpenChange={onOpenChange} />;
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

export const DatePickerDisabled: StoryFn<typeof DatePickerComponent> = (): React.ReactElement => {
  onOpenChange = jest.fn();
  return (
    <DatePickerComponent isDisabled accessibilityLabel="Select Date" onOpenChange={onOpenChange} />
  );
};

DatePickerDisabled.play = async () => {
  const { getByRole } = within(document.body);
  const input = getByRole('combobox', { name: /Select Date/i });
  await userEvent.click(input);
  await sleep(400);
  await expect(onOpenChange).not.toBeCalled();
};

export const DatePickerMinMaxDate: StoryFn<typeof DatePickerComponent> = (): React.ReactElement => {
  onOpenChange = jest.fn();
  return (
    <DatePickerComponent
      minDate={dayjs().subtract(5, 'day').toDate()}
      maxDate={dayjs().toDate()}
      accessibilityLabel="Select Date"
      onOpenChange={onOpenChange}
    />
  );
};

DatePickerMinMaxDate.play = async () => {
  const { getByRole } = within(document.body);
  const input = getByRole('combobox', { name: /Select Date/i });
  // open
  await userEvent.click(input);
  await sleep(400);
  // expect date to be disabled
  const disabledDate = getByRole('button', {
    name: dayjs().subtract(6, 'day').format('DD MMMM YYYY'),
  });
  await expect(disabledDate).toBeDisabled();
  // expect month to be disabled
  const month = getByRole('button', { name: /Change month/i });
  await userEvent.click(month);
  const disabledMonth = getByRole('button', {
    name: dayjs().subtract(1, 'month').format('MMM'),
  });
  await expect(disabledMonth).toBeDisabled();
  // expect year to be disabled
  const year = getByRole('button', { name: /Change decade/i });
  await userEvent.click(year);
  const disabledYear = getByRole('button', { name: dayjs().subtract(1, 'year').format('YYYY') });
  await expect(disabledYear).toBeDisabled();
};

export const DatePickerSingleSelect: StoryFn<
  typeof DatePickerComponent
> = (): React.ReactElement => {
  onOpenChange = jest.fn();
  return <DatePickerComponent accessibilityLabel="Select Date" onOpenChange={onOpenChange} />;
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
  const date = getByRole('button', { name: dateToSelect.format('DD MMMM YYYY') });
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

export const DatePickerSingleSelectCancel: StoryFn<
  typeof DatePickerComponent
> = (): React.ReactElement => {
  onOpenChange = jest.fn();
  return <DatePickerComponent accessibilityLabel="Select Date" onOpenChange={onOpenChange} />;
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
  const date = getByRole('button', { name: dateToSelect.format('DD MMMM YYYY') });
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
      <DatePickerComponent
        selectionType="single"
        accessibilityLabel="Select Date"
        value={value}
        onChange={(date) => {
          setValue(date);
        }}
      />
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
  const dateToSelect = dayjs().add(2, 'day');
  const date = getByRole('button', { name: dateToSelect.format('DD MMMM YYYY') });
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
  return <DatePickerComponent selectionType="single" accessibilityLabel="Select Date" />;
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

export const DatePickerRangeSelect: StoryFn<
  typeof DatePickerComponent
> = (): React.ReactElement => {
  onOpenChange = jest.fn();
  return (
    <DatePickerComponent
      selectionType="range"
      label={{ start: 'Start Date', end: 'End Date' }}
      onOpenChange={onOpenChange}
    />
  );
};

DatePickerRangeSelect.play = async () => {
  const { getByRole, queryByText } = within(document.body);
  const startInput = getByRole('combobox', { name: /Start Date/i });
  const endInput = getByRole('combobox', { name: /End Date/i });
  // open
  await userEvent.click(startInput);
  await sleep(400);
  await expect(onOpenChange).toBeCalledWith({ isOpen: true });
  await expect(queryByText('Apply')).toBeVisible();
  // select start date
  const startDateToSelect = dayjs().add(1, 'day');
  await userEvent.click(getByRole('button', { name: startDateToSelect.format('DD MMMM YYYY') }));
  // press next button
  const nextButton = getByRole('button', { name: /Next/i });
  await userEvent.click(nextButton);
  const endDateToSelect = dayjs().add(2, 'month').add(2, 'day');
  await userEvent.click(getByRole('button', { name: endDateToSelect.format('DD MMMM YYYY') }));
  // press apply button
  const applyButton = getByRole('button', { name: /Apply/i });
  await userEvent.click(applyButton);
  await sleep(400);
  await expect(queryByText('Apply')).toBeNull();
  // assert inputs value
  await expect(startInput).toHaveValue(startDateToSelect.format('DD/MM/YYYY'));
  await expect(endInput).toHaveValue(endDateToSelect.format('DD/MM/YYYY'));
  await expect(onOpenChange).toBeCalledTimes(2);
};

export const DatePickerRangeSelectControlled: StoryFn<
  typeof DatePickerComponent
> = (): React.ReactElement => {
  const [value, setValue] = React.useState<DatesRangeValue>(() => [
    new Date(),
    dayjs().add(6, 'day').toDate(),
  ]);

  return (
    <DatePickerComponent
      value={value}
      onChange={(date) => {
        setValue(date);
      }}
      selectionType="range"
      label={{ start: 'Start Date', end: 'End Date' }}
    />
  );
};

DatePickerRangeSelectControlled.play = async () => {
  const { getByRole, queryByText } = within(document.body);
  const startInput = getByRole('combobox', { name: /Start Date/i });
  const endInput = getByRole('combobox', { name: /End Date/i });
  // assert inputs value
  await expect(startInput).toHaveValue(dayjs().format('DD/MM/YYYY'));
  await expect(endInput).toHaveValue(dayjs().add(6, 'day').format('DD/MM/YYYY'));

  // open
  await userEvent.click(startInput);
  await sleep(400);
  await expect(queryByText('Apply')).toBeVisible();
  // select start date
  const startDateToSelect = dayjs().add(1, 'day');
  await userEvent.click(getByRole('button', { name: startDateToSelect.format('DD MMMM YYYY') }));
  // press next button
  const nextButton = getByRole('button', { name: /Next/i });
  await userEvent.click(nextButton);
  const endDateToSelect = dayjs().add(2, 'month').add(2, 'day');
  await userEvent.click(getByRole('button', { name: endDateToSelect.format('DD MMMM YYYY') }));
  // press apply button
  const applyButton = getByRole('button', { name: /Apply/i });
  await userEvent.click(applyButton);
  await sleep(400);
  await expect(queryByText('Apply')).toBeNull();
  // assert inputs value
  await expect(startInput).toHaveValue(startDateToSelect.format('DD/MM/YYYY'));
  await expect(endInput).toHaveValue(endDateToSelect.format('DD/MM/YYYY'));
};

export const DatePickerPresets: StoryFn<typeof DatePickerComponent> = (): React.ReactElement => {
  onOpenChange = jest.fn();
  return (
    <DatePickerComponent
      selectionType="range"
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
      ]}
      onOpenChange={onOpenChange}
    />
  );
};

DatePickerPresets.play = async () => {
  const { getByRole, queryByText } = within(document.body);
  const startInput = getByRole('combobox', { name: /Start Date/i });
  const endInput = getByRole('combobox', { name: /End Date/i });
  // open
  await userEvent.click(startInput);
  await sleep(400);
  await expect(onOpenChange).toBeCalledWith({ isOpen: true });
  await expect(queryByText('Apply')).toBeVisible();
  // select a preset
  await userEvent.click(getByRole('option', { name: /Past 3 days/i }));
  // assert inputs value
  await expect(startInput).toHaveValue(dayjs().subtract(3, 'day').format('DD/MM/YYYY'));
  await expect(endInput).toHaveValue(dayjs().format('DD/MM/YYYY'));
  // press apply button
  const applyButton = getByRole('button', { name: /Apply/i });
  await userEvent.click(applyButton);

  // open again
  await userEvent.click(startInput);
  await sleep(400);
  // assert past 3 days to be selected
  await expect(getByRole('option', { name: /Past 3 days/i })).toHaveAttribute(
    'aria-selected',
    'true',
  );

  // change date to past 7 days manually
  await userEvent.click(
    getByRole('button', { name: dayjs().subtract(7, 'day').format('DD MMMM YYYY') }),
  );
  await userEvent.click(getByRole('button', { name: dayjs().format('DD MMMM YYYY') }));
  await sleep(400);
  // assert past 3 days to be not selected anymore
  await expect(getByRole('option', { name: /Past 3 days/i })).toHaveAttribute(
    'aria-selected',
    'false',
  );
  // assert past 7 days to be selected
  await expect(getByRole('option', { name: /Past 7 days/i })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  // press apply button
  await userEvent.click(applyButton);
  await sleep(400);
  // assert inputs value
  await expect(startInput).toHaveValue(dayjs().subtract(7, 'day').format('DD/MM/YYYY'));
  await expect(endInput).toHaveValue(dayjs().format('DD/MM/YYYY'));
};

const LocaleExample = (): React.ReactElement => {
  onOpenChange = jest.fn();
  const { setI18nState } = useI18nContext();

  return (
    <Box>
      <Button onClick={() => setI18nState?.({ locale: 'hi-IN' })}>Change locale</Button>
      <DatePickerComponent onOpenChange={onOpenChange} label="Select Date" />
    </Box>
  );
};

export const Localization: StoryFn<typeof DatePickerComponent> = (): React.ReactElement => {
  return (
    <I18nProvider initData={{ locale: 'en-IN' }}>
      <LocaleExample />
    </I18nProvider>
  );
};

Localization.play = async () => {
  const { getByRole, queryByText } = within(document.body);
  const input = getByRole('combobox', { name: /Select Date/i });
  // open
  await userEvent.click(input);
  await sleep(400);
  await expect(onOpenChange).toBeCalledWith({ isOpen: true });
  await expect(queryByText('Apply')).toBeVisible();
  // expect hindi locale
  await expect(queryByText('Sun')).toBeVisible();

  // click apply
  const applyButton = getByRole('button', { name: /Apply/i });
  await userEvent.click(applyButton);
  await sleep(400);

  // click change locale
  const changeLocaleButton = getByRole('button', { name: /Change locale/i });
  await userEvent.click(changeLocaleButton);
  await sleep(400);

  // open
  await userEvent.click(input);
  await sleep(400);
  await expect(queryByText('रवि')).toBeVisible();
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
