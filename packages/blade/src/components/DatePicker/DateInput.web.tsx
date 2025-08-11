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

const rangeValue = (startValue: string, endValue: string) => {
  return startValue && endValue
    ? startValue === endValue
      ? startValue
      : `${startValue} → ${endValue}`
    : startValue
    ? `${startValue} → `
    : endValue
    ? ` → ${endValue}`
    : '';
};

const finalInputPlaceHolder = (placeholder: string | undefined, format: string) => {
  if (placeholder) {
    return `${placeholder} → ${placeholder}`;
  }
  return `${format} → ${format}`;
};

const finalInputFormat = (startValue: string, endValue: string, format: string | undefined) => {
  if (startValue === endValue && startValue) {
    return format;
  }
  return `${format} → ${format}`;
};

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
    leadingDropdown?: React.ReactElement;
    selectionType: 'single' | 'range';
  },
  ref: React.ForwardedRef<BladeElementRef>,
): React.ReactElement => {
  // Destructure props early for better readability
  const { format, date, setControlledValue, leadingDropdown, tags, id, ...textInputProps } = props;

  const isRange = props.selectionType === 'range';
  const [inputValue, setInputValue] = React.useState(['']);

  React.useEffect(() => {
    console.log('textInputProps.value', isRange, textInputProps.value);
    if (textInputProps.value) {
      if (isRange) {
        setInputValue([
          textInputProps.value[0]?.replace(/\//g, ''),
          textInputProps.value[1]?.replace(/\//g, ''),
        ]);
      } else {
        setInputValue([textInputProps.value[0]?.replace(/\//g, '')]);
      }
    }
  }, [textInputProps.value, isRange]);

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
  // Parse user input and convert to Date objects
  const parseInputValue = (value: string): Date | null | [Date | null, Date | null] | undefined => {
    console.log('Qswap 1', value);
    if (!value?.trim()) {
      return isRange ? ([null, null] as [Date | null, Date | null]) : null;
    }
    console.log('Qswap 2', isRange);
    if (isRange) {
      const parts = value.split(/\s*→\s*/);
      const baseFormat = format?.split('→')[0]?.trim() || format;
      console.log('Qswap 3', parts, baseFormat, value.length);
      // For range, only validate when we have substantial input
      if (value.length >= 10) {
        const startPart = parts[0]?.trim() || '';
        const endPart = parts[1]?.trim() || '';

        const startDate = startPart ? dayjs(startPart, baseFormat, true) : null;
        const endDate = endPart.length >= 10 ? dayjs(endPart, baseFormat, true) : null;

        console.log(
          'Qswao final',
          startDate?.isValid(),
          endDate?.isValid(),
          'endPart.length:',
          endPart.length,
        );

        // If end date is being edited (incomplete), return special signal
        if (endPart.length > 0 && endPart.length < 10) {
          console.log('Preserving end date, updating start only');
          return [
            startDate?.isValid() ? startDate.toDate() : null,
            'PRESERVE', // Special signal to preserve current end value
          ] as any;
        }

        // Both complete or end is empty
        return [
          startDate?.isValid() ? startDate.toDate() : null,
          endDate?.isValid() ? endDate.toDate() : null,
        ] as [Date | null, Date | null];
      }
      // For incomplete range input during editing, don't clear - return undefined
      return undefined;
    } else {
      // For single date, try to parse if it looks complete
      if (value.length >= 8) {
        // Allow parsing from 8+ chars (more lenient)
        const parsed = dayjs(value, format, true);
        if (parsed.isValid()) {
          return parsed.toDate();
        }
      }

      // For incomplete single date input during editing, don't clear - return undefined
      // Only return null if we want to explicitly clear (empty input handled above)
      return undefined;
    }
  };

  // Simple change handler - parse and update parent
  const handleInputChange = ({ value }: { value?: string }) => {
    const inputVal = value || '';
    console.log('qswap 0.1', inputVal);
    if (inputVal.trim()) {
      const parsed = parseInputValue(inputVal);
      console.log('qswap 4', parsed);
      // Only update controlled value if parsing returned a definitive result
      // undefined means "don't change" (user is still editing)
      if (parsed !== undefined) {
        if (isRange && Array.isArray(parsed) && (parsed as any)[1] === 'PRESERVE') {
          // Special case: preserve current end date, update start only
          console.log('Handling PRESERVE signal');
          const currentValue = date;
          const currentEnd = Array.isArray(currentValue) ? currentValue[1] : null;

          setControlledValue?.([parsed[0] as Date | null, currentEnd]);
        } else {
          // Normal update
          setControlledValue?.(parsed);
        }
      }
    } else {
      // Clear when empty
      setControlledValue?.(isRange ? ([null, null] as [Date | null, Date | null]) : null);
    }
  };

  return (
    <TextInput
      {...textInputProps}
      ref={ref}
      // key={textInputProps.value}
      type="text"
      value={isRange ? rangeValue(inputValue[0], inputValue[1]) : inputValue[0]}
      leadingIcon={CalendarIcon}
      leading={leadingDropdown}
      format={
        isRange
          ? getTextInputFormat(finalInputFormat(inputValue[0], inputValue[1], format), true)
          : getTextInputFormat(format, false)
      }
      onChange={handleInputChange}
      // onBlur={handleBlur}
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
          label={label}
          placeholder={finalInputPlaceHolder(placeholder, format)}
          popupId={referenceProps['aria-controls']}
          isPopupExpanded={referenceProps['aria-expanded']}
          size={size}
          autoFocus={autoFocus}
          value={[startValue, endValue]}
          componentName="DatePickerInputRange"
          necessityIndicator={necessityIndicator}
          successText={successText}
          errorText={errorText}
          helpText={helpText}
          labelSuffix={labelSuffix}
          labelTrailing={labelTrailing}
          format={format}
          leadingDropdown={leadingDropdown}
          date={date as [Date | null, Date | null]}
          setControlledValue={setControlledValue}
          selectionType={selectionType}
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
