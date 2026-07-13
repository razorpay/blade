/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import type { DatesRangeValue, DatePickerProps, DateSelectionType, PickerType } from './types';
import { Calendar } from './Calendar';
import { CalendarFooter } from './CalendarFooter';
import { DatePickerInput } from './DateInput';
import { DatePickerFilterChip } from './FilterChipDatePicker/DatePickerFilterChip';
import { renderPresetDropdown } from './QuickSelection/renderPresetDropdown';
import { PresetSideBar } from './QuickSelection/PresetSideBar';
import { usePresetState } from './QuickSelection/usePresetState';
import { shiftTimezone } from './shiftTimezone';
import { useDatesState } from './useDatesState';
import { DatePickerProvider } from './DatePickerContext';
import BaseBox from '~components/Box/BaseBox';
import { useControllableState } from '~utils/useControllable';
import {
  BottomSheet,
  BottomSheetBody,
  BottomSheetFooter,
  BottomSheetHeader,
} from '~components/BottomSheet';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import { getStyledProps } from '~components/Box/styledProps';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import type { DataAnalyticsAttribute } from '~utils/types';

/**
 * Native BaseDatePicker orchestration.
 *
 * Differences from the web implementation:
 * - No `MantineProvider` / `DatesProvider` / `@floating-ui` popup — native is always the
 *   "mobile" layout and always renders a `BottomSheet` for the calendar.
 * - The web `usePopup` reference/floating machinery is dropped; the input opens the sheet
 *   directly via `controllableSetIsOpen(true)`.
 * - `fireNativeEvent` (DOM-only) and the web-only ListView / FilterChipGroup filter contexts
 *   are not wired on native.
 */
const BaseDatePicker = <Type extends DateSelectionType = 'single'>({
  selectionType,
  allowSingleDateInRange,
  value,
  defaultValue,
  onChange,
  onApply,
  presets,
  isOpen,
  defaultIsOpen,
  onOpenChange,
  label,
  labelPosition = 'top',
  accessibilityLabel,
  errorText,
  helpText,
  isDisabled,
  isRequired,
  successText,
  validationState,
  size,
  autoFocus,
  necessityIndicator,
  name,
  defaultPicker = 'day',
  picker,
  onPickerChange,
  format = 'DD/MM/YYYY',
  inputPlaceHolder,
  inputElementType = 'datePickerInput',
  showClearButton,
  onClearButtonClick,
  labelSuffix,
  labelTrailing,
  showFooterActions = true,
  footer,
  displayFormat = 'default',
  ...props
}: DatePickerProps<Type> &
  StyledPropsBlade &
  DataAnalyticsAttribute & {
    inputElementType: 'chip' | 'datePickerInput';
  }): React.ReactElement => {
  const _selectionType = selectionType ?? 'single';
  const isSingle = _selectionType === 'single';
  const [, forceRerender] = React.useReducer((x: number) => x + 1, 0);
  const [selectedPreset, setSelectedPreset] = React.useState<DatesRangeValue | null>(null);
  const referenceRef = React.useRef<any>(null);
  const shouldApplyAfterPresetSelection = React.useRef(false);
  // Tracks whether the BottomSheet is being closed programmatically (apply / clear /
  // cancel) versus dismissed directly by the user (swipe-down / backdrop tap). Gorhom's
  // `onClose` fires for BOTH, and its callback runs with a stale closure where
  // `controllableIsOpen` can still read `true` — so relying on that flag alone let
  // `handleCancel` wipe a value the user JUST applied (reverting to the `oldValue`
  // captured when the sheet opened). This is especially visible in range mode where the
  // extra `setSelectedPreset` re-renders make the stale-closure race reliable. A ref is
  // always current, so it deterministically tells `onDismiss` when to skip the revert.
  const skipDismissCancelRef = React.useRef(false);

  const [_picker, setPicker] = useControllableState<PickerType>({
    defaultValue: defaultPicker,
    value: picker,
    onChange: (nextPicker) => {
      onPickerChange?.(nextPicker);
    },
  });

  const finalFormat = React.useMemo(() => {
    if (format) {
      return format;
    }
    if (_picker === 'month') {
      return 'MMMM';
    }
    if (_picker === 'year') {
      return 'YYYY';
    }
    return 'DD/MM/YYYY';
  }, [format, _picker]);

  const finalInputPlaceHolder = React.useMemo(() => {
    if (inputPlaceHolder) {
      return inputPlaceHolder;
    }
    if (_picker === 'month') {
      return 'Month';
    }
    if (_picker === 'year') {
      return 'Year';
    }
    return 'DD/MM/YYYY';
  }, [inputPlaceHolder, _picker]);

  const {
    onDateChange,
    getControlProps,
    setPickedDate,
    controlledValue,
    setControlledValue,
    handleReset,
  } = useDatesState({
    level: _picker,
    type: isSingle ? 'default' : 'range',
    allowDeselect: false,
    allowSingleDateInRange,
    value,
    defaultValue,
    onChange: (date) => {
      onChange?.(date as never);
      if (isSingle) return;
      setSelectedPreset(date as DatesRangeValue);
    },
  });
  const [oldValue, setOldValue] = React.useState<DatesRangeValue | null>(controlledValue);

  React.useEffect(() => {
    if (!isSingle && controlledValue) {
      setSelectedPreset(controlledValue as DatesRangeValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [controllableIsOpen, controllableSetIsOpen] = useControllableState({
    value: isOpen,
    defaultValue: defaultIsOpen,
    onChange: (nextIsOpen) => {
      onOpenChange?.({ isOpen: nextIsOpen });
      // A fresh open starts a new "session": the current value becomes the baseline we
      // revert to on cancel, and any pending skip-cancel intent is cleared.
      if (nextIsOpen) {
        skipDismissCancelRef.current = false;
      }
      setOldValue(controlledValue);
      setPicker(() => defaultPicker);
    },
  });

  const currentDate = shiftTimezone('add', new Date());

  const { presetStates, selectedPresetLabel, effectiveSelectionType } = usePresetState({
    presets: presets || [],
    selectedPreset,
    currentDate,
    displayFormat,
  });
  const hasBothDatesSelected = controlledValue?.[0] && controlledValue?.[1];
  let applyButtonDisabled = !hasBothDatesSelected;
  if (isSingle) {
    applyButtonDisabled = !Boolean(controlledValue);
  }

  const close = React.useCallback(() => {
    controllableSetIsOpen(() => false);
  }, [controllableSetIsOpen]);

  const handleApply = (): void => {
    if (isSingle) {
      skipDismissCancelRef.current = true;
      onChange?.(controlledValue as never);
      setOldValue(controlledValue);
      onApply?.(controlledValue as never);
      close();
      return;
    }
    if (hasBothDatesSelected) {
      skipDismissCancelRef.current = true;
      onChange?.(controlledValue as never);
      setOldValue(controlledValue);
      onApply?.(controlledValue as never);
      close();
    }
  };

  React.useEffect(() => {
    if (shouldApplyAfterPresetSelection.current) {
      shouldApplyAfterPresetSelection.current = false;
      handleApply();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controlledValue]);

  const handleCancel = (): void => {
    skipDismissCancelRef.current = true;
    setControlledValue(oldValue);
    setPickedDate(null);
    close();
  };

  // Commit the current selection without requiring an explicit Apply press. Used when
  // `showFooterActions` is false — the sheet has no Apply/Cancel buttons, so dismissing it
  // must keep whatever the user selected (mirrors `handleApply` but does not gate on a
  // complete range, since there is no button to complete the interaction with).
  const handleImplicitApply = (): void => {
    skipDismissCancelRef.current = true;
    onChange?.(controlledValue as never);
    setOldValue(controlledValue);
    onApply?.(controlledValue as never);
    close();
  };

  const handleClear = (): void => {
    skipDismissCancelRef.current = true;
    handleReset();
    setSelectedPreset(null);
    close();
    onClearButtonClick?.();
  };

  const content = (
    <BaseBox width="100%" display="flex" flexDirection="column" justifyContent="space-between">
      <BaseBox padding="spacing.0">
        <Calendar
          {...props}
          selectionType={_selectionType}
          __onDayClick={(_event, date) => {
            onDateChange(date, 'day');
          }}
          getMonthControlProps={(date) => getControlProps(date)}
          getYearControlProps={(date) => getControlProps(date)}
          getDayProps={(date) => getControlProps(date)}
          onMonthSelect={(date) => {
            props?.onMonthSelect?.(date);
            onDateChange(date, 'month');
          }}
          onYearSelect={(date) => {
            props?.onYearSelect?.(date);
            onDateChange(date, 'year');
          }}
          onNext={(data) => {
            props?.onNext?.(data as never);
            forceRerender();
          }}
          onPrevious={(data) => {
            props?.onPrevious?.(data as never);
            forceRerender();
          }}
          picker={_picker}
          showLevelChangeLink={!picker}
          onPickerChange={(nextPicker) => {
            setPicker(() => nextPicker);
            forceRerender();
          }}
          selectedValue={controlledValue}
        />
      </BaseBox>
    </BaseBox>
  );

  return (
    <DatePickerProvider isDatePickerBodyOpen={controllableIsOpen} displayFormat={displayFormat}>
      <BaseBox
        width={inputElementType === 'chip' ? undefined : '100%'}
        alignSelf={inputElementType === 'chip' ? 'flex-start' : undefined}
        {...getStyledProps(props)}
        {...metaAttribute({ name: MetaConstants.DatePicker })}
      >
        {inputElementType === 'chip' ? (
          <DatePickerFilterChip
            selectionType={_selectionType}
            date={controlledValue}
            ref={referenceRef}
            inputRef={referenceRef}
            referenceProps={{
              onClick: () => {
                if (isDisabled) return;
                controllableSetIsOpen(() => true);
              },
            }}
            name={name as never}
            label={label as never}
            labelPosition={labelPosition}
            accessibilityLabel={accessibilityLabel}
            size={size}
            errorText={errorText as never}
            helpText={helpText as never}
            successText={successText as never}
            isDisabled={isDisabled}
            isRequired={isRequired}
            validationState={validationState}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus={autoFocus}
            necessityIndicator={necessityIndicator}
            format={finalFormat}
            placeholder={finalInputPlaceHolder}
            onClearButtonChange={handleClear}
            effectiveSelectionType={isSingle ? selectionType : effectiveSelectionType}
            selectedPresetLabel={selectedPresetLabel}
            {...makeAnalyticsAttribute(props)}
          />
        ) : (
          <DatePickerInput
            selectionType={_selectionType}
            date={controlledValue}
            ref={referenceRef}
            inputRef={referenceRef}
            referenceProps={{
              onClick: () => {
                if (isDisabled) return;
                controllableSetIsOpen(() => true);
              },
            }}
            name={name as never}
            label={label as never}
            labelPosition={labelPosition}
            accessibilityLabel={accessibilityLabel}
            size={size}
            errorText={errorText as never}
            helpText={helpText as never}
            successText={successText as never}
            isDisabled={isDisabled}
            isRequired={isRequired}
            validationState={validationState}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus={autoFocus}
            necessityIndicator={necessityIndicator}
            format={finalFormat}
            placeholder={finalInputPlaceHolder}
            labelSuffix={labelSuffix}
            labelTrailing={labelTrailing}
            setControlledValue={setControlledValue}
            selectedPreset={selectedPreset}
            excludeDate={props.excludeDate}
            minDate={props.minDate}
            maxDate={props.maxDate}
            showClearButton={showClearButton}
            onClearButtonClick={handleClear}
            effectiveSelectionType={isSingle ? selectionType : effectiveSelectionType}
            selectedPresetLabel={selectedPresetLabel}
            leadingDropdown={
              presets && !isSingle && hasBothDatesSelected
                ? renderPresetDropdown({
                    onSelection: (preset: (date: Date) => DatesRangeValue) => {
                      const presetValue = preset?.(currentDate);
                      setControlledValue(presetValue);
                      setSelectedPreset(presetValue);
                      shouldApplyAfterPresetSelection.current = true;
                    },
                    onOpenCalendar: () => {
                      controllableSetIsOpen(() => true);
                    },
                    presetStates,
                    selectedPresetLabel,
                  })
                : undefined
            }
            {...makeAnalyticsAttribute(props)}
          />
        )}
        <BottomSheet
          snapPoints={[0.9, 0.9, 1]}
          isOpen={controllableIsOpen}
          onDismiss={() => {
            // Gorhom's `onClose` fires for EVERY close — programmatic (apply / clear /
            // cancel) as well as a direct user dismissal (swipe-down / backdrop). It also
            // fires spuriously while settling to index -1 on mount / re-renders.
            //
            // `handleCancel` reverts to `oldValue` (the value when the sheet opened), so
            // running it after an apply wipes the just-committed selection — the parent
            // echoes the reverted value back into a fresh `value` reference, and it also
            // risks a "Maximum update depth" loop. We must therefore ONLY cancel on a
            // genuine, user-initiated dismissal.
            //
            // A ref (always current, unlike the `controllableIsOpen` closure which reads
            // stale `true` here) tells us the close was programmatic → skip the revert.
            if (skipDismissCancelRef.current) {
              skipDismissCancelRef.current = false;
              return;
            }
            // Spurious close while already closed (e.g. mount) — nothing to cancel.
            if (!controllableIsOpen) return;
            // Without footer actions there is no Apply button, so the sheet can only be
            // closed by a user dismissal (swipe-down / backdrop). In that mode the
            // dismissal IS the commit — keep the current selection (implicit apply)
            // instead of reverting it to the pre-open value.
            if (!showFooterActions) {
              handleImplicitApply();
              return;
            }
            handleCancel();
          }}
        >
          <BottomSheetHeader title={isSingle ? 'Select Date' : 'Select Date Range'} />
          <BottomSheetBody>
            {content}
            {!isSingle && presets && (
              <PresetSideBar
                isMobile
                presetStates={presetStates}
                onSelection={(preset: (date: Date) => DatesRangeValue) => {
                  const presetValue = preset?.(currentDate);
                  setControlledValue(presetValue);
                  setSelectedPreset(presetValue);
                }}
              />
            )}
          </BottomSheetBody>
          {showFooterActions && (
            <BottomSheetFooter>
              <CalendarFooter
                isButtonDisabled={applyButtonDisabled}
                onCancel={handleCancel}
                onApply={handleApply}
                footer={footer}
              />
            </BottomSheetFooter>
          )}
        </BottomSheet>
      </BaseBox>
    </DatePickerProvider>
  );
};

export { BaseDatePicker };
