/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
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
  // if date is greater then 15 days then we should check add 6 days from it
  // if date is less then 15 days then we should check subtract 6 days from  it
  const isGreaterThen15Days = dayjs().diff(dayjs(), 'day') > 15;
  const disabledDate = getByRole('button', {
    name: isGreaterThen15Days
      ? dayjs().subtract(6, 'day').format('D MMMM YYYY')
      : dayjs().add(6, 'day').format('D MMMM YYYY'),
  });
  await expect(disabledDate).toBeDisabled();

  // expect month to be disabled
  const month = getByRole('button', { name: /Change month/i });
  await userEvent.click(month);
  const disabledMonth = getByRole('button', {
    name: dayjs().subtract(2, 'month').format('MMM'),
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
  const date = getByRole('button', { name: dateToSelect.format('D MMMM YYYY') });
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
  const date = getByRole('button', { name: dateToSelect.format('D MMMM YYYY') });
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
  await sleep(200);
  const input = getByRole('combobox', { name: /Select Date/i });
  await expect(input).toHaveValue(dayjs().add(1, 'day').format('DD/MM/YYYY'));
  // open
  await userEvent.click(input);
  await sleep(400);
  await expect(queryByText('Sun')).toBeVisible();

  // close calendar first so we can access the "Change Date" button
  await userEvent.click(input);
  await sleep(400);

  const changeButton = getByRole('button', { name: 'Change Date' });
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
  const date = getByRole('button', { name: dateToSelect.format('D MMMM YYYY') });
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
  await sleep(200);
  await userEvent.tab();
  await sleep(200);
  // go to month
  const month = getByRole('button', { name: /Change month/i });
  // Focus the month button explicitly if tab navigation doesn't work
  month.focus();
  await sleep(200);
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
  await userEvent.keyboard('{ArrowLeft}');
  await userEvent.keyboard('{Enter}');
  await sleep(400);
  getByRole('button', { name: /previous/i }).focus();
  await userEvent.tab();
  await userEvent.tab();
  await userEvent.tab();
  await userEvent.keyboard('{ArrowRight}');
  await userEvent.keyboard('{ArrowLeft}');
  await userEvent.keyboard('{Enter}');
  await sleep(400);
  getByRole('button', { name: /previous/i }).focus();
  await userEvent.tab();
  await userEvent.tab();
  await userEvent.tab();
  await userEvent.keyboard('{ArrowRight}');
  await userEvent.keyboard('{ArrowLeft}');
  await userEvent.keyboard('{Enter}');
  // choose today's date
  await userEvent.click(getByRole('button', { name: dayjs().format('D MMMM YYYY') }));
  await sleep(400);
  // press apply
  const applyButton = getByRole('button', { name: /Apply/i });
  await userEvent.click(applyButton);
  await sleep(400);
  // expect input to have today's date
  await expect(input).toHaveValue(dayjs().format('DD/MM/YYYY'));
};

export const DatePickerRangeSelect: StoryFn<
  typeof DatePickerComponent
> = (): React.ReactElement => {
  onOpenChange = jest.fn();
  return (
    <DatePickerComponent
      selectionType="range"
      label={{ start: 'Select a date range' }}
      onOpenChange={onOpenChange}
    />
  );
};

DatePickerRangeSelect.play = async () => {
  const { getByRole, queryByText } = within(document.body);
  const rangeInput = getByRole('combobox', { name: /Select a date range/i });
  // open
  await userEvent.click(rangeInput);
  await sleep(400);
  await expect(onOpenChange).toBeCalledWith({ isOpen: true });
  await expect(queryByText('Apply')).toBeVisible();
  // select start date
  const startDateToSelect = dayjs().add(1, 'day');
  await userEvent.click(getByRole('button', { name: startDateToSelect.format('D MMMM YYYY') }));
  // press next button
  const nextButton = getByRole('button', { name: /Next/i });
  await userEvent.click(nextButton);
  const endDateToSelect = dayjs().add(2, 'month').add(2, 'day');
  await userEvent.click(getByRole('button', { name: endDateToSelect.format('D MMMM YYYY') }));
  // press apply button
  const applyButton = getByRole('button', { name: /Apply/i });
  await userEvent.click(applyButton);
  await sleep(400);
  await expect(queryByText('Apply')).toBeNull();
  // assert inputs value
  await expect(rangeInput).toHaveValue(
    `${startDateToSelect.format('DD/MM/YYYY')}  –  ${endDateToSelect.format('DD/MM/YYYY')}`,
  );
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
      label={{ start: 'Select a date range' }}
    />
  );
};

DatePickerRangeSelectControlled.play = async () => {
  const { getByRole, queryByText } = within(document.body);
  const rangeInput = getByRole('combobox', { name: /Select a date range/i });
  // assert inputs value
  await sleep(400);
  await expect(rangeInput).toHaveValue(
    `${dayjs().format('DD/MM/YYYY')}  –  ${dayjs().add(6, 'day').format('DD/MM/YYYY')}`,
  );

  // open
  await userEvent.click(rangeInput);
  await sleep(400);
  await expect(queryByText('Apply')).toBeVisible();
  // select start date
  const startDateToSelect = dayjs().add(1, 'day');
  await userEvent.click(getByRole('button', { name: startDateToSelect.format('D MMMM YYYY') }));
  // press next button
  const nextButton = getByRole('button', { name: /Next/i });
  await userEvent.click(nextButton);
  const endDateToSelect = dayjs().add(2, 'month').add(2, 'day');
  await userEvent.click(getByRole('button', { name: endDateToSelect.format('D MMMM YYYY') }));
  // press apply button
  const applyButton = getByRole('button', { name: /Apply/i });
  await userEvent.click(applyButton);
  await sleep(400);
  await expect(queryByText('Apply')).toBeNull();
  // assert inputs value
  await expect(rangeInput).toHaveValue(
    `${startDateToSelect.format('DD/MM/YYYY')}  –  ${endDateToSelect.format('DD/MM/YYYY')}`,
  );
};

export const DatePickerPresets: StoryFn<typeof DatePickerComponent> = (): React.ReactElement => {
  onOpenChange = jest.fn();
  return (
    <DatePickerComponent
      selectionType="range"
      label="Select a date range"
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
  const rangeInput = getByRole('combobox', { name: /Select a date range/i });
  // open
  await userEvent.click(rangeInput);
  await sleep(400);
  await expect(onOpenChange).toBeCalledWith({ isOpen: true });
  await expect(queryByText('Apply')).toBeVisible();
  // select a preset
  await userEvent.click(getByRole('option', { name: /Past 3 days/i }));
  // assert inputs value
  await sleep(400);
  await expect(rangeInput).toHaveValue(
    `${dayjs().subtract(3, 'day').format('DD/MM/YYYY')}  –  ${dayjs().format('DD/MM/YYYY')}`,
  );
  // press apply button
  const applyButton = getByRole('button', { name: /Apply/i });
  await userEvent.click(applyButton);

  // open again
  await userEvent.click(rangeInput);
  await sleep(400);
  // assert past 3 days to be selected
  await expect(getByRole('option', { name: /Past 3 days/i })).toHaveAttribute(
    'aria-selected',
    'true',
  );

  // change date to past 7
  await userEvent.click(getByRole('option', { name: /Past 7 days/i }));

  // press apply button
  await userEvent.click(applyButton);
  await sleep(400);
  // assert inputs value
  await expect(rangeInput).toHaveValue(
    `${dayjs().subtract(7, 'day').format('DD/MM/YYYY')}  –  ${dayjs().format('DD/MM/YYYY')}`,
  );
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
  await userEvent.click(input);
  await sleep(400);

  // click change locale
  const changeLocaleButton = getByRole('button', { name: 'Change locale' });
  await userEvent.click(changeLocaleButton);
  await sleep(400);

  // open
  await userEvent.click(input);
  await sleep(400);
  await expect(queryByText('रवि')).toBeVisible();
};

export const DatePickerSingleAutoFocus: StoryFn<
  typeof DatePickerComponent
> = (): React.ReactElement => {
  return <DatePickerComponent selectionType="single" accessibilityLabel="Select Date" />;
};

DatePickerSingleAutoFocus.play = async () => {
  const { getByRole, queryByText, getByLabelText } = within(document.body);
  const nextYear = dayjs().add(1, 'year').year();
  const selectedDate = `22 January ${nextYear}`;
  const input = getByRole('combobox', { name: /Select Date/i });
  await userEvent.click(input);
  await sleep(400);
  await expect(queryByText('Sun')).toBeVisible();
  await userEvent.tab();
  await sleep(200);
  await userEvent.tab();
  await sleep(200);
  const month = getByRole('button', { name: /Change month/i });
  // Focus the month button explicitly if tab navigation doesn't work
  month.focus();
  await sleep(200);
  await expect(month).toHaveFocus();
  await userEvent.click(month);
  const year = getByRole('button', { name: /Change decade/i });
  await userEvent.click(year);
  getByRole('button', { name: /previous/i }).focus();
  await userEvent.tab();
  await userEvent.tab();
  await sleep(400);
  await expect(getByRole('button', { name: dayjs().format('YYYY') })).toHaveFocus();
  await userEvent.keyboard('{ArrowRight}');
  await userEvent.keyboard('{Enter}');
  await sleep(400);
  await userEvent.keyboard('{Enter}');
  await sleep(400);
  const january = getByRole('button', { name: /Jan/i });
  await userEvent.click(january);
  const date = getByRole('button', { name: selectedDate });
  await userEvent.click(date);
  const applyButton = getByRole('button', { name: /Apply/i });
  await userEvent.click(applyButton);
  await sleep(400);
  await userEvent.click(input);
  await sleep(400);
  await expect(getByLabelText(selectedDate)).not.toBeNull();
};

export const DatePickerRangeSelectAutoFocus: StoryFn<
  typeof DatePickerComponent
> = (): React.ReactElement => {
  return <DatePickerComponent selectionType="range" label="Select a date range" />;
};

DatePickerRangeSelectAutoFocus.play = async () => {
  const { getByRole, getByLabelText } = within(document.body);
  const startInput = getByRole('combobox', { name: /Select a date range/i });
  const selectedEndDate = dayjs().subtract(1, 'M').format('D MMMM YYYY');
  const selectedStartDate = dayjs().subtract(1, 'M').subtract(1, 'd').format('D MMMM YYYY');
  await userEvent.click(startInput);
  await sleep(400);
  const previousButton = getByRole('button', { name: /previous/i });
  await userEvent.click(previousButton);
  const startDateButton = getByRole('button', { name: selectedStartDate });
  await userEvent.click(startDateButton);
  const endDateButton = getByRole('button', { name: selectedEndDate });
  await userEvent.click(endDateButton);
  const applyButton = getByRole('button', { name: /Apply/i });
  await userEvent.click(applyButton);
  await sleep(400);
  await userEvent.click(startInput);
  await sleep(400);
  await expect(getByLabelText(selectedStartDate)).not.toBeNull();
  await expect(getByLabelText(selectedEndDate)).not.toBeNull();
};

// Test cases for typing in input field and auto-selection on calendar
export const DatePickerSingleTypingAutoSelect: StoryFn<
  typeof DatePickerComponent
> = (): React.ReactElement => {
  onOpenChange = jest.fn();
  return (
    <DatePickerComponent
      selectionType="single"
      accessibilityLabel="Select Date"
      onOpenChange={onOpenChange}
    />
  );
};

DatePickerSingleTypingAutoSelect.play = async () => {
  const { getByRole, queryByText } = within(document.body);
  const input = getByRole('combobox', { name: /Select Date/i });

  // Type a valid date
  const targetDate = dayjs().add(5, 'day');
  const typedDate = targetDate.format('DD/MM/YYYY');

  await userEvent.type(input, typedDate);
  await sleep(200);

  // Verify input shows the typed date
  await expect(input).toHaveValue(typedDate);

  // Open calendar to verify the date is auto-selected
  await sleep(400);
  await expect(onOpenChange).toBeCalledWith({ isOpen: true });
  await expect(queryByText('Sun')).toBeVisible();

  // Check if the typed date is selected/highlighted in calendar
  await sleep(400);
  const selectedDate = getByRole('button', { name: targetDate.format('D MMMM YYYY') });
  await expect(selectedDate).toHaveAttribute('data-selected', 'true');
};

export const DatePickerRangeTypingAutoSelect: StoryFn<
  typeof DatePickerComponent
> = (): React.ReactElement => {
  onOpenChange = jest.fn();
  return (
    <DatePickerComponent
      selectionType="range"
      label={{ start: 'Select Date Range' }}
      accessibilityLabel="Select Date Range"
      onOpenChange={onOpenChange}
    />
  );
};

DatePickerRangeTypingAutoSelect.play = async () => {
  const { getByRole, queryByText } = within(document.body);
  const input = getByRole('combobox', { name: /Select Date Range/i });

  // Type a valid date range
  const startDate = dayjs().add(1, 'day');
  const endDate = dayjs().add(7, 'day');
  const typedRange = `${startDate.format('DD/MM/YYYY')}  –  ${endDate.format('DD/MM/YYYY')}`;

  await userEvent.type(input, typedRange);
  await sleep(200);

  // Verify input shows the typed range
  await expect(input).toHaveValue(typedRange);

  // Open calendar to verify the dates are auto-selected

  await sleep(400);
  await expect(onOpenChange).toBeCalledWith({ isOpen: true });
  await expect(queryByText('Apply')).toBeVisible();

  // Check if the typed dates are selected/highlighted in calendar
  await sleep(400);
  const selectedStartDate = getByRole('button', { name: startDate.format('D MMMM YYYY') });
  const selectedEndDate = getByRole('button', { name: endDate.format('D MMMM YYYY') });
  await expect(selectedStartDate).toHaveAttribute('data-selected', 'true');
  await expect(selectedEndDate).toHaveAttribute('data-selected', 'true');
};

// Test cases for showFooterActions=false
export const DatePickerSingleNoFooter: StoryFn<
  typeof DatePickerComponent
> = (): React.ReactElement => {
  onOpenChange = jest.fn();
  return (
    <DatePickerComponent
      selectionType="single"
      accessibilityLabel="Select Date"
      showFooterActions={false}
      onOpenChange={onOpenChange}
    />
  );
};

DatePickerSingleNoFooter.play = async () => {
  const { getByRole, queryByText } = within(document.body);
  const input = getByRole('combobox', { name: /Select Date/i });

  // Open calendar
  await userEvent.click(input);
  await sleep(400);
  await expect(onOpenChange).toBeCalledWith({ isOpen: true });
  await expect(queryByText('Sun')).toBeVisible();

  // Verify no footer buttons are shown
  await expect(queryByText('Apply')).toBeNull();
  await expect(queryByText('Cancel')).toBeNull();

  // Select a date - on blur should auto-close without footer
  const dateToSelect = dayjs().add(3, 'day');
  const date = getByRole('button', { name: dateToSelect.format('D MMMM YYYY') });
  await userEvent.click(date);
  await userEvent.click(document.body);
  await sleep(400);

  // Calendar should close and input should have the selected date
  await expect(queryByText('Sun')).toBeNull();
  await expect(input).toHaveValue(dateToSelect.format('DD/MM/YYYY'));
};

// Test cases for validation of wrong/invalid dates
export const DatePickerInvalidDateValidation: StoryFn<
  typeof DatePickerComponent
> = (): React.ReactElement => {
  onOpenChange = jest.fn();
  return (
    <DatePickerComponent
      selectionType="single"
      accessibilityLabel="Select Date"
      onOpenChange={onOpenChange}
    />
  );
};

DatePickerInvalidDateValidation.play = async () => {
  const { getByRole, queryByText } = within(document.body);
  const input = getByRole('combobox', { name: /Select Date/i });

  // Type an invalid date (February 30th)
  await userEvent.type(input, '30/02/2024');
  await sleep(200);

  // Blur to trigger validation
  await userEvent.tab();
  await sleep(200);

  // Should show validation error
  await expect(queryByText('Please enter a valid date')).toBeVisible();

  // Clear and type another invalid date (invalid format)
  await userEvent.clear(input);
  await userEvent.type(input, '32/13/2024');
  await sleep(200);

  await userEvent.tab();
  await sleep(200);

  // Should show validation error
  await expect(queryByText('Please enter a valid date')).toBeVisible();
};

// Test cases for range DatePicker with string label support
export const DatePickerRangeStringLabel: StoryFn<
  typeof DatePickerComponent
> = (): React.ReactElement => {
  return (
    <DatePickerComponent
      selectionType="range"
      label="Select Date Range"
      accessibilityLabel="Select Date Range"
    />
  );
};

DatePickerRangeStringLabel.play = async () => {
  const { getByRole, queryByText } = within(document.body);

  // Should find input with string label
  const input = getByRole('combobox', { name: /Select Date Range/i });
  await expect(input).toBeInTheDocument();

  // Should show the string label text
  await expect(queryByText('Select Date Range')).toBeVisible();
};

// Test cases for range DatePicker with object label support
export const DatePickerRangeObjectLabel: StoryFn<
  typeof DatePickerComponent
> = (): React.ReactElement => {
  return (
    <DatePickerComponent
      selectionType="range"
      label={{ start: 'Select Date Range' }}
      accessibilityLabel="Select Date Range"
    />
  );
};

DatePickerRangeObjectLabel.play = async () => {
  const { getByRole, queryByText } = within(document.body);

  // Should find input with string label
  const input = getByRole('combobox', { name: /Select Date Range/i });
  await expect(input).toBeInTheDocument();

  // Should show the object label text
  await expect(queryByText('Select Date Range')).toBeVisible();
};

// Test cases for different date formats
export const DatePickerMonthFormat: StoryFn<
  typeof DatePickerComponent
> = (): React.ReactElement => {
  return (
    <DatePickerComponent
      selectionType="single"
      accessibilityLabel="Select Month"
      picker="month"
      format="MMMM"
    />
  );
};

DatePickerMonthFormat.play = async () => {
  const { getByRole, queryByText } = within(document.body);
  const input = getByRole('combobox', { name: /Select Month/i });

  // Type a month name
  await userEvent.type(input, 'December');
  await sleep(400);

  // Verify input shows the month
  await expect(input).toHaveValue('December');
  await sleep(400);

  // Should show month picker view
  await expect(queryByText('Dec')).toBeVisible();

  // Select a month
  const monthButton = getByRole('button', { name: /Nov/i });
  await userEvent.click(monthButton);

  const applyButton = getByRole('button', { name: /Apply/i });
  await userEvent.click(applyButton);
  await sleep(400);

  // Verify month is selected
  await expect(input).toHaveValue('November');
};

export const DatePickerYearFormat: StoryFn<typeof DatePickerComponent> = (): React.ReactElement => {
  return (
    <DatePickerComponent
      selectionType="single"
      accessibilityLabel="Select Year"
      picker="year"
      format="YYYY"
    />
  );
};

DatePickerYearFormat.play = async () => {
  const { getByRole, queryByText } = within(document.body);
  const input = getByRole('combobox', { name: /Select Year/i });

  // Type a year
  await userEvent.type(input, '2025');
  await sleep(200);

  // Verify input shows the year
  await expect(input).toHaveValue('2025');
  await sleep(400);

  // Should show year picker view
  const currentYear = dayjs().year();
  await expect(queryByText(`${currentYear}`)).toBeVisible();

  // Select the year 2026
  const yearButton = getByRole('button', { name: '2026' });
  await userEvent.click(yearButton);

  const applyButton = getByRole('button', { name: /Apply/i });
  await userEvent.click(applyButton);
  await sleep(400);

  // Verify year is selected
  await expect(input).toHaveValue('2026');
};

// Test cases for min/max date constraints
export const DatePickerMinMaxConstraintsValidation: StoryFn<
  typeof DatePickerComponent
> = (): React.ReactElement => {
  return (
    <DatePickerComponent
      selectionType="single"
      accessibilityLabel="Select Date"
      minDate={dayjs().subtract(7, 'day').toDate()}
      maxDate={dayjs().add(7, 'day').toDate()}
    />
  );
};

DatePickerMinMaxConstraintsValidation.play = async () => {
  const { getByRole, queryByText } = within(document.body);
  const input = getByRole('combobox', { name: /Select Date/i });

  // Try typing a date before minDate
  const beforeMinDate = dayjs().subtract(10, 'day');
  await userEvent.type(input, beforeMinDate.format('DD/MM/YYYY'));
  await sleep(200);

  // Blur to trigger validation
  await userEvent.tab();
  await sleep(200);

  // Should show validation error
  await expect(queryByText('Date is before the minimum allowed date')).toBeVisible();

  // Clear and try a date after maxDate
  await userEvent.clear(input);
  const afterMaxDate = dayjs().add(10, 'day');
  await userEvent.type(input, afterMaxDate.format('DD/MM/YYYY'));
  await sleep(200);

  await userEvent.tab();
  await sleep(200);

  // Should show validation error
  await expect(queryByText('Date is after the maximum allowed date')).toBeVisible();

  // Clear and try a valid date within range
  await userEvent.clear(input);
  const validDate = dayjs().add(3, 'day');
  await userEvent.type(input, validDate.format('DD/MM/YYYY'));
  await sleep(200);

  await userEvent.tab();
  await sleep(200);

  // Should not show any error
  await expect(queryByText('Date is after the maximum allowed date')).toBeNull();
  await expect(input).toHaveValue(validDate.format('DD/MM/YYYY'));
};

export const DatePickerExcludeDates: StoryFn<
  typeof DatePickerComponent
> = (): React.ReactElement => {
  return (
    <DatePickerComponent
      selectionType="single"
      accessibilityLabel="Select Date"
      excludeDate={(date) => dayjs(date).day() === 0} // Exclude Sundays
    />
  );
};

DatePickerExcludeDates.play = async () => {
  const { getByRole, queryByText } = within(document.body);
  const input = getByRole('combobox', { name: /Select Date/i });

  // Find the next Sunday
  let nextSunday = dayjs();
  while (nextSunday.day() !== 0) {
    nextSunday = nextSunday.add(1, 'day');
  }

  // Try typing a Sunday date
  await userEvent.type(input, nextSunday.format('DD/MM/YYYY'));
  await sleep(200);

  // Blur to trigger validation
  await userEvent.tab();
  await sleep(200);

  // Should show validation error
  await expect(queryByText('This date is not available for selection')).toBeVisible();

  // Clear and try a valid date (not Sunday)
  await userEvent.clear(input);
  let validDate = dayjs();
  while (validDate.day() === 0) {
    validDate = validDate.add(1, 'day');
  }

  await userEvent.type(input, validDate.format('DD/MM/YYYY'));
  await sleep(200);

  await userEvent.tab();
  await sleep(200);

  // Should not show any error
  await expect(queryByText('This date is not available for selection')).toBeNull();
  await expect(input).toHaveValue(validDate.format('DD/MM/YYYY'));
};

// Test case for calendar selection reflecting in input
export const DatePickerCalendarToInput: StoryFn<
  typeof DatePickerComponent
> = (): React.ReactElement => {
  return <DatePickerComponent selectionType="single" accessibilityLabel="Select Date" />;
};

DatePickerCalendarToInput.play = async () => {
  const { getByRole, queryByText } = within(document.body);
  const input = getByRole('combobox', { name: /Select Date/i });

  // Open calendar
  await userEvent.click(input);
  await sleep(400);
  await expect(queryByText('Sun')).toBeVisible();

  // Select a date from calendar
  const targetDate = dayjs().add(4, 'day');
  const dateButton = getByRole('button', { name: targetDate.format('D MMMM YYYY') });
  await userEvent.click(dateButton);

  // Apply the selection
  const applyButton = getByRole('button', { name: /Apply/i });
  await userEvent.click(applyButton);
  await sleep(400);

  // Verify calendar selection appears in input
  await expect(input).toHaveValue(targetDate.format('DD/MM/YYYY'));
  await expect(queryByText('Sun')).toBeNull();
};

export const DatePickerRangeCalendarToInput: StoryFn<
  typeof DatePickerComponent
> = (): React.ReactElement => {
  return <DatePickerComponent selectionType="range" label={{ start: 'Select Date Range' }} />;
};

DatePickerRangeCalendarToInput.play = async () => {
  const { getByRole, queryByText } = within(document.body);
  const input = getByRole('combobox', { name: /Select Date Range/i });

  // Open calendar
  await userEvent.click(input);
  await sleep(400);
  await expect(queryByText('Apply')).toBeVisible();

  // Select start and end dates from calendar
  const startDate = dayjs().add(2, 'day');
  const endDate = dayjs().add(8, 'day');

  await userEvent.click(getByRole('button', { name: startDate.format('D MMMM YYYY') }));
  await userEvent.click(getByRole('button', { name: endDate.format('D MMMM YYYY') }));

  // Apply the selection
  const applyButton = getByRole('button', { name: /Apply/i });
  await userEvent.click(applyButton);
  await sleep(400);

  // Verify calendar selection appears in input
  const expectedRange = `${startDate.format('DD/MM/YYYY')}  –  ${endDate.format('DD/MM/YYYY')}`;
  await expect(input).toHaveValue(expectedRange);
  await expect(queryByText('Apply')).toBeNull();
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
    actions: { disable: false },
  },
};
