/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { DatesProvider } from '@mantine/dates';
import React from 'react';
import { FloatingFocusManager, FloatingPortal } from '@floating-ui/react';
import { useI18nContext } from '@razorpay/i18nify-react';
import { MantineProvider } from '@mantine/core';
import dayjs from 'dayjs';
import type { DatesRangeValue, DatePickerProps, DateSelectionType, PickerType } from './types';
import { Calendar } from './Calendar';
import { PresetSideBar } from './QuickSelection/PresetSideBar';
import { useDatesState } from './useDatesState';
import { DatePickerInput } from './DateInput';
import { usePopup } from './usePopup';
import { CalendarFooter } from './CalendarFooter';
import { convertIntlToDayjsLocale, loadScript } from './utils';
import { shiftTimezone } from './shiftTimezone';
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
import { logger } from '~utils/logger';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import { getStyledProps } from '~components/Box/styledProps';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { componentZIndices } from '~utils/componentZIndices';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import type { DataAnalyticsAttribute } from '~utils/types';
import { fireNativeEvent } from '~utils/fireNativeEvent';

const DatePicker = <Type extends DateSelectionType = 'single'>({
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
  zIndex = componentZIndices.popover,
  format = 'DD/MM/YYYY',
  inputPlaceHolder,
  ...props
}: DatePickerProps<Type> & StyledPropsBlade & DataAnalyticsAttribute): React.ReactElement => {
  const { i18nState } = useI18nContext();
  const _selectionType = selectionType ?? 'single';
  const { theme } = useTheme();
  const isSingle = _selectionType === 'single';
  const [_, forceRerender] = React.useReducer((x: number) => x + 1, 0);
  const [selectedPreset, setSelectedPreset] = React.useState<DatesRangeValue | null>(null);
  const referenceRef = React.useRef<HTMLButtonElement>(null);

  const [_picker, setPicker] = useControllableState<PickerType>({
    defaultValue: defaultPicker,
    value: picker,
    onChange: (picker) => {
      onPickerChange?.(picker);
    },
  });
  const finalFormat = React.useMemo(() => {
    if (format) {
      return format;
    }
    if (picker === 'month') {
      return 'MMMM';
    }
    if (picker === 'year') {
      return 'YYYY';
    }
    return 'DD/MM/YYYY';
  }, [format, picker]);

  const finalInputPlaceHolder = React.useMemo(() => {
    if (inputPlaceHolder) {
      return inputPlaceHolder;
    }
    if (picker === 'month') {
      return 'Month';
    }
    if (picker === 'year') {
      return 'Year';
    }
    return 'DD/MM/YYYY';
  }, [inputPlaceHolder, picker]);

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
      fireNativeEvent(referenceRef, ['input']);
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

  const currentDate = shiftTimezone('add', new Date());
  const [oldValue, setOldValue] = React.useState<DatesRangeValue | null>(controlledValue);
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
      onChange?.(controlledValue);
      fireNativeEvent(referenceRef, ['change']);
      setOldValue(controlledValue);
      onApply?.(controlledValue);
      close();
      return;
    }
    // only apply if both dates are selected
    if (hasBothDatesSelected) {
      onChange?.(controlledValue);
      fireNativeEvent(referenceRef, ['change']);
      setOldValue(controlledValue);
      onApply?.(controlledValue);
      close();
    }
  };

  const handleCancel = (): void => {
    setControlledValue(oldValue);
    fireNativeEvent(referenceRef, ['change']);
    setPickedDate(null);
    close();
  };

  const isMobile = useIsMobile();
  const defaultInitialFocusRef = React.useRef<HTMLButtonElement>(null);
  const titleId = useId('datepicker-title');
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
            forceRerender();
          }}
          onPrevious={(data) => {
            props?.onPrevious?.(data);
            forceRerender();
          }}
          picker={_picker}
          showLevelChangeLink={!picker}
          onPickerChange={(picker) => {
            setPicker(() => picker);
            forceRerender();
          }}
        />
        {isMobile ? null : (
          <CalendarFooter
            isButtonDisabled={applyButtonDisabled}
            onApply={handleApply}
            onCancel={handleCancel}
          />
        )}
      </BaseBox>
    </>
  );

  const dateProviderValue = React.useMemo(() => {
    const locale = convertIntlToDayjsLocale(i18nState?.locale ?? 'en-IN');
    return {
      locale,
    };
  }, [i18nState?.locale]);

  // Dynamically load dayjs locales
  React.useLayoutEffect(() => {
    try {
      const locale = convertIntlToDayjsLocale(i18nState?.locale ?? 'en-IN');
      // dayjs needs to be loaded into window so that once the locale is loaded it can be parsed
      if (!(window as any).dayjs) {
        (window as any).dayjs = dayjs;
      }
      loadScript(`https://cdn.jsdelivr.net/npm/dayjs@1/locale/${locale}.js`, () => {
        forceRerender();
      });
    } catch (e: unknown) {
      logger({ type: 'warn', message: 'Failed to load dayjs locale' });
    }
  }, [i18nState?.locale]);

  return (
    <MantineProvider>
      <DatesProvider settings={dateProviderValue}>
        <BaseBox
          width="100%"
          {...getStyledProps(props)}
          {...metaAttribute({ name: MetaConstants.DatePicker })}
        >
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
            errorText={errorText as never}
            helpText={helpText as never}
            successText={successText as never}
            isDisabled={isDisabled}
            isRequired={isRequired}
            validationState={validationState}
            autoFocus={autoFocus}
            necessityIndicator={necessityIndicator}
            format={finalFormat}
            placeholder={finalInputPlaceHolder}
            {...makeAnalyticsAttribute(props)}
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
                    zIndex={zIndex}
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
    </MantineProvider>
  );
};

export { DatePicker };
