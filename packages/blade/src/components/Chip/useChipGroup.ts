import React from 'react';
import type { ChipGroupContextType, State } from './types';
import isUndefined from '~utils/lodashButBetter/isUndefined';
import { useControllableState } from '~utils/useControllable';
import { useId } from '~utils/useId';

type UseChipGroupProps = {
  isDisabled?: boolean;
  isRequired?: boolean;
  necessityIndicator?: 'required' | 'optional' | 'none';
  validationState?: 'error' | 'none';
  name?: string;
  value?: string | string[];
  defaultValue?: string | string[];
  onChange?: ({ name, values }: { name: string; values: string[] }) => void;
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  color?: 'primary' | 'positive' | 'negative';
  selectionType?: 'single' | 'multiple';
  isFullWidth?: boolean;
};
type UseChipGroupReturn = {
  state: State;
  contextValue: ChipGroupContextType;
  ids: { labelId: string };
};

const useChipGroup = ({
  value,
  defaultValue,
  isDisabled,
  isRequired,
  onChange,
  name,
  size,
  color,
  selectionType,
  necessityIndicator,
  validationState,
  isFullWidth,
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
          if (isFullWidth) return;
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
  }, [checkedValues, isDisabled, setValues, selectionType, isFullWidth]);

  const contextValue = React.useMemo<ChipGroupContextType>(() => {
    return {
      isDisabled,
      isRequired,
      necessityIndicator,
      validationState,
      name,
      state,
      size,
      color,
      selectionType,
      isFullWidth,
    };
  }, [
    isDisabled,
    isRequired,
    necessityIndicator,
    validationState,
    name,
    state,
    size,
    color,
    selectionType,
    isFullWidth,
  ]);

  return { state, contextValue, ids: { labelId } };
};

export { useChipGroup };
