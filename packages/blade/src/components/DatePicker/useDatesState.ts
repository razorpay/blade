/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { DatePickerType, PickerBaseProps } from '@mantine/dates';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useUncontrolledDates } from './useControlledDates';

interface UseDatesRangeInput<Type extends DatePickerType = 'default'>
  extends PickerBaseProps<Type> {
  level: 'year' | 'month' | 'day';
  type: Type;
  onMouseLeave?: (event: React.MouseEvent<HTMLDivElement>) => void;
  applyTimezone?: boolean;
}

function isInRange(date: Date, range: [Date, Date]) {
  const _range = [...range].sort((a, b) => a.getTime() - b.getTime());
  return (
    dayjs(_range[0]).startOf('day').subtract(1, 'ms').isBefore(date) &&
    dayjs(_range[1]).endOf('day').add(1, 'ms').isAfter(date)
  );
}

export function useDatesState<Type extends DatePickerType = 'default'>({
  type,
  level,
  value,
  defaultValue,
  onChange,
  allowSingleDateInRange,
  allowDeselect,
  onMouseLeave,
  applyTimezone = true,
}: UseDatesRangeInput<Type>) {
  const [_value, setValue] = useUncontrolledDates({
    type,
    value,
    defaultValue,
    onChange,
    applyTimezone,
  });

  const [pickedDate, setPickedDate] = useState<Date | null>(
    type === 'range' ? (_value[0] && !_value[1] ? _value[0] : null) : null,
  );
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  const onDateChange = (date: Date) => {
    if (type === 'range') {
      if (pickedDate instanceof Date && !_value[1]) {
        if (dayjs(date).isSame(pickedDate, level) && !allowSingleDateInRange) {
          setPickedDate(null);
          setHoveredDate(null);
          setValue([null, null]);
          return;
        }

        const result: [Date, Date] = [date, pickedDate];
        result.sort((a, b) => a.getTime() - b.getTime());
        setValue(result);
        setHoveredDate(null);
        setPickedDate(null);
        return;
      }

      if (
        _value[0] &&
        !_value[1] &&
        dayjs(date).isSame(_value[0], level) &&
        !allowSingleDateInRange
      ) {
        setPickedDate(null);
        setHoveredDate(null);
        setValue([null, null]);
        return;
      }

      setValue([date, null]);
      setHoveredDate(null);
      setPickedDate(date);
      return;
    }

    if (_value && allowDeselect && dayjs(date).isSame(_value, level)) {
      setValue(null);
    } else {
      setValue(date);
    }
  };

  const isDateInRange = (date: Date) => {
    if (pickedDate instanceof Date && hoveredDate instanceof Date) {
      return isInRange(date, [hoveredDate, pickedDate]);
    }

    if (_value[0] instanceof Date && _value[1] instanceof Date) {
      return isInRange(date, _value);
    }

    return false;
  };

  const onRootMouseLeave =
    type === 'range'
      ? (event: React.MouseEvent<HTMLDivElement>) => {
          onMouseLeave?.(event);
          setHoveredDate(null);
        }
      : onMouseLeave;

  const isFirstInRange = (date: Date) => {
    if (!(_value[0] instanceof Date)) {
      return false;
    }

    if (dayjs(date).isSame(_value[0], level)) {
      return !(hoveredDate && dayjs(hoveredDate).isBefore(_value[0]));
    }

    return false;
  };

  const isLastInRange = (date: Date) => {
    if (_value[1] instanceof Date) {
      return dayjs(date).isSame(_value[1], level);
    }

    if (!(_value[0] instanceof Date) || !hoveredDate) {
      return false;
    }

    return dayjs(hoveredDate).isBefore(_value[0]) && dayjs(date).isSame(_value[0], level);
  };

  const getControlProps = (date: Date) => {
    if (type === 'range') {
      return {
        selected: _value.some(
          (selection: Date) => selection && dayjs(selection).isSame(date, level),
        ),
        inRange: isDateInRange(date),
        firstInRange: isFirstInRange(date),
        lastInRange: isLastInRange(date),
        'data-autofocus': (!!_value[0] && dayjs(_value[0]).isSame(date, level)) || undefined,
        'data-celltype': level,
        'data-date': `${date.getMonth()}-${date.getDate()}`,
      };
    }

    const selected = dayjs(_value).isSame(date, level);
    return {
      selected,
      'data-autofocus': selected || undefined,
      'data-celltype': level,
      'data-date': `${date.getMonth()}-${date.getDate()}`,
    };
  };

  const onHoveredDateChange = type === 'range' && pickedDate ? setHoveredDate : () => {};

  useEffect(() => {
    if (type === 'range' && !_value[0] && !_value[1]) {
      setPickedDate(null);
    }
  }, [value]);

  return {
    onDateChange,
    onRootMouseLeave,
    onHoveredDateChange,
    getControlProps,
    setPickedDate,
    pickedDate,
    controlledValue: _value,
    setControlledValue: setValue,
  } as const;
}
