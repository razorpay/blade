import React from 'react';
import isUndefined from 'lodash/isUndefined';
import type { ChipGroupProps, ChipGroupContextType, State } from './types';
import { useControllableState } from '~utils/useControllable';
import { useId } from '~utils/useId';

type UseChipGroupProps = Pick<
  ChipGroupProps,
  | 'isDisabled'
  | 'name'
  | 'value'
  | 'defaultValue'
  | 'onChange'
  | 'size'
  | 'intent'
  | 'selectionType'
>;
type UseChipGroupReturn = {
  state: State;
  contextValue: ChipGroupContextType;
  ids: { labelId: string };
};

const useChipGroup = ({
  value,
  defaultValue,
  isDisabled,
  onChange,
  name,
  size,
  intent,
  selectionType,
}: UseChipGroupProps): UseChipGroupReturn => {
  const idBase = useId('chip-group');
  const labelId = `${idBase}-label`;

  const fallbackName = name ?? idBase;
  const [checkedValues, setValues] = useControllableState({
    value: (value && selectionType === 'single' ? [value] : value) as string[] | undefined,
    // If selectionType is single, we need to convert the value to an array
    defaultValue: (defaultValue && selectionType === 'single'
      ? [defaultValue]
      : defaultValue || []) as string[] | undefined,
    onChange: (values: string[]) => onChange?.({ values, name: fallbackName }),
  });

  const state = React.useMemo<State>(() => {
    return {
      value: checkedValues,
      isChecked(value: string): boolean {
        if (selectionType === 'single') {
          if (isUndefined(value) || isUndefined(checkedValues)) return false;
          return checkedValues[0] === value;
        }
        return checkedValues.includes(value);
      },
      addValue(value: string) {
        if (isDisabled) {
          return;
        }
        if (selectionType === 'single') {
          setValues(() => [value]);
        }
        if (selectionType === 'multiple' && !checkedValues.includes(value)) {
          setValues(() => checkedValues.concat(value));
        }
      },
      removeValue(value: string) {
        if (isDisabled) {
          return;
        }
        if (selectionType === 'single') {
          setValues(undefined!);
        }
        if (
          selectionType === 'multiple' &&
          Array.isArray(checkedValues) &&
          checkedValues.includes(value)
        ) {
          setValues(() => checkedValues.filter((existingValue) => existingValue !== value));
        }
      },
    };
  }, [checkedValues, isDisabled, setValues, selectionType]);

  const contextValue = React.useMemo<ChipGroupContextType>(() => {
    return {
      isDisabled,
      name,
      state,
      size,
      intent,
      selectionType,
    };
  }, [isDisabled, name, state, size, intent, selectionType]);

  return { state, contextValue, ids: { labelId } };
};

export { useChipGroup };
