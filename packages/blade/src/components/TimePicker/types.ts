/* eslint-disable @typescript-eslint/no-explicit-any */
import type { BaseInputProps } from '~components/Input/BaseInput';
import type { FormInputValidationProps } from '~components/Form';
import type { DateSegment } from '@react-stately/datepicker';
import type { TimeFieldState } from '@react-stately/datepicker';

type TimeSegmentProps = {
  segment: DateSegment;
  state: TimeFieldState;
};
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

type TimePickerInputProps = TimePickerCommonInputProps & {
  setControlledValue?: (time: Date | null) => void;
  time?: Date | null;
  timeValue?: any; // TimeValue from @internationalized/date
  testID?: string;
  onChange?: (time: Date | null) => void;
  onTimeValueChange?: (timeValue: any) => void; // TimeValue from @internationalized/date
  timeFormat?: TimeFormat;
  ref?: React.Ref<any>;
  inputRef?: React.Ref<any>;
  referenceProps?: any;
  onInputClick?: () => void;
  createCompleteTime?: () => Date | null;
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

/**
 * Props for individual time column components (Hours, Minutes, Period)
 */
type TimeColumnProps = {
  values: string[];
  selectedValue: string;
  onValueChange: (value: string) => void;
};

/**
 * Props for useTimePickerState hook
 */
type UseTimePickerStateProps = {
  // Controlled/uncontrolled time value
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (timeValue: TimePickerValue) => void;

  // Controlled/uncontrolled open state
  isOpen?: boolean;
  defaultIsOpen?: boolean;
  onOpenChange?: (state: { isOpen: boolean }) => void;

  // Configuration
  timeFormat?: TimeFormat;
  showFooterActions?: boolean;

  // Apply callback
  onApply?: (timeValue: TimePickerValue) => void;
};

/**
 * Props for TimePicker content component
 */
type TimePickerContentProps = {
  selectedTime: Date | null;
  setSelectedTime: (time: Date | null) => void;
  selectedHour: number;
  selectedMinute: number;
  selectedPeriod: string;
  timeFormat: TimeFormat;
  minuteStep: MinuteStep;
  showFooterActions: boolean;
  onApply: () => void;
  onCancel: () => void;
};

/**
 * Props for SpinWheel component
 */
type SpinWheelProps = {
  values: (string | number)[];
  selectedValue: string | number;
  onValueChange: (value: string | number, index: number) => void;
  activeIndex?: number | null;
  onActiveIndexChange?: (index: number | null) => void;
  label?: string;
  width?: string;
  /**
   * Optional display value for visual positioning when different from selectedValue.
   *
   * Used for minute steps: when user types "03" but minuteStep is 15,
   * selectedValue remains "03" (preserved for form data) while
   * displayValue becomes "00" (nearest step for visual positioning).
   */
  displayValue?: string | number;
};

/**
 * Props for time picker footer actions (Apply/Cancel buttons)
 */
type TimePickerFooterProps = {
  onApply: () => void;
  onCancel: () => void;
  isApplyDisabled?: boolean;
};

export type {
  TimeFormat,
  MinuteStep,
  TimePickerValue,
  TimePickerProps,
  TimePickerSelectorProps,
  TimePickerInputProps,
  TimePickerCommonInputProps,
  TimeColumnProps,
  TimePickerFooterProps,
  TimePart,
  TimeSegmentProps,
  UseTimePickerStateProps,
  TimePickerContentProps,
  SpinWheelProps,
};
