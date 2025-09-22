/* eslint-disable import/no-extraneous-dependencies */
import type { StoryFn } from '@storybook/react';
import { within, userEvent } from '@storybook/testing-library';
import { expect, jest } from '@storybook/jest';
import type { Mock } from 'jest-mock';
import React, { useState } from 'react';
import { TimePicker as TimePickerComponent } from '../';
import { Box } from '~components/Box';
import { Button } from '~components/Button';

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

let onOpenChange: Mock<void, [{ isOpen: boolean }]> | null = null;
let onApply: Mock<void, [{ value: Date | null }]> | null = null;
let onChange: Mock<void, [{ value: Date | null }]> | null = null;

const ControlledTimePicker = ({
  initialValue = null,
  timeFormat = '12h',
  ...props
}: {
  initialValue?: Date | null;
  timeFormat?: '12h' | '24h';
  [key: string]: unknown;
}): React.ReactElement => {
  const [time, setTime] = useState<Date | null>(initialValue);
  return (
    <TimePickerComponent
      label="Select time"
      timeFormat={timeFormat}
      value={time}
      onChange={({ value }) => setTime(value)}
      {...props}
    />
  );
};

export const TimePickerShouldOpenDropdown: StoryFn<
  typeof TimePickerComponent
> = (): React.ReactElement => {
  onOpenChange = jest.fn();
  return <ControlledTimePicker onOpenChange={onOpenChange} />;
};

TimePickerShouldOpenDropdown.play = async () => {
  const { getByRole, queryByText } = within(document.body);
  const input = getByRole('combobox');

  // open dropdown
  await userEvent.click(input);
  await sleep(400);
  await expect(onOpenChange).toBeCalledWith({ isOpen: true });
  await expect(queryByText('Cancel')).toBeVisible();
  await expect(queryByText('Apply')).toBeVisible();

  // close dropdown by clicking outside
  await userEvent.click(document.body);
  await sleep(400);
  await expect(onOpenChange).toBeCalledWith({ isOpen: false });
  await expect(queryByText('Cancel')).not.toBeInTheDocument();
};

export const TimePicker12HourFormat: StoryFn<
  typeof TimePickerComponent
> = (): React.ReactElement => {
  const defaultTime = new Date('2024-01-01T14:30:00'); // 2:30 PM
  return <ControlledTimePicker initialValue={defaultTime} timeFormat="12h" />;
};

TimePicker12HourFormat.play = async () => {
  const { getByRole } = within(document.body);
  const input = getByRole('combobox');

  // Wait for React Aria to initialize the TimePicker segments
  await sleep(300);

  // Check values in the input before opening dropdown
  const timeInput = document.querySelector('.timepicker-input');
  const inputScope = timeInput ? within(timeInput as HTMLElement) : within(document.body);

  // Should display 2:30 PM in the input initially
  await expect(inputScope.queryByText('02')).toBeVisible(); // 2 PM in input
  await expect(inputScope.queryByText('30')).toBeVisible(); // 30 minutes in input
  await expect(inputScope.getAllByText('PM')[0]).toBeVisible(); // PM in input (actual value, not placeholder)

  await userEvent.click(input);
  await sleep(400);

  // Find the dropdown content container
  const dropdownContent = document.querySelector('.timepicker-content');
  const dropdownScope = dropdownContent
    ? within(dropdownContent as HTMLElement)
    : within(document.body);

  // Should display PM in 12h format in dropdown
  await expect(dropdownScope.queryByText('PM')).toBeVisible();
};

export const TimePicker24HourFormat: StoryFn<
  typeof TimePickerComponent
> = (): React.ReactElement => {
  const defaultTime = new Date('2024-01-01T14:30:00'); // 14:30
  return <ControlledTimePicker initialValue={defaultTime} timeFormat="24h" />;
};

TimePicker24HourFormat.play = async () => {
  const { getByRole } = within(document.body);
  const input = getByRole('combobox');

  // Wait for React Aria to initialize the TimePicker segments
  await sleep(300);

  // Check values in the input before opening dropdown
  const timeInput = document.querySelector('.timepicker-input');
  const inputScope = timeInput ? within(timeInput as HTMLElement) : within(document.body);

  // Should display 14:30 in the input initially (24h format)
  await expect(inputScope.queryByText('14')).toBeVisible(); // 14 hours in input
  await expect(inputScope.queryByText('30')).toBeVisible(); // 30 minutes in input
  // AM/PM should not be in input for 24h format
  await expect(inputScope.queryByText('AM')).not.toBeInTheDocument();
  await expect(inputScope.queryByText('PM')).not.toBeInTheDocument();

  await userEvent.click(input);
  await sleep(400);

  // Find the dropdown content container
  const dropdownContent = document.querySelector('.timepicker-content');
  const dropdownScope = dropdownContent
    ? within(dropdownContent as HTMLElement)
    : within(document.body);

  // In 24h format, AM/PM should not be visible in dropdown either
  await expect(dropdownScope.queryByText('AM')).not.toBeInTheDocument();
  await expect(dropdownScope.queryByText('PM')).not.toBeInTheDocument();
};

export const TimePickerApplyCancelActions: StoryFn<
  typeof TimePickerComponent
> = (): React.ReactElement => {
  onApply = jest.fn();
  return (
    <TimePickerComponent
      label="Select time"
      timeFormat="12h"
      showFooterActions={true}
      onApply={onApply}
    />
  );
};

TimePickerApplyCancelActions.play = async () => {
  const { getByRole } = within(document.body);
  const input = getByRole('combobox');

  await userEvent.click(input);
  await sleep(400);

  // Should have Apply and Cancel buttons
  await expect(getByRole('button', { name: /apply/i })).toBeVisible();
  await expect(getByRole('button', { name: /cancel/i })).toBeVisible();

  // Click Apply button
  const applyButton = getByRole('button', { name: /apply/i });
  await userEvent.click(applyButton);
  await sleep(200);

  await expect(onApply).toHaveBeenCalled();
};

export const TimePickerMinuteSteps: StoryFn<
  typeof TimePickerComponent
> = (): React.ReactElement => {
  return <TimePickerComponent label="Select time" timeFormat="12h" minuteStep={15} />;
};

TimePickerMinuteSteps.play = async () => {
  const { getByRole, queryByText } = within(document.body);
  const input = getByRole('combobox');

  await userEvent.click(input);
  await sleep(400);

  // With 15-minute steps, should see options like 00, 15, 30, 45
  await expect(queryByText('15')).toBeVisible();
  await expect(queryByText('30')).toBeVisible();
  await expect(queryByText('45')).toBeVisible();
};

export const TimePickerKeyboardNavigation: StoryFn<
  typeof TimePickerComponent
> = (): React.ReactElement => {
  const defaultTime = new Date('2024-01-01T14:30:00');
  return <ControlledTimePicker initialValue={defaultTime} timeFormat="12h" />;
};

TimePickerKeyboardNavigation.play = async () => {
  const { getByRole } = within(document.body);
  const input = getByRole('combobox');

  // Focus the input
  await userEvent.click(input);
  await sleep(200);

  // Tab to navigate between time segments
  await userEvent.tab();
  await sleep(200);

  // Use arrow keys to change values
  await userEvent.keyboard('{ArrowUp}');
  await sleep(200);
  await userEvent.keyboard('{ArrowDown}');
  await sleep(200);

  // Should open the dropdown
  await expect(within(document.body).queryByText('Apply')).toBeVisible();
};

export const TimePickerWithoutFooterActions: StoryFn<
  typeof TimePickerComponent
> = (): React.ReactElement => {
  return <TimePickerComponent label="Select time" timeFormat="12h" showFooterActions={false} />;
};

TimePickerWithoutFooterActions.play = async () => {
  const { getByRole, queryByRole } = within(document.body);
  const input = getByRole('combobox');

  await userEvent.click(input);
  await sleep(400);

  // Footer actions should not be present
  await expect(queryByRole('button', { name: /apply/i })).not.toBeInTheDocument();
  await expect(queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument();
};

export const TimePickerControlledState: StoryFn<
  typeof TimePickerComponent
> = (): React.ReactElement => {
  const [value, setValue] = useState<Date | null>(() => {
    const time = new Date();
    time.setHours(10, 30, 0, 0);
    return time;
  });

  onChange = jest.fn((timeValue) => setValue(timeValue.value));

  return (
    <Box>
      <Button
        onClick={() => {
          const newTime = new Date();
          newTime.setHours(15, 45, 0, 0);
          setValue(newTime);
        }}
      >
        Change Time
      </Button>
      <TimePickerComponent label="Select time" timeFormat="12h" value={value} onChange={onChange} />
    </Box>
  );
};

TimePickerControlledState.play = async () => {
  const { getByRole } = within(document.body);

  // Wait for React Aria to initialize the TimePicker segments
  await sleep(300);

  // Check initial values in the input
  const timeInput = document.querySelector('.timepicker-input');
  const inputScope = timeInput ? within(timeInput as HTMLElement) : within(document.body);

  // Should start with 10:30 AM in input
  await expect(inputScope.queryByText('10')).toBeVisible();
  await expect(inputScope.queryByText('30')).toBeVisible();
  await expect(inputScope.getAllByText('AM')[0]).toBeVisible(); // AM in input (actual value, not placeholder)

  // Click change time button
  const changeButton = getByRole('button', { name: 'Change Time' });
  await userEvent.click(changeButton);
  await sleep(200);

  // Check updated values in the input after change
  const timeInput2 = document.querySelector('.timepicker-input');
  const inputScope2 = timeInput2 ? within(timeInput2 as HTMLElement) : within(document.body);

  // Should now show 3:45 PM in input
  await expect(inputScope2.queryByText('03')).toBeVisible();
  await expect(inputScope2.queryByText('45')).toBeVisible();
  await expect(inputScope2.getAllByText('PM')[0]).toBeVisible(); // PM in input (actual value, not placeholder)

  // Verify dropdown also shows correct values
};

export const TimePickerDisabled: StoryFn<typeof TimePickerComponent> = (): React.ReactElement => {
  onOpenChange = jest.fn();
  return (
    <TimePickerComponent
      label="Select time"
      timeFormat="12h"
      isDisabled={true}
      onOpenChange={onOpenChange}
    />
  );
};

TimePickerDisabled.play = async () => {
  const { getByRole } = within(document.body);
  const input = getByRole('combobox');

  await userEvent.click(input);
  await sleep(400);

  // Should not open dropdown when disabled
  await expect(onOpenChange).not.toBeCalled();
};

export const TimePickerSpinWheelInteraction: StoryFn<
  typeof TimePickerComponent
> = (): React.ReactElement => {
  onChange = jest.fn();
  return (
    <TimePickerComponent
      label="Select time"
      timeFormat="12h"
      showFooterActions={true}
      onChange={onChange}
    />
  );
};

TimePickerSpinWheelInteraction.play = async () => {
  const { getByRole } = within(document.body);
  const input = getByRole('combobox');

  await userEvent.click(input);
  await sleep(400);

  // Find the dropdown content container
  const dropdownContent = document.querySelector('.timepicker-content');
  const dropdownScope = dropdownContent
    ? within(dropdownContent as HTMLElement)
    : within(document.body);

  // Should see spin wheels with AM/PM period options
  await expect(dropdownScope.queryByText('AM')).toBeVisible();

  // Scope to specific wheels to avoid conflicts
  const hourWheel = document.querySelector('.timepicker-hour-wheel');
  const hourWheelScope = hourWheel ? within(hourWheel as HTMLElement) : within(document.body);

  // Click on a different hour
  const hour02 = hourWheelScope.queryByText('02');
  if (hour02) {
    await userEvent.click(hour02);
    await sleep(200);
  }

  // Click on a different minute
  const minuteWheel = document.querySelector('.timepicker-minute-wheel');
  const minuteWheelScope = minuteWheel ? within(minuteWheel as HTMLElement) : within(document.body);

  const minute30 = minuteWheelScope.queryByText('30');
  if (minute30) {
    await userEvent.click(minute30);
    await sleep(200);
  }

  // Click Apply
  const applyButton = getByRole('button', { name: /apply/i });
  await userEvent.click(applyButton);
  await sleep(400);

  // Should have called onChange
  await expect(onChange).toHaveBeenCalled();
};

export default {
  title: 'Components/Interaction Tests/TimePicker',
  component: TimePickerComponent,
  parameters: {
    controls: {
      disable: true,
    },
    a11y: { disable: true },
    essentials: { disable: true },
    actions: { disable: false },
  },
};
