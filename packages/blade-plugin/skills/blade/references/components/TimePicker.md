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

/**
 * Input focus/blur event handler
 */
type FormInputOnEvent = ({
  name,
  value,
  rawValue,
}: {
  name?: string;
  value?: string;
  rawValue?: string;
}) => void;

/**
 * Main TimePicker component props
 * Combines input functionality with time selection capabilities
 */
type TimePickerProps = {
  /**
   * Current time value as Date object (for controlled usage)
   */
  value?: Date | null;

  /**
   * Default time value as Date object (for uncontrolled usage)
   */
  defaultValue?: Date | null;

  /**
   * Callback fired when time value changes
   * @param timeValue - Object containing the selected time
   */
  onChange?: (timeValue: TimePickerValue) => void;

  /**
   * Callback fired when user applies time selection
   * Only called when showFooterActions is true and user clicks Apply
   */
  onApply?: (timeValue: TimePickerValue) => void;

  /**
   * Time format for display and interaction
   * @default '12h'
   */
  timeFormat?: TimeFormat;

  /**
   * Step interval for minutes selection
   * @default 1
   */
  minuteStep?: MinuteStep;

  /**
   * Whether to show the apply/cancel buttons in the dropdown.
   * When false, the selected time applies on blur or on Enter.
   * @default true
   */
  showFooterActions?: boolean;

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
   */
  onOpenChange?: (state: { isOpen: boolean }) => void;

  /**
   * Label for the time input
   */
  label?: string;

  /**
   * Position of the label
   * @default 'top'
   */
  labelPosition?: 'top' | 'left';

  /**
   * Element to render after the label (e.g. a Tooltip trigger)
   */
  labelSuffix?: React.ReactNode;

  /**
   * Element to render at the trailing end of the label row
   */
  labelTrailing?: React.ReactNode;

  /**
   * Accessibility label for screen readers
   * When not provided, falls back to label prop
   */
  accessibilityLabel?: string;

  /**
   * Placeholder text for the input
   */
  placeholder?: string;

  /**
   * Name attribute of the input, for form submission
   */
  name?: string;

  /**
   * Size of the input
   * @default 'medium'
   */
  size?: 'medium' | 'large';

  /**
   * Whether the input is disabled
   */
  isDisabled?: boolean;

  /**
   * Whether the input is required
   */
  isRequired?: boolean;

  /**
   * Whether to display the necessity indicator
   * @default 'none'
   */
  necessityIndicator?: 'required' | 'optional' | 'none';

  /**
   * Auto focus the input on mount
   */
  autoFocus?: boolean;

  /**
   * Callback fired when the input gets focus
   */
  onFocus?: FormInputOnEvent;

  /**
   * Callback fired when the input loses focus
   */
  onBlur?: FormInputOnEvent;

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
   * Validation state of the input
   * @default 'none'
   */
  validationState?: 'error' | 'success' | 'none';

  /**
   * Position of the validation text
   * @default 'outside'
   */
  validationTextPlacement?: 'outside' | 'inside';

  /**
   * z-index of the TimePicker dropdown
   * @default 1100
   */
  zIndex?: number;

  /**
   * Test ID for testing purposes
   */
  testID?: string;
};
```

## Usage Guidelines

**Do**

- Use `TimePicker` for time selection with scrollable spin wheels (hours, minutes, AM/PM).
- Use `timeFormat="24h"` for business/technical contexts and `"12h"` (default) for consumer-facing UIs.
- Use `minuteStep` (1, 5, 15, or 30) to control granularity based on your use case.
- Use two separate `TimePicker` components for time range selection with custom validation between them.
- The component auto-converts to BottomSheet on mobile — no manual handling needed.

**Don't**

- Don't use `TimePicker` for date selection — use `DatePicker` for dates.
- Don't expect built-in time range support — use two TimePickers with validation logic.
- Don't use arbitrary `minuteStep` values — only 1, 5, 15, and 30 are accepted.
- Don't use generic `TextInput` for time entry — `TimePicker` provides a proper time selection UI.
- Don't rely on `onApply` when `showFooterActions={false}` — in that mode, time applies immediately on blur/Enter.

## Example

### TimePicker Usage

```tsx
import React, { useState } from 'react';
import {
  TimePicker,
  Box,
  Button,
  Link,
  Tooltip,
  TooltipInteractiveWrapper,
  InfoIcon,
} from '@razorpay/blade/components';

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
