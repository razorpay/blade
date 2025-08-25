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
import { Calendar } from './Calendar.web';
import { CalendarFooter } from './CalendarFooter.web';
import { DatePickerInput } from './DateInput.web';
import { DatePickerFilterChip } from './FilterChipDatePicker/DatePickerFilterChip.web';
import { PresetDropdown } from './QuickSelection/PresetDropdown.web';
import { PresetProvider } from './QuickSelection/PresetContext';
import { PresetSideBar } from './QuickSelection/PresetSideBar.web';
import { shiftTimezone } from './shiftTimezone';
import { useDatesState } from './useDatesState';
import { usePopup } from './usePopup';
import { convertIntlToDayjsLocale, loadScript } from './utils';
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
import { useListViewFilterContext } from '~components/ListView/ListViewFiltersContext.web';
import { useFilterChipGroupContext } from '~components/Dropdown/FilterChipGroupContext.web';

// Calendar dimensions for consistent layout
const CALENDAR_HEIGHTS = {
  // Height includes: Calendar grid (6 weeks * ~44px) + header (~48px) + footer actions (~64px) + padding
  DAY_PICKER_WITH_FOOTER: '447px',
} as const;

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
  zIndex = componentZIndices.popover,
  format = 'DD/MM/YYYY',
  inputPlaceHolder,
  inputElementType = 'datePickerInput',
  onClearButtonClick,
  labelSuffix,
  labelTrailing,
  showFooterActions = true,
  ...props
}: DatePickerProps<Type> &
  StyledPropsBlade &
  DataAnalyticsAttribute & {
    inputElementType: 'chip' | 'datePickerInput';
    onClearButtonClick?: () => void;
  }): React.ReactElement => {
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
      fireNativeEvent(referenceRef, ['input']);
      if (isSingle) return;
      // sync selected preset with value
      setSelectedPreset(date as DatesRangeValue);
    },
  });
  const [oldValue, setOldValue] = React.useState<DatesRangeValue | null>(controlledValue);

  // Sync selectedPreset with controlledValue for initial preset matching
  React.useEffect(() => {
    if (!isSingle && controlledValue) {
      setSelectedPreset(controlledValue as DatesRangeValue);
    }
  }, []);

  const [controllableIsOpen, controllableSetIsOpen] = useControllableState({
    value: isOpen,
    defaultValue: defaultIsOpen,
    onChange: (isOpen) => {
      onOpenChange?.({ isOpen });
      // we need to update old value everytime datepicker is opened or closed
      setOldValue(controlledValue);
      setPicker(() => defaultPicker);
    },
  });

  const currentDate = shiftTimezone('add', new Date());
  const hasBothDatesSelected = controlledValue?.[0] && controlledValue?.[1];
  const { listViewSelectedFilters, setListViewSelectedFilters } = useListViewFilterContext();
  const {
    clearFilterCallbackTriggerer,
    setFilterChipGroupSelectedFilters,
  } = useFilterChipGroupContext();
  let applyButtonDisabled = !hasBothDatesSelected;
  if (isSingle) {
    applyButtonDisabled = !Boolean(controlledValue);
  }

  const close = React.useCallback(() => {
    controllableSetIsOpen(() => false);
  }, [controllableSetIsOpen]);

  const handleApply = (): void => {
    const updateSelectedFilters = () => {
      setFilterChipGroupSelectedFilters((prev: string[]) => [...prev, label as string]);
    };
    const storeSelectedFiltersAndValueInListViewContext = () => {
      setListViewSelectedFilters((prev) => {
        if (isSingle) {
          return { ...prev, [label as string]: [controlledValue as string] };
        }
        return { ...prev, [label as string]: controlledValue as string[] };
      });
    };
    if (isSingle) {
      onChange?.(controlledValue);
      fireNativeEvent(referenceRef, ['change']);
      setOldValue(controlledValue);
      onApply?.(controlledValue);
      close();
      storeSelectedFiltersAndValueInListViewContext();
      updateSelectedFilters();
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

    storeSelectedFiltersAndValueInListViewContext();
    updateSelectedFilters();
  };

  const handleCancel = (): void => {
    setControlledValue(oldValue);
    fireNativeEvent(referenceRef, ['change']);
    setPickedDate(null);
    close();
  };

  const handleClear = (): void => {
    fireNativeEvent(referenceRef, ['change']);
    handleReset();
    close();
    setFilterChipGroupSelectedFilters((prev: string[]) =>
      prev.filter((filter) => filter !== label),
    );

    setListViewSelectedFilters((prev) => {
      const { [label as string]: _, ...rest } = prev;
      return rest;
    });
    onClearButtonClick?.();
  };

  React.useEffect(() => {
    if (listViewSelectedFilters[label as string]) {
      setControlledValue(
        (listViewSelectedFilters[
          label as keyof typeof listViewSelectedFilters
        ] as unknown) as DatesRangeValue,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (clearFilterCallbackTriggerer) {
      handleClear();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearFilterCallbackTriggerer]);

  const isMobile = useIsMobile();
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
      if (reason === 'escape-key') {
        handleCancel();
      }
    },
    referenceRef,
    crossAxisOffset: -28,
  });

  const shouldRenderPresets = !isSingle && !isMobile;

  // MOBILE: Blur input when bottom sheet opens to prevent keyboard + sheet overlap
  // Use setTimeout(0) instead of requestAnimationFrame: BottomSheet captures document.activeElement
  // on open for focus restoration. Deferring blur to next macrotask ensures BottomSheet first
  // snapshots the focused input, then we blur to hide keyboard. On close, focus auto-restores.
  React.useEffect(() => {
    if (isMobile && controllableIsOpen) {
      const refEl = (refs.reference?.current as unknown) as { blur?: () => void } | null;
      if (refEl?.blur) {
        setTimeout(() => {
          refEl.blur?.();
        }, 0);
      }
    }
  }, [isMobile, controllableIsOpen, refs.reference]);

  const content = (
    <>
      {shouldRenderPresets ? (
        <PresetSideBar
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
        /* We only need to set height for day picker, for year picker
         or month it should be auto. */
        height={
          _picker === 'day' && showFooterActions ? CALENDAR_HEIGHTS.DAY_PICKER_WITH_FOOTER : 'auto'
        }
        backgroundColor="surface.background.gray.intense"
        justifyContent="space-between"
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
            onDateChange(date, 'day');
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
            onDateChange(date, 'month');
          }}
          onYearSelect={(date) => {
            props?.onYearSelect?.(date);
            onDateChange(date, 'year');
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
          selectedValue={controlledValue}
        />
        {showFooterActions &&
          (isMobile ? null : (
            <CalendarFooter
              isButtonDisabled={applyButtonDisabled}
              onApply={handleApply}
              onCancel={handleCancel}
            />
          ))}
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
        <PresetProvider presets={presets} selectedPreset={selectedPreset} currentDate={currentDate}>
          <BaseBox
            width={inputElementType === 'chip' ? 'fit-content' : '100%'}
            {...getStyledProps(props)}
            {...metaAttribute({ name: MetaConstants.DatePicker })}
          >
            {inputElementType === 'chip' ? (
              <DatePickerFilterChip
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
                onClearButtonChange={handleClear}
                {...makeAnalyticsAttribute(props)}
              />
            ) : (
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
                labelSuffix={labelSuffix}
                labelTrailing={labelTrailing}
                setControlledValue={setControlledValue}
                selectedPreset={selectedPreset}
                excludeDate={props.excludeDate}
                minDate={props.minDate}
                maxDate={props.maxDate}
                leadingDropdown={
                  presets && shouldRenderPresets ? (
                    <PresetDropdown
                      onSelection={(preset) => {
                        const presetValue = preset?.(currentDate);
                        setControlledValue(presetValue);
                        setSelectedPreset(presetValue);
                      }}
                      onOpenCalendar={() => {
                        controllableSetIsOpen(() => true);
                      }}
                    />
                  ) : undefined
                }
                {...makeAnalyticsAttribute(props)}
              />
            )}
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
                      onSelection={(preset) => {
                        const presetValue = preset?.(currentDate);
                        setControlledValue(presetValue);
                        setSelectedPreset(presetValue);
                      }}
                    />
                  )}
                </BottomSheetBody>
                {showFooterActions && (
                  <BottomSheetFooter>
                    <CalendarFooter onCancel={handleCancel} onApply={handleApply} />
                  </BottomSheetFooter>
                )}
              </BottomSheet>
            ) : (
              isMounted && (
                <FloatingPortal>
                  <FloatingFocusManager
                    initialFocus={-1}
                    context={context}
                    guards={true}
                    order={['reference', 'content']}
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
        </PresetProvider>
      </DatesProvider>
    </MantineProvider>
  );
};

export { BaseDatePicker };
