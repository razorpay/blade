/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DatesRangeValue } from '@mantine/dates';
import { shiftTimezone, useDatesContext } from '@mantine/dates';
import React from 'react';
import { Calendar } from './Calendar';
import { PresetSideBar } from './PresetSideBar';
import type { CalendarProps, DateSelectionType } from './types';
import { useDatesState } from './useDatesState';
import BaseBox from '~components/Box/BaseBox';
import { Button } from '~components/Button';
import { Divider } from '~components/Divider';

type DatePickerFooterProps = {
  onApply: () => void;
  onCancel: () => void;
};
const DatePickerFooter = ({ onApply, onCancel }: DatePickerFooterProps): React.ReactElement => {
  return (
    <BaseBox display="flex" flexDirection="column" gap="spacing.4">
      <Divider />
      <BaseBox marginLeft="auto" display="flex" flexDirection="row" gap="spacing.4">
        <Button variant="tertiary" size="small" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" size="small" onClick={onApply}>
          Apply
        </Button>
      </BaseBox>
    </BaseBox>
  );
};

const DatePicker = <Type extends DateSelectionType>({
  selectionType,
  picker,
  allowSingleDateInRange,
  value,
  defaultValue,
  onChange,
  presets,
  date,
  ...props
}: CalendarProps<Type>): React.ReactElement => {
  const isSingle = selectionType === 'single';
  const [selectedPreset, setSelectedPreset] = React.useState<DatesRangeValue | null>(null);
  const {
    onDateChange,
    onRootMouseLeave,
    onHoveredDateChange,
    getControlProps,
    setValue,
  } = useDatesState({
    level: 'day',
    type: isSingle ? 'default' : 'range',
    allowDeselect: false,
    allowSingleDateInRange,
    value,
    defaultValue,
    onChange: (date) => {
      onChange?.(date as any);
      if (isSingle) return;
      setSelectedPreset(date as DatesRangeValue);
    },
  });

  const ctx = useDatesContext();
  const today = shiftTimezone('add', new Date(), ctx.getTimezone());
  const currentDate = date ?? today;

  const handleApply = (): void => {
    console.log('apply');
  };

  const handleCancel = (): void => {
    console.log('cancel');
  };

  return (
    <BaseBox display="flex" flexDirection="row">
      {!isSingle ? (
        <PresetSideBar
          presets={presets}
          date={currentDate}
          selectedPreset={selectedPreset}
          onSelection={(preset) => {
            const presetValue = preset?.(currentDate);
            setValue(presetValue);
            setSelectedPreset(presetValue);
          }}
        />
      ) : null}
      <BaseBox
        display="flex"
        flexDirection="column"
        gap="spacing.6"
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
        <DatePickerFooter onApply={handleApply} onCancel={handleCancel} />
      </BaseBox>
    </BaseBox>
  );
};

export { DatePicker };
