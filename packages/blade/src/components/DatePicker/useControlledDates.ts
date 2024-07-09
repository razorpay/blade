/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable default-case */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useRef } from 'react';
import { useUncontrolled } from '@mantine/hooks';
import type { DatePickerType, DatePickerValue } from '@mantine/dates';
import { shiftTimezone } from './shiftTimezone';
import { throwBladeError } from '~utils/logger';

interface UseUncontrolledDates<Type extends DatePickerType = 'default'> {
  type: Type;
  value: DatePickerValue<Type> | undefined;
  defaultValue: DatePickerValue<Type> | undefined;
  onChange: ((value: DatePickerValue<Type>) => void) | undefined;
  applyTimezone?: boolean;
}

const getEmptyValue = <Type extends DatePickerType = 'default'>(type: Type) =>
  type === 'range' ? [null, null] : type === 'multiple' ? [] : null;

function useUncontrolledDates<Type extends DatePickerType = 'default'>({
  type,
  value,
  defaultValue,
  onChange,
}: UseUncontrolledDates<Type>) {
  const storedType = useRef<Type>(type);
  const [_value, _setValue, controlled] = useUncontrolled<any>({
    value: shiftTimezone('add', value),
    defaultValue: shiftTimezone('add', defaultValue),
    finalValue: getEmptyValue(type),
    onChange: (newDate) => {
      onChange?.(shiftTimezone('remove', newDate));
    },
  });

  let _finalValue = _value;

  if (storedType.current !== type) {
    // Type has changed. Do some checks or resets

    storedType.current = type;
    if (value === undefined) {
      // Reset uncontrolled value as types aren't compatible
      _finalValue = defaultValue !== undefined ? defaultValue : getEmptyValue(type);
      _setValue(_finalValue);
    } else if (__DEV__) {
      // Throw errors in dev mode in case type of value isn't correct
      switch (type) {
        case 'default':
          if (value !== null && typeof value !== 'string') {
            throwBladeError({
              message: 'Value must be type of `null` or `string`',
              moduleName: 'useControlledDates',
            });
          }
          break;
        case 'multiple':
          if (!(value instanceof Array)) {
            throwBladeError({
              message: 'Value must be type of `string[]`',
              moduleName: 'useControlledDates',
            });
          }
          break;
        case 'range':
          if (!(value instanceof Array) || value.length !== 2) {
            throwBladeError({
              message: 'Value must be type of `[string, string]`',
              moduleName: 'useControlledDates',
            });
          }
          break;
      }
    }
  }

  return [_finalValue, _setValue, controlled];
}

export { useUncontrolledDates };
