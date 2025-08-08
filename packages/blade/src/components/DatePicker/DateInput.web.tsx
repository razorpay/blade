/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useDatesContext } from '@mantine/dates';
import type { DatePickerInputProps } from './types';
import { getFormattedDate } from './utils';
import BaseBox from '~components/Box/BaseBox';
import type { BaseInputProps } from '~components/Input/BaseInput';
import { TextInput } from '~components/Input/TextInput';
import { isReactNative } from '~utils';
import type { BladeElementRef, DataAnalyticsAttribute } from '~utils/types';
import { CalendarIcon } from '~components/Icons';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
dayjs.extend(customParseFormat);

/**
 * CRITICAL BEHAVIOR CASES - Verify when making changes:
 *
 * 1. VALUE PROP: Already formatted by getFormattedDate() - avoid double formatting
 * 2. USER TYPING: Should format input AND sync with calendar selection
 * 3. CALENDAR SELECTION: Should apply formatted value to input without re-formatting
 * 4. SUBMIT (no footer): Blur/Enter should select current value
 */
const _DateInput = (
  props: BaseInputProps & {
    format?: string;
    date?: Date | null | [Date | null, Date | null];
    setControlledValue?: (date: Date | null | [Date | null, Date | null]) => void;
    isRange?: boolean;
    leadingDropdown?: React.ReactElement;
  },
  ref: React.ForwardedRef<BladeElementRef>,
): React.ReactElement => {
  // Destructure props early for better readability
  const {
    format,
    date,
    setControlledValue,
    isRange,
    leadingDropdown,
    tags,
    id,
    ...textInputProps
  } = props;

  const [inputValue, setInputValue] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);
  const [inputResetKey, setInputResetKey] = React.useState(0);

  // Sync formatted value from parent to input display
  React.useEffect(() => {
    if (!isTyping) {
      setInputValue(textInputProps.value || '');
      // Force TextInput to re-render when external value updates
      setInputResetKey((prev) => prev + 1);
    }
  }, [textInputProps.value, isTyping]);

  // Helper: Check if value is already formatted according to the actual format string
  const isValueAlreadyFormatted = React.useCallback(
    (value: string, formatStr?: string, isRangeInput?: boolean): boolean => {
      if (!value || !formatStr) return false;

      if (isRangeInput) {
        // For range: check if value matches "format → format" pattern
        const parts = value.split(/\s*→\s*/);

        // Check if both parts are valid according to the base format
        const baseFormat = formatStr.split('→')[0]?.trim() || formatStr;
        const startValid = dayjs(parts[0].trim(), baseFormat, true).isValid();
        const endValid = dayjs(parts[1].trim(), baseFormat, true).isValid();
        return startValid && endValid;
      } else {
        // For single date: check if value is valid according to the format
        return dayjs(value, formatStr, true).isValid();
      }
    },
    [],
  );

  // Helper: Convert format to TextInput pattern
  const getTextInputFormat = React.useCallback(
    (formatStr?: string, isRangeInput?: boolean): string => {
      if (!formatStr) {
        return isRangeInput ? '##/##/#### → ##/##/####' : '##/##/####';
      }
      return formatStr.replace(/[YMD]/g, '#');
    },
    [],
  );

  // Helper: Parse date string with format validation
  const parseDate = React.useCallback((dateStr: string, dateFormat?: string): Date | null => {
    const parsedDate = dayjs(dateStr, dateFormat, true);
    return parsedDate.isValid() ? parsedDate.toDate() : null;
  }, []);

  // Type cast range handler once
  const rangeHandler = React.useMemo(
    () => setControlledValue as ((dates: [Date | null, Date | null]) => void) | undefined,
    [setControlledValue],
  );

  // Helper: Handle range input logic (extracted for clarity)
  const handleRangeInput = React.useCallback(
    (value: string) => {
      if (value.length >= 10) {
        // Optimized split with regex to handle spacing variations
        const [startStr, endStr] = value.split(/\s*→\s*/).map((s) => s.trim());
        const baseFormat = format?.split('→')[0]?.trim() || format;

        // Get current range state to preserve existing values
        const currentRange = (date as [Date | null, Date | null]) || [null, null];
        let newStartDate = currentRange[0];
        let newEndDate = currentRange[1];

        // Parse and update start date if valid
        if (startStr && startStr.length >= 8) {
          const startDate = parseDate(startStr, baseFormat);
          if (startDate) newStartDate = startDate;
        }

        // Parse and update end date if valid
        if (endStr && endStr.length >= 8) {
          const endDate = parseDate(endStr, baseFormat);
          if (endDate) newEndDate = endDate;
        }

        // Update calendar with new range
        rangeHandler?.([newStartDate, newEndDate]);
        return;
      }

      // Clear if empty
      if (!value.trim()) {
        rangeHandler?.([null, null]);
      }
    },
    [date, format, parseDate, rangeHandler],
  );

  // Optimized input change handler (memoized)
  const handleInputChange = React.useCallback(
    ({ value }: { value?: string }) => {
      const inputVal = value || '';
      setInputValue(inputVal);
      setIsTyping(true);

      // Handle range input
      if (isRange) {
        handleRangeInput(inputVal);
        return;
      }

      // Handle single date input
      if (inputVal && inputVal.length >= 8) {
        const parsedDate = parseDate(inputVal, format);
        if (parsedDate) {
          setControlledValue?.(parsedDate);
          return;
        }
      }

      // Clear if empty
      if (!inputVal.trim()) {
        setControlledValue?.(null);
      }
    },
    [isRange, format, parseDate, setControlledValue, handleRangeInput],
  );

  // Optimized blur handler (memoized)
  const handleBlur = React.useCallback(() => {
    setIsTyping(false);
  }, []);

  return (
    <TextInput
      {...textInputProps}
      ref={ref}
      key={inputResetKey}
      type="text"
      value={inputValue}
      leadingIcon={CalendarIcon}
      leading={leadingDropdown}
      format={
        !isValueAlreadyFormatted(String(inputValue), format, isRange)
          ? getTextInputFormat(format, isRange)
          : undefined
      }
      onChange={handleInputChange}
      onBlur={handleBlur}
      onClick={(e) => {
        if (textInputProps.isDisabled) {
          return;
        }
        textInputProps.onClick?.(e);
      }}
      onKeyDown={({ event }) => {
        // @ts-expect-error
        textInputProps.onKeyDown?.(event);
      }}
    />
  );
};

const DateInput = React.forwardRef(_DateInput);

const HiddenInput = ({
  value,
  name,
  isRequired,
  isDisabled,
  ...rest
}: {
  value: string;
  name?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
} & DataAnalyticsAttribute): React.ReactElement => {
  if (isReactNative()) return <></>;

  return (
    <input
      hidden={true}
      name={name}
      value={value}
      required={isRequired}
      disabled={isDisabled}
      readOnly
      {...makeAnalyticsAttribute(rest)}
    />
  );
};

const _DatePickerInput = (
  {
    selectionType,
    referenceProps,
    inputRef,
    date,
    label,
    labelPosition,
    labelSuffix,
    labelTrailing,
    autoFocus,
    name,
    size = 'medium',
    necessityIndicator,
    successText,
    errorText,
    helpText,
    format,
    placeholder,
    setControlledValue,
    leadingDropdown,
    selectedPreset,
    ...props
  }: DatePickerInputProps,
  ref: React.ForwardedRef<any>,
): React.ReactElement => {
  const { locale } = useDatesContext();

  if (selectionType == 'single') {
    const dateValue = getFormattedDate({
      date,
      format,
      labelSeparator: '-',
      locale,
      type: 'default',
    });
    return (
      <BaseBox width="100%">
        <HiddenInput
          value={dateValue}
          name={name}
          isRequired={props.isRequired}
          isDisabled={props.isDisabled}
        />
        <DateInput
          ref={ref as never}
          id="start-date"
          labelPosition={labelPosition}
          label={label}
          placeholder={placeholder || format}
          popupId={referenceProps['aria-controls']}
          isPopupExpanded={referenceProps['aria-expanded']}
          size={size}
          autoFocus={autoFocus}
          value={dateValue}
          componentName="DatePickerInput"
          necessityIndicator={necessityIndicator}
          successText={successText}
          errorText={errorText}
          helpText={helpText}
          labelSuffix={labelSuffix}
          labelTrailing={labelTrailing}
          leadingDropdown={leadingDropdown}
          date={date as Date | null}
          setControlledValue={setControlledValue}
          format={format}
          isRange={false}
          {...props}
          {...referenceProps}
        />
      </BaseBox>
    );
  }

  if (selectionType == 'range') {
    const startValue = getFormattedDate({
      type: 'default',
      date: date[0],
      format,
      labelSeparator: '-',
      locale,
    });
    const endValue = getFormattedDate({
      type: 'default',
      date: date[1],
      format,
      labelSeparator: '-',
      locale,
    });

    const rangeValue =
      startValue && endValue
        ? startValue === endValue
          ? startValue
          : `${startValue} → ${endValue}`
        : startValue
        ? `${startValue} → `
        : endValue
        ? ` → ${endValue}`
        : '';

    const finalInputPlaceHolder = () => {
      if (placeholder) {
        return `${placeholder} → ${placeholder}`;
      }
      return `${format} → ${format}`;
    };

    const finalInputFormat = () => {
      // Mirror rangeValue logic exactly for format validation
      return startValue && endValue
        ? startValue === endValue
          ? format // Single format when values are same
          : `${format} → ${format}` // Range format when different
        : startValue
        ? `${format} → ` // Partial range format (start only)
        : endValue
        ? ` → ${format}` // Partial range format (end only)
        : ``; // Default range format
    };

    const isRange = () => {
      if (!startValue || !endValue) {
        return false;
      }
      return startValue !== endValue;
    };

    console.log('qswap', isRange());
    return (
      <BaseBox width="100%">
        <HiddenInput
          value={`${startValue}`}
          name={name?.start}
          isRequired={props.isRequired}
          isDisabled={props.isDisabled}
        />

        <HiddenInput
          value={endValue}
          name={name?.end}
          isRequired={props.isRequired}
          isDisabled={props.isDisabled}
          {...makeAnalyticsAttribute(props)}
        />

        <DateInput
          ref={ref as never}
          id="range-date"
          labelPosition={labelPosition}
          label={label}
          placeholder={finalInputPlaceHolder()}
          popupId={referenceProps['aria-controls']}
          isPopupExpanded={referenceProps['aria-expanded']}
          size={size}
          autoFocus={autoFocus}
          value={rangeValue}
          componentName="DatePickerInputRange"
          necessityIndicator={necessityIndicator}
          successText={successText}
          errorText={errorText}
          helpText={helpText}
          labelSuffix={labelSuffix}
          labelTrailing={labelTrailing}
          format={finalInputFormat()}
          isRange={isRange()}
          leadingDropdown={leadingDropdown}
          date={date as [Date | null, Date | null]}
          setControlledValue={setControlledValue}
          {...props}
          {...referenceProps}
        />
      </BaseBox>
    );
  }

  return <></>;
};

const DatePickerInput = React.forwardRef(_DatePickerInput);
export { DatePickerInput };
