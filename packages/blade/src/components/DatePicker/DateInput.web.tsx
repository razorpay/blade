/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useDatesContext } from '@mantine/dates';
import type { DatePickerInputProps } from './types';
import {
  getFormattedDate,
  rangeFormattedValue,
  rangeInputPlaceHolder,
  finalInputFormat,
  getTextInputFormat,
} from './utils';
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
    leadingDropdown?: React.ReactElement;
    selectionType: 'single' | 'range';
  },
  ref: React.ForwardedRef<BladeElementRef>,
): React.ReactElement => {
  const { format, date, setControlledValue, leadingDropdown, tags, id, ...textInputProps } = props;
  const [inputValue, setInputValue] = React.useState(['']);
  const isRange = props.selectionType === 'range';

  const stripDelimiters = (str?: string): string => str?.replace(/\//g, '') ?? '';
  React.useEffect(() => {
    if (textInputProps.value) {
      setInputValue(
        isRange
          ? [stripDelimiters(textInputProps.value[0]), stripDelimiters(textInputProps.value[1])]
          : [stripDelimiters(textInputProps.value[0])],
      );
    }
  }, [textInputProps.value, isRange]);

  // Parse user input and convert to Date objects
  const parseInputValue = (value: string): Date | null | [Date | null, Date | null] | undefined => {
    if (!value?.trim()) {
      return isRange ? ([null, null] as [Date | null, Date | null]) : null;
    }

    if (isRange) {
      const parts = value.split(/\s*→\s*/);
      const baseFormat = format?.split('→')[0]?.trim() || format;

      // For range, only validate when we have substantial input
      if (value.length >= 10) {
        const startPart = parts[0]?.trim() || '';
        const endPart = parts[1]?.trim() || '';

        const startDate = startPart ? dayjs(startPart, baseFormat, true) : null;
        const endDate = endPart.length >= 10 ? dayjs(endPart, baseFormat, true) : null;

        // If end date is being edited (incomplete), return special signal
        // Why PRESERVE signal? If we return undefined, start date won't update for calendar sync.
        // If we return [start, null], it clears the existing end date while user is still typing.
        if (endPart.length > 0 && endPart.length < 10) {
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

  const applyDateValue = React.useCallback(
    (inputValue: string, shouldClearWhenEmpty = false): void => {
      if (inputValue?.trim()) {
        const parsed = parseInputValue(inputValue);
        // Only update controlled value if parsing returned a definitive result
        // undefined means "don't change" (user is still editing)
        if (parsed !== undefined) {
          if (isRange && Array.isArray(parsed) && (parsed as any)[1] === 'PRESERVE') {
            // PRESERVE signal: User is editing incomplete end date (e.g., "25/12/202")
            // Update start date immediately but preserve existing end date to prevent clearing
            const currentValue = date;
            const currentEnd = Array.isArray(currentValue) ? currentValue[1] : null;

            setControlledValue?.([parsed[0] as Date | null, currentEnd]);
          } else {
            // single date case
            setControlledValue?.(parsed);
          }
        }
      } else if (shouldClearWhenEmpty) {
        // Clear when empty (only for onChange, not onBlur)
        setControlledValue?.(isRange ? ([null, null] as [Date | null, Date | null]) : null);
      }
    },
    [isRange, date, setControlledValue],
  );

  const handleInputChange = ({ value }: { value?: string }): void => {
    applyDateValue(value ?? '', true); // Clear when empty on change
  };

  const handleBlur = React.useCallback(
    (params: { name?: string; value?: string; event?: React.FocusEvent<HTMLInputElement> }) => {
      const currentInputValue = params.event?.target.value ?? params.value ?? '';

      applyDateValue(currentInputValue, false); // Don't clear when empty on blur
    },
    [applyDateValue],
  );

  return (
    <TextInput
      {...textInputProps}
      ref={ref}
      type="number"
      value={isRange ? rangeFormattedValue(inputValue[0], inputValue[1]) : inputValue[0]}
      leadingIcon={CalendarIcon}
      leading={leadingDropdown}
      format={
        isRange
          ? getTextInputFormat(finalInputFormat(inputValue[0], inputValue[1], format), true)
          : getTextInputFormat(format, false)
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
          label={label?.start ?? label} // Initially planned to only support string, but supporting both string and object to avoid breaking changes
          placeholder={rangeInputPlaceHolder(placeholder, format)}
          popupId={referenceProps['aria-controls']}
          isPopupExpanded={referenceProps['aria-expanded']}
          size={size}
          autoFocus={autoFocus}
          value={[startValue, endValue]}
          componentName="DatePickerInputRange"
          necessityIndicator={necessityIndicator}
          successText={successText?.start ?? successText}
          errorText={errorText?.start ?? errorText}
          helpText={helpText?.start ?? helpText}
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
