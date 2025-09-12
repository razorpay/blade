# TimePicker

## Description

The TimePicker component is a comprehensive time selection input that supports both 12-hour and 24-hour formats with configurable minute step intervals. It features an accessible segmented input field where users can directly type or use dropdown/bottom sheet selection with scrollable spin wheels. The component provides responsive layouts with desktop dropdown and mobile bottom sheet, includes validation states, and supports both controlled and uncontrolled usage patterns.

## Important Constraints

- `timeFormat` only accepts `'12h'` or `'24h'` values
- `minuteStep` only accepts `1`, `5`, `15`, or `30` as valid values
- `size` only accepts `'medium'` or `'large'` values
- `labelPosition` only accepts `'top'` or `'left'` values
- When using controlled mode, both `value` and `onChange` props must be provided
- `onApply` callback is only triggered when `showFooterActions` is `true` and user clicks Apply button
- Component requires a valid Date object or null for `value` and `defaultValue` props
- `validationState` only accepts `'error'`, `'success'`, or `'none'` values

## TypeScript Types

These types define the props that the TimePicker component and its related components accept. Use these for proper TypeScript integration and to understand available configuration options.

```typescript
/**
 * Time format types supported by TimePicker
 * Both 12h and 24h formats are supported using React Aria.
 */
type TimeFormat = '12h' | '24h';

/**
 * Minute step intervals supported by TimePicker
 */
type MinuteStep = 1 | 5 | 15 | 30;

/**
 * Value object returned by TimePicker onChange and onApply callbacks
 * Designed for future extensibility while maintaining backwards compatibility
 */
type TimePickerValue = {
  /**
   * The selected time as a Date object
   */
  value: Date | null;
};

/**
 * Individual time component identifiers
 */
type TimePart = 'hour' | 'minute' | 'period';

type TimePickerCommonInputProps = {
  inputRef?: React.Ref<any>;
  referenceProps?: any;
} & Pick<
  BaseInputProps,
  | 'labelPosition'
  | 'size'
  | 'isRequired'
  | 'necessityIndicator'
  | 'autoFocus'
  | 'isDisabled'
  | 'accessibilityLabel'
  | 'name'
  | 'placeholder'
  | 'label'
  | 'onFocus'
  | 'onBlur'
  | 'labelSuffix'
  | 'labelTrailing'
> &
  FormInputValidationProps;

/**
 * Main TimePicker component props
 * Combines input functionality with time selection capabilities
 */
type TimePickerProps = Omit<
  TimePickerInputProps,
  'inputRef' | 'refrenceProps' | 'successText' | 'errorText' | 'helpText' | 'time' | 'onChange'
> &
  Omit<TimePickerSelectorProps, 'isOpen' | 'defaultIsOpen' | 'onOpenChange' | 'time'> & {
    /**
     * Current time value as Date object (for controlled usage)
     */
    value?: Date | null;

    /**
     * Callback fired when time value changes
     * @param timeValue - Object containing the selected time
     */
    onChange?: (timeValue: TimePickerValue) => void;

    /**
     * Label for the time input
     */
    label?: string;

    /**
     * Help text to guide the user
     */
    helpText?: string;

    /**
     * Error text to show validation errors
     */
    errorText?: string;

    /**
     * Success text to show validation success
     */
    successText?: string;

    /**
     * Controls dropdown open state (for controlled usage)
     * @default false
     */
    isOpen?: boolean;

    /**
     * Default open state (for uncontrolled usage)
     * @default false
     */
    defaultIsOpen?: boolean;

    /**
     * Callback fired when dropdown open state changes
     * @param state - Object containing the new open state
     */
    onOpenChange?: (state: { isOpen: boolean }) => void;

    /**
     * Test ID for testing purposes
     */
    testID?: string;

    /**
     * Accessibility label for screen readers
     * When not provided, falls back to label prop
     */
    accessibilityLabel?: string;
  };

type TimePickerSelectorProps = {
  /**
   * Current time value as Date object (for controlled usage)
   */
  time?: Date | null;

  /**
   * Default time value as Date object (for uncontrolled usage)
   */
  defaultValue?: Date;

  /**
   * Callback fired when time value changes during selection
   * @param timeValue - Object containing the selected time and future extensible properties
   */
  onChange?: (timeValue: TimePickerValue) => void;

  /**
   * Time format for display and interaction
   * @default "12h"
   *
   * Both 12h and 24h formats are supported using React Aria.
   */
  timeFormat?: TimeFormat;

  /**
   * Controls dropdown open state (for controlled usage)
   * @default false
   */
  isOpen?: boolean;

  /**
   * Default open state (for uncontrolled usage)
   * @default false
   */
  defaultIsOpen?: boolean;

  /**
   * Step interval for minutes selection
   * @default 1
   * @example 15 // allows 00, 15, 30, 45 minutes only
   */
  minuteStep?: MinuteStep;

  /**
   * Callback fired when dropdown open state changes
   * @param state - Object containing the new open state
   */
  onOpenChange?: (state: { isOpen: boolean }) => void;

  /**
   * Whether to show the apply/cancel buttons in the dropdown
   * @default true
   *
   * When true:
   * - Shows Apply/Cancel buttons for explicit confirmation
   * - User must click Apply to confirm selection
   * - Better for complex time selections
   *
   * When false:
   * - On blur, selected time will automatically apply and close the dropdown
   * - Pressing Enter immediately applies the current selection and closes
   * - More streamlined interaction experience
   */
  showFooterActions?: boolean;

  /**
   * Callback fired when user applies time selection
   * Only called when showFooterActions is true and user clicks Apply
   * @param timeValue - Object containing the confirmed time value
   */
  onApply?: (timeValue: TimePickerValue) => void;

  /**
   * To set the controlled value of the time picker
   */
  setControlledValue?: (time: Date | null) => void;

  size?: 'medium' | 'large';
};

/**
 * Props for individual time column components (Hours, Minutes, Period)
 */
type TimeColumnProps = {
  values: string[];
  selectedValue: string;
  onValueChange: (value: string) => void;
};

/**
 * Props for time picker footer actions (Apply/Cancel buttons)
 */
type TimePickerFooterProps = {
  onApply: () => void;
  onCancel: () => void;
  isApplyDisabled?: boolean;
};

type TimeSegmentProps = {
  segment: DateSegment;
  state: TimeFieldState;
  isDisabled?: boolean;
};
```

## Examples

### Basic Usage with Format Options and Validation

```tsx
import React, { useState } from 'react';
import { TimePicker } from '@razorpay/blade/components';
import { Box } from '@razorpay/blade/components';
import { Button } from '@razorpay/blade/components';

function BasicTimePickerExample() {
  const [meetingTime, setMeetingTime] = useState<Date | null>(null);
  const [appointmentTime, setAppointmentTime] = useState<Date | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [hasError, setHasError] = useState(false);

  const validateBusinessHours = (selectedTime: Date | null) => {
    if (!selectedTime) {
      setHasError(true);
      return;
    }

    const hour = selectedTime.getHours();
    // Business hours: 9 AM to 6 PM
    if (hour < 9 || hour >= 18) {
      setHasError(true);
    } else {
      setHasError(false);
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap="spacing.5">
      <TimePicker
        label="Meeting Time (12-hour)"
        timeFormat="12h"
        size="medium"
        value={meetingTime}
        onChange={({ value }) => setMeetingTime(value)}
        helpText="Select your preferred meeting time"
        showFooterActions={false}
        accessibilityLabel="Select meeting time in 12-hour format"
      />

      <TimePicker
        label="Appointment Time (24-hour)"
        timeFormat="24h"
        size="large"
        value={appointmentTime}
        onChange={({ value }) => {
          setAppointmentTime(value);
          validateBusinessHours(value);
        }}
        onApply={({ value }) => {
          console.log('Time confirmed:', value);
        }}
        isOpen={isOpen}
        onOpenChange={({ isOpen }) => setIsOpen(isOpen)}
        isRequired
        necessityIndicator="required"
        validationState={hasError ? 'error' : appointmentTime ? 'success' : 'none'}
        errorText={
          hasError ? 'Please select a time during business hours (9 AM - 6 PM)' : undefined
        }
        successText={!hasError && appointmentTime ? 'Valid appointment time selected' : undefined}
        showFooterActions={true}
        accessibilityLabel="Select appointment time during business hours"
      />

      <Button
        onClick={() => {
          const randomTime = new Date();
          randomTime.setHours(Math.floor(Math.random() * 12) + 9);
          randomTime.setMinutes(Math.floor(Math.random() * 60));
          setAppointmentTime(randomTime);
          validateBusinessHours(randomTime);
        }}
      >
        Set Random Business Hour Time
      </Button>
    </Box>
  );
}
```

### Minute Step Intervals with Label Accessories

```tsx
import React, { useState } from 'react';
import { TimePicker } from '@razorpay/blade/components';
import { Box } from '@razorpay/blade/components';
import { Tooltip, TooltipInteractiveWrapper } from '@razorpay/blade/components';
import { Link } from '@razorpay/blade/components';
import { InfoIcon } from '@razorpay/blade/icons';

function MinuteStepExample() {
  const [meetingTime, setMeetingTime] = useState<Date | null>(null);
  const [quickTime, setQuickTime] = useState<Date | null>(null);

  return (
    <Box display="flex" flexDirection="column" gap="spacing.5">
      <TimePicker
        label="Detailed Meeting Time"
        labelPosition="top"
        labelSuffix={
          <Tooltip content="Select precise meeting time with 5-minute intervals" placement="right">
            <TooltipInteractiveWrapper display="flex">
              <InfoIcon size="small" color="surface.icon.gray.muted" />
            </TooltipInteractiveWrapper>
          </Tooltip>
        }
        labelTrailing={<Link size="small">Time zone settings</Link>}
        value={meetingTime}
        onChange={({ value }) => setMeetingTime(value)}
        minuteStep={5}
        timeFormat="12h"
        showFooterActions={true}
        size="medium"
        helpText="Available times: 00, 05, 10, 15, 20, etc."
        accessibilityLabel="Select meeting time with 5-minute intervals"
      />

      <TimePicker
        label="Quick Schedule"
        labelPosition="left"
        value={quickTime}
        onChange={({ value }) => setQuickTime(value)}
        minuteStep={30}
        timeFormat="24h"
        showFooterActions={false}
        size="large"
        helpText="Quick 30-minute intervals: 00, 30"
        accessibilityLabel="Select time with 30-minute intervals"
      />
    </Box>
  );
}
```

### Time Range Selection

```tsx
import React, { useState, useMemo } from 'react';
import { TimePicker } from '@razorpay/blade/components';
import { Box } from '@razorpay/blade/components';
import { Text } from '@razorpay/blade/components';

function TimeRangeExample() {
  const [startTime, setStartTime] = useState<Date | null>(() => {
    const time = new Date();
    time.setHours(9, 0, 0, 0); // 9:00 AM
    return time;
  });

  const [endTime, setEndTime] = useState<Date | null>(() => {
    const time = new Date();
    time.setHours(17, 0, 0, 0); // 5:00 PM
    return time;
  });

  const duration = useMemo(() => {
    if (!startTime || !endTime) return null;
    const diffMs = endTime.getTime() - startTime.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffMs < 0) return 'End time must be after start time';
    if (diffHours === 0 && diffMinutes === 0) return '0 minutes';
    if (diffHours === 0) return `${diffMinutes} minutes`;
    if (diffMinutes === 0) return `${diffHours} hours`;
    return `${diffHours} hours ${diffMinutes} minutes`;
  }, [startTime, endTime]);

  const isValidRange = startTime && endTime && endTime.getTime() > startTime.getTime();

  return (
    <Box display="flex" flexDirection="column" gap="spacing.5">
      <Box display="flex" flexDirection="row" gap="spacing.4">
        <TimePicker
          label="Shift Start Time"
          value={startTime}
          onChange={({ value }) => setStartTime(value)}
          timeFormat="12h"
          minuteStep={15}
          showFooterActions={false}
          size="medium"
          helpText="When does your shift begin?"
          accessibilityLabel="Select shift start time"
        />

        <TimePicker
          label="Shift End Time"
          value={endTime}
          onChange={({ value }) => setEndTime(value)}
          timeFormat="12h"
          minuteStep={15}
          showFooterActions={false}
          size="medium"
          validationState={duration === 'End time must be after start time' ? 'error' : undefined}
          errorText={duration === 'End time must be after start time' ? duration : undefined}
          helpText="When does your shift end?"
          accessibilityLabel="Select shift end time"
        />
      </Box>

      <Box
        padding="spacing.4"
        backgroundColor={
          isValidRange ? 'feedback.background.positive.subtle' : 'surface.background.gray.moderate'
        }
        borderRadius="medium"
      >
        <Text weight="semibold" size="small">
          Shift Duration: {duration ?? 'Select both times'}
        </Text>
        <Text size="small" marginTop="spacing.2">
          Start: {startTime ? startTime.toLocaleTimeString() : 'Not selected'}
        </Text>
        <Text size="small">End: {endTime ? endTime.toLocaleTimeString() : 'Not selected'}</Text>
      </Box>
    </Box>
  );
}
```
