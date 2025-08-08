/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useDatesContext } from '@mantine/dates';

// Enable strict date parsing according to format
dayjs.extend(customParseFormat);
import type { DatePickerInputProps } from './types';
import { getFormattedDate } from './utils';
import BaseBox from '~components/Box/BaseBox';

import type { BaseInputProps } from '~components/Input/BaseInput';
import { TextInput } from '~components/Input/TextInput';
import { isReactNative } from '~utils';

import type { BladeElementRef, DataAnalyticsAttribute } from '~utils/types';
import { CalendarIcon } from '~components/Icons';

import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

const _DateInput = (
  props: BaseInputProps & {
    format?: string;
    date?: Date | null | [Date | null, Date | null];
    onDateChange?: (date: Date | null | [Date | null, Date | null]) => void;
    isRange?: boolean;
    leadingDropdown?: React.ReactElement;
  },
  ref: React.ForwardedRef<BladeElementRef>,
): React.ReactElement => {
  const [inputValue, setInputValue] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);
  const [calendarKey, setCalendarKey] = React.useState(0);

  // Sync formatted value from parent to input display
  React.useEffect(() => {
    if (!isTyping) {
      setInputValue(props.value || '');
      // Force TextInput to re-render when calendar updates value
      setCalendarKey((prev) => prev + 1);
    }
  }, [props.value, isTyping]);

  // Simple: Convert format to TextInput pattern
  const getTextInputFormat = (format?: string, isRange?: boolean): string => {
    if (!format) {
      return isRange ? '##/##/#### → ##/##/####' : '##/##/####';
    }
    const pattern = format.replace(/[YMD]/g, '#');
    return pattern;
  };

  const handleInputChange = ({ value }: { value?: string }) => {
    setInputValue(value || '');
    setIsTyping(true);

    // Handle range input
    if (props.isRange) {
      if (value && value.length >= 10) {
        const [startStr, endStr] = value.split('→').map((s) => s.trim());
        const baseFormat = props.format?.split('→')[0]?.trim() || props.format;

        // Get current range state to preserve existing values
        const currentRange = (props.date as [Date | null, Date | null]) || [null, null];
        let newStartDate = currentRange[0];
        let newEndDate = currentRange[1];

        // Parse and update start date if valid
        if (startStr && startStr.length >= 8) {
          const startDate = dayjs(startStr, baseFormat, true);
          if (startDate.isValid()) {
            newStartDate = startDate.toDate();
          }
        }

        // Parse and update end date if valid
        if (endStr && endStr.length >= 8) {
          const endDate = dayjs(endStr, baseFormat, true);
          if (endDate.isValid()) {
            newEndDate = endDate.toDate();
          }
        }

        // Update calendar with new range (even if only one date is valid)
        const rangeHandler = props.onDateChange as (dates: [Date | null, Date | null]) => void;
        rangeHandler?.([newStartDate, newEndDate]);
        return;
      }

      // Clear if empty
      if (!value?.trim()) {
        const rangeHandler = props.onDateChange as (dates: [Date | null, Date | null]) => void;
        rangeHandler?.([null, null]);
      }
      return;
    }

    // Handle single date input
    if (value && value.length >= 8) {
      const parsedDate = dayjs(value, props.format, true);
      if (parsedDate.isValid()) {
        props.onDateChange?.(parsedDate.toDate());
        return;
      }
    }

    // Clear if empty
    if (!value?.trim()) {
      props.onDateChange?.(null);
    }
  };

  const handleBlur = () => {
    setIsTyping(false);
    // TextInput handles formatting automatically via format prop
  };

  return (
    <TextInput
      key={calendarKey}
      label={props.label || ''}
      accessibilityLabel={props.accessibilityLabel}
      labelPosition={props.labelPosition}
      labelSuffix={props.labelSuffix}
      labelTrailing={props.labelTrailing}
      leadingIcon={props.leadingIcon}
      necessityIndicator={props.necessityIndicator}
      validationState={props.validationState}
      helpText={props.helpText}
      errorText={props.errorText}
      successText={props.successText}
      placeholder={props.placeholder || props.format || 'YYYY-MM-DD'}
      size={props.size}
      isDisabled={props.isDisabled}
      isRequired={props.isRequired}
      autoFocus={props.autoFocus}
      ref={ref}
      value={inputValue}
      format={isTyping ? getTextInputFormat(props.format, props.isRange) : undefined}
      type="text"
      onChange={handleInputChange}
      onBlur={handleBlur}
      onClick={(e) => {
        if (props.isDisabled) {
          return;
        }
        props.onClick?.(e);
        setTimeout(() => {
          if (ref && typeof ref !== 'function') {
            ref.current?.focus();
          }
        }, 10);
      }}
      trailing={props.trailingIcon}
      leading={props.leadingDropdown}
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
    onDateChange,
    leadingDropdown,
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
          date={date as Date | null} // Pass controlled date
          onDateChange={onDateChange as (date: Date | null) => void} // Pass controlled handler
          format={format}
          isRange={false} // Mark as single date input
          componentName="DatePickerInput"
          necessityIndicator={necessityIndicator}
          successText={successText}
          errorText={errorText}
          helpText={helpText}
          labelSuffix={labelSuffix}
          labelTrailing={labelTrailing}
          leadingIcon={CalendarIcon}
          leadingDropdown={leadingDropdown}
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

    // Format the range display: "25/07/2025 → 01/08/2025"
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
      if (startValue === endValue) {
        return `${placeholder}`;
      }
      if (placeholder) {
        return `${placeholder} → ${placeholder}`;
      }
      return `${format} → ${format}`;
    };

    const finalInputFormat = () => {
      if (startValue === endValue) {
        return `${format}`;
      }
      return `${format} → ${format}`;
    };

    return (
      <BaseBox width="100%">
        <HiddenInput
          value={`${startValue}|${endValue}`} // Hidden input with both values
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
          date={date as [Date | null, Date | null]} // Pass range array
          onDateChange={onDateChange as (dates: [Date | null, Date | null]) => void}
          format={finalInputFormat()}
          isRange={true} // Mark as range input
          componentName="DatePickerInputRange"
          necessityIndicator={necessityIndicator}
          successText={successText}
          errorText={errorText}
          helpText={helpText}
          labelSuffix={labelSuffix}
          labelTrailing={labelTrailing}
          leadingIcon={CalendarIcon}
          leadingDropdown={leadingDropdown}
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
