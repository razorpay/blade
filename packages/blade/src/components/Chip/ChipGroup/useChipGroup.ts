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
  const [checkedValue, setValue] = useControllableState({
    value,
    defaultValue: defaultValue ?? (selectionType === 'multiple' ? [] : undefined),
    onChange: (v: string | string[]) => onChange?.({ value: v, name: fallbackName }),
  });

  const state = React.useMemo<State>(() => {
    return {
      value: checkedValue,
      setValue(value: string[]) {
        if (isDisabled) {
          return;
        }

        setValue(() => value);
      },
      isChecked(value: string): boolean {
        if (selectionType === 'single') {
          if (isUndefined(value) || isUndefined(checkedValue)) return false;
          return checkedValue === value;
        }
        return checkedValue.includes(value);
      },
      addValue(value: string) {
        if (isDisabled) {
          return;
        }
        if (selectionType === 'multiple' && !checkedValue.includes(value)) {
          setValue(() => checkedValue.concat(value));
        }
      },
      removeValue(value: string) {
        if (isDisabled) {
          return;
        }
        if (selectionType === 'single') {
          setValue(undefined!);
        }
        if (
          selectionType === 'multiple' &&
          Array.isArray(checkedValue) &&
          checkedValue.includes(value)
        ) {
          setValue(() => checkedValue.filter((existingValue) => existingValue !== value));
        }
      },
    };
  }, [checkedValue, isDisabled, setValue, selectionType]);

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
