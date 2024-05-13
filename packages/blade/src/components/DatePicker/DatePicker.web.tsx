/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DatesRangeValue } from '@mantine/dates';
import { shiftTimezone, useDatesContext } from '@mantine/dates';
import React from 'react';
import { FloatingFocusManager, FloatingPortal } from '@floating-ui/react';
import { Calendar } from './Calendar';
import { PresetSideBar } from './PresetSideBar';
import type { CalendarProps, DateSelectionType } from './types';
import { useDatesState } from './useDatesState';
import { DatePickerInput } from './DateInput.web';
import { usePopup } from './usePopup';
import { CalendarFooter } from './CalendarFooter.web';
import BaseBox from '~components/Box/BaseBox';
import { useControllableState } from '~utils/useControllable';
import { useTheme } from '~utils';
import { useId } from '~utils/useId';
import { makeAccessible } from '~utils/makeAccessible';

const DatePicker = <Type extends DateSelectionType>({
  selectionType,
  picker,
  allowSingleDateInRange,
  value,
  defaultValue,
  onChange,
  presets,
  date,
  isOpen,
  defaultIsOpen,
  onOpenChange,
  ...props
}: CalendarProps<Type>): React.ReactElement => {
  const { theme } = useTheme();
  const ctx = useDatesContext();
  const isSingle = selectionType === 'single';

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

  return (
    <BaseBox width="100%">
      <DatePickerInput
        date={controlledValue}
        ref={referenceRef}
        inputRef={refs.setReference}
        referenceProps={getReferenceProps()}
      />
      {isMounted && (
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
                {!isSingle ? (
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
                  padding="spacing.6"
                  backgroundColor="surface.background.gray.intense"
                >
                  <Calendar
                    selectionType={selectionType}
                    defaultValue={defaultValue}
                    onMouseLeave={onRootMouseLeave}
                    __onDayMouseEnter={(_event, date) => {
                      onHoveredDateChange(date);
                    }}
                    __onDayClick={(_event, date) => {
                      onDateChange(date);
                    }}
                    getDayProps={(date) => ({
                      ...getControlProps(date),
                    })}
                    {...props}
                  />
                  <CalendarFooter onApply={handleApply} onCancel={handleCancel} />
                </BaseBox>
              </BaseBox>
            </BaseBox>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </BaseBox>
  );
};

export { DatePicker };
