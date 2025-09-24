/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useDatesContext } from '@mantine/dates';
import type { DatePickerInputProps, DateInputProps } from './types';
import {
  getFormattedDate,
  rangeFormattedValue,
  rangeInputPlaceHolder,
  finalInputFormat,
  getTextInputFormat,
  validateAndParseDateInput,
  stripDelimiters,
} from './utils';
import BaseBox from '~components/Box/BaseBox';
import { TextInput } from '~components/Input/TextInput';
import { isReactNative } from '~utils';
import type { BladeElementRef, DataAnalyticsAttribute } from '~utils/types';
import { CalendarIcon } from '~components/Icons';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

/**
 * CRITICAL BEHAVIOR CASES - Verify when making changes:
 *
 * 1. VALUE PROP: Already formatted by getFormattedDate() - avoid double formatting
 * 2. USER TYPING: Should format input AND sync with calendar selection
 * 3. CALENDAR SELECTION: Should apply formatted value to input without re-formatting
 * 4. SUBMIT (no footer): Blur/Enter should select current value
 */
const _DateInput = (
  props: DateInputProps,
  ref: React.ForwardedRef<BladeElementRef>,
): React.ReactElement => {
  const {
    format,
    date,
    setControlledValue,
    effectiveSelectionType,
    leadingDropdown,
    tags,
    id,
    ...textInputProps
  } = props;
  const [inputValue, setInputValue] = React.useState(['']);
  const [validationError, setValidationError] = React.useState<string | undefined>(undefined);
  const shouldShowCalendarIcon = !Boolean(leadingDropdown);

  // Determine selection type: prefer preset context calculation over props
  // This handles "Today" presets that should display as single even though data is range
  const isRange =
    effectiveSelectionType === 'single'
      ? false
      : effectiveSelectionType === 'range' || props.selectionType === 'range';

  // Sync internal input state with external formatted values from parent component
  // textInputProps.value comes from DatePickerInput as formatted strings: ["25/12/2024", "31/12/2024"]
  // We strip delimiters for internal processing: ["25122024", "31122024"]
  // This prevents double formatting and helps to validate the input easier during user typing
  React.useEffect(() => {
    if (textInputProps.value) {
      setInputValue(
        isRange
          ? [stripDelimiters(textInputProps.value[0]), stripDelimiters(textInputProps.value[1])]
          : [stripDelimiters(textInputProps.value[0])],
      );
    }
  }, [textInputProps.value, isRange, format]);

  // Clear validation error only when the actual selected date changes
  // (e.g., user selected a valid date from the calendar). This avoids
  // clearing errors during typing/blur unless the value truly updated.
  React.useEffect(() => {
    setValidationError(undefined);
  }, [date]);

  const applyDateValue = React.useCallback(
    (inputValue: string, shouldClearWhenEmpty = false): void => {
      if (inputValue?.trim()) {
        // Validate input and get parsed dates in one atomic operation (includes all constraints)
        const validation = validateAndParseDateInput(inputValue, isRange, format, {
          excludeDate: props.excludeDate,
          minDate: props.minDate,
          maxDate: props.maxDate,
        });
        if (validation.shouldBlock) {
          return; // Block invalid input to prevent data corruption
        }

        // Apply the pre-parsed date values to controlled state (no redundant parsing)
        if (validation.parsedValue !== undefined) {
          let finalValue = validation.parsedValue;

          // Special handling: if preset context shows single but props expect range
          // (like "Today" preset), convert single date back to same-day range
          if (
            effectiveSelectionType === 'single' &&
            props.selectionType === 'range' &&
            validation.parsedValue instanceof Date
          ) {
            finalValue = [validation.parsedValue, validation.parsedValue] as [Date, Date];
          }

          setControlledValue?.(finalValue);
        }
      } else if (shouldClearWhenEmpty) {
        // Clear controlled value when input is emptied (onChange only, not onBlur)
        setControlledValue?.(isRange ? ([null, null] as [Date | null, Date | null]) : null);
      }
    },
    [
      isRange,
      setControlledValue,
      effectiveSelectionType,
      props.selectionType,
      format,
      props.excludeDate,
      props.minDate,
      props.maxDate,
    ],
  );

  const handleInputChange = ({ value }: { value?: string }): void => {
    const inputValue = value ?? '';
    setValidationError(undefined);

    if (inputValue?.trim()) {
      const validation = validateAndParseDateInput(inputValue, isRange, format, {
        excludeDate: props.excludeDate,
        minDate: props.minDate,
        maxDate: props.maxDate,
      });

      if (validation.shouldBlock && validation.error) {
        setValidationError(validation.error);
      }
    }

    // Apply changes immediately during typing (with empty clearing enabled)
    applyDateValue(inputValue, true);
  };

  const handleBlur = React.useCallback(
    (params: { name?: string; value?: string; event?: React.FocusEvent<HTMLInputElement> }) => {
      const currentInputValue = params.event?.target.value ?? params.value ?? '';
      setValidationError(undefined);

      if (currentInputValue?.trim()) {
        // Validate complete input and show errors to user on blur (includes all constraints)
        const validation = validateAndParseDateInput(currentInputValue, isRange, format, {
          excludeDate: props.excludeDate,
          minDate: props.minDate,
          maxDate: props.maxDate,
        });

        if (validation.shouldBlock && validation.error) {
          setValidationError(validation.error);
          return; // Don't apply invalid values
        }
      }

      // Apply final value on blur (without empty clearing to preserve existing dates)
      applyDateValue(currentInputValue, false);
    },
    [applyDateValue, isRange],
  );

  console.log('DateInput inputValue', inputValue);
  console.log('DateInput isRange', isRange);
  console.log('DateInput format', format);
  console.log('DateInput finalInputFormat', finalInputFormat(inputValue[0], inputValue[1], format));
  console.log(
    'DateInput getTextInputFormat',
    getTextInputFormat(finalInputFormat(inputValue[0], inputValue[1], format), true),
  );

  return (
    <TextInput
      {...textInputProps}
      ref={ref}
      type="number"
      value={isRange ? rangeFormattedValue(inputValue[0], inputValue[1]) : inputValue[0]}
      leadingIcon={shouldShowCalendarIcon ? CalendarIcon : undefined}
      leading={leadingDropdown}
      format={
        isRange
          ? getTextInputFormat(finalInputFormat(inputValue[0], inputValue[1], format), true)
          : getTextInputFormat(format, false)
      }
      validationState={validationError ? 'error' : textInputProps.validationState}
      errorText={textInputProps.errorText ?? validationError}
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
    excludeDate,
    minDate,
    maxDate,
    effectiveSelectionType,
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
          hasPopup={referenceProps['aria-haspopup']}
          size={size}
          autoFocus={autoFocus}
          value={[dateValue]}
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
          selectionType={selectionType}
          excludeDate={excludeDate}
          minDate={minDate}
          maxDate={maxDate}
          effectiveSelectionType={effectiveSelectionType}
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
          label={typeof label === 'object' ? label?.start : label}
          placeholder={rangeInputPlaceHolder(placeholder, format)}
          popupId={referenceProps['aria-controls']}
          isPopupExpanded={referenceProps['aria-expanded']}
          hasPopup={referenceProps['aria-haspopup']}
          size={size}
          autoFocus={autoFocus}
          value={[startValue, endValue]}
          componentName="DatePickerInputRange"
          necessityIndicator={necessityIndicator}
          successText={
            typeof successText === 'object'
              ? (successText as { start: string })?.start
              : successText
          }
          errorText={
            typeof errorText === 'object' ? (errorText as { start: string })?.start : errorText
          }
          helpText={
            typeof helpText === 'object' ? (helpText as { start: string })?.start : helpText
          }
          labelSuffix={labelSuffix}
          labelTrailing={labelTrailing}
          format={format}
          leadingDropdown={leadingDropdown}
          date={date as [Date | null, Date | null]}
          setControlledValue={setControlledValue}
          selectionType={selectionType}
          excludeDate={excludeDate}
          minDate={minDate}
          maxDate={maxDate}
          effectiveSelectionType={effectiveSelectionType}
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
