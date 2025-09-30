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

## Example

### TimePicker Usage

```tsx
import React, { useState, useMemo } from 'react';
import { TimePicker } from '@razorpay/blade/components';
import { Box, Text, Button } from '@razorpay/blade/components';
import { Tooltip, TooltipInteractiveWrapper } from '@razorpay/blade/components';
import { Link } from '@razorpay/blade/components';
import { InfoIcon } from '@razorpay/blade/icons';

function TimePickerExample() {
  const [basicTime, setBasicTime] = useState<Date | null>(null);
  const [advancedTime, setAdvancedTime] = useState<Date | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Validation for business hours (9 AM - 6 PM)
  const validateTime = (time: Date | null) => {
    if (!time) return;
    const hour = time.getHours();
    setHasError(hour < 9 || hour >= 18);
  };

  return (
    <Box display="flex" flexDirection="column" gap="spacing.5">
      {/* Basic TimePicker - shows common usage */}
      <TimePicker
        label="Meeting Time"
        timeFormat="12h"
        size="medium"
        value={basicTime}
        onChange={({ value }) => setBasicTime(value)}
        showFooterActions={false}
        minuteStep={15}
        helpText="Select your meeting time (15-minute intervals)"
        placeholder="Select time"
        accessibilityLabel="Select meeting time"
      />

      {/* Advanced TimePicker - shows all advanced features */}
      <TimePicker
        label="Business Hours Appointment"
        labelPosition="top"
        labelSuffix={
          <Tooltip content="Must be during business hours (9 AM - 6 PM)" placement="right">
            <TooltipInteractiveWrapper display="flex">
              <InfoIcon size="small" color="surface.icon.gray.muted" />
            </TooltipInteractiveWrapper>
          </Tooltip>
        }
        labelTrailing={<Link size="small">Time zones</Link>}
        timeFormat="24h"
        size="large"
        value={advancedTime}
        defaultValue={new Date('2024-01-01T14:30:00')}
        onChange={({ value }) => {
          setAdvancedTime(value);
          validateTime(value);
        }}
        onApply={({ value }) => console.log('Applied:', value)}
        isOpen={isOpen}
        onOpenChange={({ isOpen }) => setIsOpen(isOpen)}
        isRequired
        necessityIndicator="required"
        validationState={hasError ? 'error' : advancedTime ? 'success' : 'none'}
        errorText={hasError ? 'Please select time during business hours (9 AM - 6 PM)' : undefined}
        successText={!hasError && advancedTime ? 'Valid appointment time' : undefined}
        showFooterActions={true}
        minuteStep={30}
        isDisabled={false}
        autoFocus={false}
        name="appointment-time"
        testID="advanced-timepicker"
        accessibilityLabel="Select appointment time during business hours"
      />

      {/* Control buttons to demonstrate programmatic usage */}
      <Box display="flex" gap="spacing.3">
        <Button size="small" onClick={() => setAdvancedTime(new Date())}>
          Set Current Time
        </Button>
        <Button size="small" variant="secondary" onClick={() => setIsOpen(!isOpen)}>
          Toggle Dropdown
        </Button>
      </Box>
    </Box>
  );
}
```
