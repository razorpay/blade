import React from 'react';
import type { RadioGroupProps } from './RadioGroup';
import type { RadioGroupContextType } from './RadioContext';
import isUndefined from '~utils/lodashButBetter/isUndefined';
import { useControllableState } from '~utils/useControllable';
import { useTheme } from '~components/BladeProvider';
import { useId } from '~utils/useId';

type UseRadioGroupProps = Pick<
  RadioGroupProps,
  | 'isDisabled'
  | 'isRequired'
  | 'labelPosition'
  | 'validationState'
  | 'name'
  | 'value'
  | 'defaultValue'
  | 'onChange'
  | 'necessityIndicator'
  | 'size'
>;

export type State = {
  value: string;
  setValue(value: string, event: React.ChangeEvent<Element>): void;
  removeValue(): void;
  isChecked(value: string): boolean;
};

type UseRadioGroupReturn = {
  state: State;
  contextValue: RadioGroupContextType;
  ids: { labelId: string };
};

const useRadioGroup = ({
  value,
  defaultValue,
  isDisabled,
  isRequired,
  labelPosition,
  onChange,
  validationState,
  necessityIndicator,
  name,
  size,
}: UseRadioGroupProps): UseRadioGroupReturn => {
  const { platform } = useTheme();
  const idBase = useId('radio-group');
  const labelId = `${idBase}-label`;
  const fallbackName = name ?? idBase;
  const [checkedValue, setValue] = useControllableState({
    value,
    defaultValue,
    onChange: (v, event) => {
      onChange?.({ value: v, name: fallbackName, event });
    },
  });

  const state = React.useMemo<State>(() => {
    return {
      value: checkedValue,
      setValue(v, event): void {
        if (isDisabled) {
          return;
        }

        setValue(() => v, false, event);
      },
      removeValue(): void {
        if (isDisabled) {
          return;
        }

        setValue(undefined!);
      },
      isChecked(v: string): boolean {
        if (isUndefined(v) || isUndefined(checkedValue)) return false;
        return checkedValue === v;
      },
    };
  }, [checkedValue, isDisabled, setValue]);

  const contextValue = React.useMemo<RadioGroupContextType>(() => {
    return {
      necessityIndicator,
      validationState,
      isDisabled,
      isRequired,
      labelPosition: platform === 'onMobile' ? 'top' : labelPosition,
      name: fallbackName,
      state,
      size,
    };
  }, [
    validationState,
    isDisabled,
    isRequired,
    platform,
    labelPosition,
    state,
    fallbackName,
    necessityIndicator,
    size,
  ]);

  return { state, contextValue, ids: { labelId } };
};

export { useRadioGroup };
