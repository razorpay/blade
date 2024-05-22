/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { DatesProvider, shiftTimezone, useDatesContext } from '@mantine/dates';
import React from 'react';
import { FloatingFocusManager, FloatingPortal } from '@floating-ui/react';
import { useI18nContext } from '@razorpay/i18nify-react';
import { HeadlessMantineProvider } from '@mantine/core';
import dayjs from 'dayjs';
import type { DatesRangeValue, DatePickerProps, DateSelectionType, PickerType } from './types';
import { Calendar } from './Calendar';
import { PresetSideBar } from './QuickSelection/PresetSideBar';
import { useDatesState } from './useDatesState';
import { DatePickerInput } from './DateInput';
import { usePopup } from './usePopup';
import { CalendarFooter } from './CalendarFooter';
import { convertIntlToDayjsLocale } from './utils';
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
  ...props
}: DatePickerProps<Type>): React.ReactElement => {
  const { i18nState } = useI18nContext();
  const _selectionType = selectionType ?? 'single';
  const { theme } = useTheme();
  const ctx = useDatesContext();
  const isSingle = _selectionType === 'single';
  const [_, forceRerenderBottomSheet] = React.useReducer((x: number) => x + 1, 0);
  const [selectedPreset, setSelectedPreset] = React.useState<DatesRangeValue | null>(null);

  const [_picker, setPicker] = useControllableState<PickerType>({
    defaultValue: defaultPicker,
    value: picker,
    onChange: (picker) => {
      onPickerChange?.(picker);
    },
  });

  const {
    onDateChange,
    onRootMouseLeave,
    onHoveredDateChange,
    getControlProps,
    setPickedDate,
    controlledValue,
    setControlledValue,
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
      // sync selected preset with value
      setSelectedPreset(date as DatesRangeValue);
    },
  });

  const [controllableIsOpen, controllableSetIsOpen] = useControllableState({
    value: isOpen,
    defaultValue: defaultIsOpen,
    onChange: (isOpen) => onOpenChange?.({ isOpen }),
  });

  const currentDate = shiftTimezone('add', new Date(), ctx.getTimezone());
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
        padding={{ m: 'spacing.6', s: 'spacing.0' }}
        backgroundColor="surface.background.gray.intense"
      >
        <Calendar
          {...props}
          selectionType={_selectionType}
          defaultValue={defaultValue}
          onMouseLeave={onRootMouseLeave}
          __onDayMouseEnter={(_event, date) => {
            onHoveredDateChange(date);
          }}
          __onDayClick={(_event, date) => {
            onDateChange(date);
          }}
          getMonthControlProps={(date) => {
            return getControlProps(date);
          }}
          getYearControlProps={(date) => {
            return getControlProps(date);
          }}
          getDayProps={(date) => {
            return getControlProps(date);
          }}
          onMonthSelect={(date) => {
            props?.onMonthSelect?.(date);
            onDateChange(date);
          }}
          onYearSelect={(date) => {
            props?.onYearSelect?.(date);
            onDateChange(date);
          }}
          onNext={(data) => {
            props?.onNext?.(data);
            forceRerenderBottomSheet();
          }}
          onPrevious={(data) => {
            props?.onPrevious?.(data);
            forceRerenderBottomSheet();
          }}
          picker={_picker}
          onPickerChange={(picker) => {
            setPicker(() => picker);
            forceRerenderBottomSheet();
          }}
        />
        {isMobile ? null : <CalendarFooter onApply={handleApply} onCancel={handleCancel} />}
      </BaseBox>
    </>
  );

  const dateProviderValue = React.useMemo(() => {
    const locale = convertIntlToDayjsLocale(i18nState?.locale ?? 'en-IN');
    dayjs.locale(locale);
    return {
      locale,
    };
  }, [i18nState?.locale]);

  return (
    <HeadlessMantineProvider>
      <DatesProvider settings={dateProviderValue}>
        <BaseBox width="100%">
          <DatePickerInput
            selectionType={_selectionType}
            date={controlledValue}
            ref={referenceRef}
            inputRef={refs.reference}
            referenceProps={getReferenceProps()}
            name={name as never}
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
            autoFocus={autoFocus}
            necessityIndicator={necessityIndicator}
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
                <CalendarFooter onCancel={handleCancel} onApply={handleApply} />
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
      </DatesProvider>
    </HeadlessMantineProvider>
  );
};

export { DatePicker };
