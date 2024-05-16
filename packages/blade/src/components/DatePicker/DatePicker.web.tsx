/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DatesRangeValue } from '@mantine/dates';
import { shiftTimezone, useDatesContext } from '@mantine/dates';
import React from 'react';
import { FloatingFocusManager, FloatingPortal } from '@floating-ui/react';
import { Calendar } from './Calendar';
import { PresetSideBar } from './QuickSelection/PresetSideBar';
import type { DatePickerProps, DateSelectionType } from './types';
import { useDatesState } from './useDatesState';
import { DatePickerInput } from './DateInput';
import { usePopup } from './usePopup';
import { CalendarFooter } from './CalendarFooter';
import BaseBox from '~components/Box/BaseBox';
import { useControllableState } from '~utils/useControllable';
import { useTheme } from '~utils';
import { useId } from '~utils/useId';
import { makeAccessible } from '~utils/makeAccessible';
import { useIsMobile } from '~utils/useIsMobile';
import {
  BottomSheet,
  BottomSheetBody,
  BottomSheetFooter,
  BottomSheetHeader,
} from '~components/BottomSheet';

const DatePicker = <Type extends DateSelectionType = 'single'>({
  selectionType,
  allowSingleDateInRange,
  value,
  defaultValue,
  onChange,
  presets,
  date,
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
  ...props
}: DatePickerProps<Type>): React.ReactElement => {
  const _selectionType = selectionType ?? 'single';
  const { theme } = useTheme();
  const ctx = useDatesContext();
  const isSingle = _selectionType === 'single';
  const [_, forceRerenderBottomSheet] = React.useReducer((x: number) => x + 1, 0);

  const [selectedPreset, setSelectedPreset] = React.useState<DatesRangeValue | null>(null);
  const {
    onDateChange,
    onRootMouseLeave,
    onHoveredDateChange,
    getControlProps,
    setPickedDate,
    controlledValue,
    setControlledValue,
  } = useDatesState({
    level: 'day',
    type: isSingle ? 'default' : 'range',
    allowDeselect: false,
    allowSingleDateInRange,
    value,
    defaultValue,
    onChange: (date) => {
      onChange?.(date as never);
      if (isSingle) return;
      // sync selected preset with value
      setSelectedPreset(date as DatesRangeValue);
    },
  });

  const [controllableIsOpen, controllableSetIsOpen] = useControllableState({
    value: isOpen,
    defaultValue: defaultIsOpen,
    onChange: (isOpen) => onOpenChange?.({ isOpen }),
  });

  const today = shiftTimezone('add', new Date(), ctx.getTimezone());
  const currentDate = date ?? today;
  const [oldValue, setOldValue] = React.useState<DatesRangeValue | null>(controlledValue);

  const close = React.useCallback(() => {
    controllableSetIsOpen(() => false);
  }, [controllableSetIsOpen]);

  const handleApply = (): void => {
    onChange?.(controlledValue);
    setOldValue(controlledValue);
    close();
  };

  const handleCancel = (): void => {
    setControlledValue(oldValue);
    setPickedDate(null);
    close();
  };

  const isMobile = useIsMobile();
  const defaultInitialFocusRef = React.useRef<HTMLButtonElement>(null);
  const titleId = useId('datepicker-title');
  const referenceRef = React.useRef<HTMLButtonElement>(null);
  const {
    context,
    refs,
    isMounted,
    floatingStyles,
    animationStyles,
    getReferenceProps,
    getFloatingProps,
  } = usePopup({
    enabled: !isMobile,
    placement: 'bottom-start',
    open: controllableIsOpen,
    onOpenChange: (isOpen, _, reason) => {
      controllableSetIsOpen(() => isOpen);
      if (reason === 'escape-key' || reason === 'outside-press') {
        handleCancel();
      }
    },
    referenceRef,
  });

  const shouldRenderPresets = !isSingle && !isMobile;

  const content = (
    <>
      {shouldRenderPresets ? (
        <PresetSideBar
          presets={presets}
          date={currentDate}
          selectedPreset={selectedPreset}
          onSelection={(preset) => {
            const presetValue = preset?.(currentDate);
            setControlledValue(presetValue);
            setSelectedPreset(presetValue);
          }}
        />
      ) : null}
      <BaseBox
        width="100%"
        display="flex"
        flexDirection="column"
        gap="spacing.5"
        data-nice
        padding={{ m: 'spacing.6', s: 'spacing.0' }}
        backgroundColor="surface.background.gray.intense"
      >
        <Calendar
          selectionType={_selectionType}
          defaultValue={defaultValue}
          onMouseLeave={onRootMouseLeave}
          __onDayMouseEnter={(_event, date) => {
            onHoveredDateChange(date);
          }}
          __onDayClick={(_event, date) => {
            onDateChange(date);
          }}
          getDayProps={(date) => {
            return {
              ...getControlProps(date),
            };
          }}
          onMonthSelect={(date) => {
            props?.onMonthSelect?.(date);
            onDateChange(date);
          }}
          onYearSelect={(date) => {
            props?.onYearSelect?.(date);
            onDateChange(date);
          }}
          onNext={(date) => {
            props?.onNext?.(date);
            forceRerenderBottomSheet();
          }}
          onPrevious={(date) => {
            props?.onPrevious?.(date);
            forceRerenderBottomSheet();
          }}
          onPickerChange={(date) => {
            props?.onPickerChange?.(date);
            forceRerenderBottomSheet();
          }}
          {...props}
        />
        {isMobile ? null : <CalendarFooter onApply={handleApply} onCancel={handleCancel} />}
      </BaseBox>
    </>
  );

  return (
    <BaseBox width="100%">
      <DatePickerInput
        selectionType={_selectionType}
        date={controlledValue}
        ref={referenceRef}
        inputRef={refs.reference}
        referenceProps={getReferenceProps()}
        label={label as never}
        labelPosition={labelPosition}
        accessibilityLabel={accessibilityLabel}
        size={size}
        errorText={errorText}
        helpText={helpText}
        isDisabled={isDisabled}
        isRequired={isRequired}
        successText={successText}
        validationState={validationState}
      />
      {isMobile ? (
        <BottomSheet
          snapPoints={[0.9, 0.9, 1]}
          isOpen={controllableIsOpen}
          onDismiss={() => {
            handleCancel();
          }}
        >
          <BottomSheetHeader title={isSingle ? 'Select Date' : 'Select Date Range'} />
          <BottomSheetBody>
            {content}
            {!isSingle && (
              <PresetSideBar
                isMobile
                presets={presets}
                date={currentDate}
                selectedPreset={selectedPreset}
                onSelection={(preset) => {
                  const presetValue = preset?.(currentDate);
                  setControlledValue(presetValue);
                  setSelectedPreset(presetValue);
                }}
              />
            )}
          </BottomSheetBody>
          <BottomSheetFooter>
            <CalendarFooter onCancel={handleCancel} onApply={handleApply} isMobile />
          </BottomSheetFooter>
        </BottomSheet>
      ) : (
        isMounted && (
          <FloatingPortal>
            <FloatingFocusManager
              initialFocus={defaultInitialFocusRef}
              context={context}
              guards={true}
            >
              <BaseBox
                ref={refs.setFloating}
                style={floatingStyles}
                {...getFloatingProps()}
                {...makeAccessible({ labelledBy: titleId })}
              >
                <BaseBox
                  display="flex"
                  flexDirection="row"
                  borderColor="surface.border.gray.subtle"
                  borderWidth="thin"
                  borderStyle="solid"
                  borderRadius="medium"
                  overflow="hidden"
                  minWidth="320px"
                  style={{ ...animationStyles, boxShadow: `${theme.elevation.lowRaised}` }}
                >
                  {content}
                </BaseBox>
              </BaseBox>
            </FloatingFocusManager>
          </FloatingPortal>
        )
      )}
    </BaseBox>
  );
};

export { DatePicker };
