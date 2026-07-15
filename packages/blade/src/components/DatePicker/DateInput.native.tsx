/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useI18nContext } from '@razorpay/i18nify-react';
import type { DatePickerInputProps, DateInputProps } from './types';
import {
  getFormattedDate,
  getHumanizedDate,
  rangeFormattedValue,
  rangeInputPlaceHolder,
  finalInputFormat,
  getTextInputFormat,
  validateAndParseDateInput,
  stripDelimiters,
  convertIntlToDayjsLocale,
} from './utils';
import { useDatePickerContext } from './DatePickerContext';
import BaseBox from '~components/Box/BaseBox';
import { TextInput } from '~components/Input/TextInput';
import type { BladeElementRef } from '~utils/types';
import { CalendarIcon } from '~components/Icons';

/**
 * Native DateInput. Mirrors the web `_DateInput` but:
 * - reads locale from `useI18nContext` (web uses `@mantine/dates` `useDatesContext`)
 * - drops DOM `event.target` / `onKeyDown` plumbing (no keyboard events on native)
 * - the hidden form `<input>` is removed (native forms don't use it)
 * - the input is rendered as a non-editable button (`as="button"`) so a single press
 *   opens the calendar sheet (via the parent-wired `onClick`) without opening a keyboard
 *   or triggering a focus/blur re-render loop.
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
    selectedPresetLabel,
    showClearButton,
    onClearButtonClick,
    ...textInputProps
  } = props;

  const datePickerContext = useDatePickerContext();
  const isPopupOpen = datePickerContext?.isDatePickerBodyOpen ?? false;
  const displayFormat = datePickerContext?.displayFormat ?? 'default';
  const isCompactMode = displayFormat === 'compact';
  const { i18nState } = useI18nContext();
  const locale = convertIntlToDayjsLocale(i18nState?.locale ?? 'en-IN');

  const isRange =
    effectiveSelectionType === 'single'
      ? false
      : effectiveSelectionType === 'range' || props.selectionType === 'range';

  const [inputValue, setInputValue] = React.useState<string[]>(isRange ? ['', ''] : ['']);
  const [validationError, setValidationError] = React.useState<string | undefined>(undefined);
  const [isFocused, setIsFocused] = React.useState(false);
  const shouldShowCalendarIcon = !Boolean(leadingDropdown);

  // NOTE: `textInputProps.value` is a fresh array literal on every render
  // (`value={[dateValue]}` / `value={[startValue, endValue]}`). Depending on the
  // array reference here caused `setInputValue` to fire every render → an infinite
  // "Maximum update depth exceeded" loop. Depend on the primitive string contents
  // instead so the effect only runs when the actual date strings change.
  const valueStart = textInputProps.value?.[0];
  const valueEnd = textInputProps.value?.[1];
  React.useEffect(() => {
    if (textInputProps.value) {
      setInputValue(
        isRange
          ? [stripDelimiters(valueStart ?? ''), stripDelimiters(valueEnd ?? '')]
          : [stripDelimiters(valueStart ?? '')],
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueStart, valueEnd, isRange, format]);

  React.useEffect(() => {
    setValidationError(undefined);
  }, [date]);

  const applyDateValue = React.useCallback(
    (nextInputValue: string, shouldClearWhenEmpty = false): void => {
      if (nextInputValue?.trim()) {
        const validation = validateAndParseDateInput(nextInputValue, isRange, format, {
          excludeDate: props.excludeDate,
          minDate: props.minDate,
          maxDate: props.maxDate,
        });
        if (validation.shouldBlock) {
          return;
        }

        if (validation.parsedValue !== undefined) {
          let finalValue = validation.parsedValue;

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
    const nextInputValue = value ?? '';
    setValidationError(undefined);

    if (nextInputValue?.trim()) {
      const validation = validateAndParseDateInput(nextInputValue, isRange, format, {
        excludeDate: props.excludeDate,
        minDate: props.minDate,
        maxDate: props.maxDate,
      });

      if (validation.shouldBlock && validation.error) {
        setValidationError(validation.error);
      }
    }

    applyDateValue(nextInputValue, true);
  };

  const handleBlur = React.useCallback(
    (params: { name?: string; value?: string }) => {
      const currentInputValue = params.value ?? '';
      setValidationError(undefined);

      if (currentInputValue?.trim()) {
        const validation = validateAndParseDateInput(currentInputValue, isRange, format, {
          excludeDate: props.excludeDate,
          minDate: props.minDate,
          maxDate: props.maxDate,
        });

        if (validation.shouldBlock && validation.error) {
          setValidationError(validation.error);
          return;
        }
      }

      applyDateValue(currentInputValue, false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [applyDateValue, isRange],
  );

  const handleFocus = React.useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlurWithFocusState = React.useCallback(
    (params: { name?: string; value?: string }) => {
      setIsFocused(false);
      handleBlur(params);
    },
    [handleBlur],
  );

  const isDatePickerActive = isFocused || isPopupOpen;

  const hasValidSelection = isRange
    ? (date as [Date | null, Date | null])?.[0] && (date as [Date | null, Date | null])?.[1]
    : Boolean(date);

  const showPresetLabel =
    displayFormat === 'compact' && selectedPresetLabel && hasValidSelection && !isDatePickerActive;

  const showCompactHumanizedDate =
    isCompactMode &&
    !selectedPresetLabel &&
    hasValidSelection &&
    !isDatePickerActive &&
    format === 'DD/MM/YYYY';

  const getInputDisplayProps = (): Record<string, unknown> => {
    if (showPresetLabel) {
      return {
        type: 'text' as const,
        value: selectedPresetLabel as string,
        leadingIcon: CalendarIcon,
        format: undefined,
        validationState: textInputProps.validationState,
        errorText: textInputProps.errorText,
        onChange: handleInputChange,
        onBlur: handleBlurWithFocusState,
        onFocus: handleFocus,
      };
    }

    if (showCompactHumanizedDate) {
      return {
        type: 'text' as const,
        value: getHumanizedDate({
          date: date ?? null,
          locale,
          selectionType: isRange ? 'range' : 'single',
        }),
        leadingIcon: CalendarIcon,
        format: undefined,
        validationState: textInputProps.validationState,
        errorText: textInputProps.errorText,
        onChange: handleInputChange,
        onBlur: handleBlurWithFocusState,
        onFocus: handleFocus,
      };
    }

    const dateDisplayValue = isRange
      ? rangeFormattedValue(inputValue[0], inputValue[1])
      : inputValue[0];
    const dateInputFormat = isRange
      ? getTextInputFormat(finalInputFormat(inputValue[0], inputValue[1], format), true)
      : getTextInputFormat(format, false);

    const showLeadingDropdown = isCompactMode ? undefined : leadingDropdown;
    const showLeadingIcon = isCompactMode || shouldShowCalendarIcon ? CalendarIcon : undefined;

    return {
      type: 'number' as const,
      value: dateDisplayValue,
      leadingIcon: showLeadingIcon,
      ...(showLeadingDropdown ? { leading: showLeadingDropdown } : {}),
      format: dateInputFormat,
      validationState: validationError ? ('error' as const) : textInputProps.validationState,
      errorText: textInputProps.errorText ?? validationError,
      onChange: handleInputChange,
      onBlur: handleBlurWithFocusState,
      onFocus: handleFocus,
    };
  };

  return (
    <TextInput
      {...textInputProps}
      ref={ref}
      {...getInputDisplayProps()}
      // On native the DateInput is a NON-editable, press-to-open trigger (mirrors the
      // dropdown `BaseDropdownInputTrigger` `as="button"` path → `StyledNativeBaseButton`,
      // a Pressable). This avoids the editable `TextInput` grabbing keyboard focus and
      // re-firing the open handler on focus/blur churn (the old infinite-loop + keyboard
      // bug). The calendar BottomSheet is the input method on native, so free-text date
      // typing is intentionally dropped.
      as="button"
      // The native trigger renders as a `button` (Pressable), so it never receives real
      // focus on tap — the shared BaseInput would keep a plain gray border and no focus
      // ring. Force the "active" visual (blue border + focus ring) whenever the DatePicker
      // is active (input focused OR the calendar sheet is open), mirroring web.
      activeInteraction={isDatePickerActive ? 'focus' : undefined}
      onClick={(e) => {
        if (textInputProps.isDisabled) {
          return;
        }
        textInputProps.onClick?.(e);
      }}
      showClearButton={showClearButton}
      onClearButtonClick={onClearButtonClick}
    />
  );
};

const DateInput = React.forwardRef(_DateInput);

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
    showClearButton,
    onClearButtonClick,
    selectedPresetLabel,
    ...props
  }: DatePickerInputProps,
  ref: React.ForwardedRef<any>,
): React.ReactElement => {
  const { i18nState } = useI18nContext();
  const locale = convertIntlToDayjsLocale(i18nState?.locale ?? 'en-IN');

  if (selectionType === 'single') {
    const dateValue = getFormattedDate({
      date,
      format,
      labelSeparator: '-',
      locale,
      type: 'default',
    });
    return (
      <BaseBox width="100%">
        <DateInput
          ref={ref as never}
          id="start-date"
          labelPosition={labelPosition}
          label={label}
          placeholder={placeholder || format}
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
          showClearButton={showClearButton}
          onClearButtonClick={onClearButtonClick}
          selectedPresetLabel={selectedPresetLabel}
          {...props}
          {...referenceProps}
        />
      </BaseBox>
    );
  }

  if (selectionType === 'range') {
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
        <DateInput
          ref={ref as never}
          id="range-date"
          labelPosition={labelPosition}
          label={typeof label === 'object' ? label?.start : label}
          placeholder={rangeInputPlaceHolder(placeholder, format)}
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
          showClearButton={showClearButton}
          onClearButtonClick={onClearButtonClick}
          selectedPresetLabel={selectedPresetLabel}
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
