import React from 'react';
import isUndefined from 'lodash/isUndefined';
import type { RadioGroupProps } from './RadioGroup';
import type { RadioGroupContextType } from './RadioContext';
import { useControllableState } from '~src/hooks/useControllable';
import { useTheme } from '~components/BladeProvider';
import { useId } from '~src/hooks/useId';

type UseRadioGroupProps = Pick<
  RadioGroupProps,
  | 'isDisabled'
  | 'labelPosition'
  | 'validationState'
  | 'name'
  | 'value'
  | 'defaultValue'
  | 'onChange'
  | 'neccessityIndicator'
>;

export type State = {
  value: string;
  setValue(value: string): void;
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
  labelPosition,
  onChange,
  validationState,
  neccessityIndicator,
  name,
}: UseRadioGroupProps): UseRadioGroupReturn => {
  const { platform } = useTheme();
  const idBase = useId('radio-group');
  const labelId = `${idBase}-label`;
  const fallbackName = name ?? idBase;
  const [checkedValue, setValue] = useControllableState({
    value,
    defaultValue,
    onChange: (v: string) => onChange?.({ value: v, name: fallbackName }),
  });

  // FIX React native bug, where it unchecks the radio on clicking it again
  const state = React.useMemo<State>(() => {
    return {
      value: checkedValue,
      setValue(v: string): void {
        if (isDisabled) {
          return;
        }

        setValue(() => v);
      },
      removeValue(): void {
        if (isDisabled) {
          return;
        }

        // @ts-expect-error TODO: fix this
        setValue(undefined);
      },
      isChecked(v: string): boolean {
        if (isUndefined(v) || isUndefined(checkedValue)) return false;
        return checkedValue === v;
      },
    };
  }, [checkedValue, isDisabled, setValue]);

  const contextValue = React.useMemo<RadioGroupContextType>(() => {
    return {
      neccessityIndicator,
      validationState,
      isDisabled,
      labelPosition: platform === 'onMobile' ? 'top' : labelPosition,
      name: fallbackName,
      state,
    };
  }, [
    validationState,
    isDisabled,
    platform,
    labelPosition,
    state,
    fallbackName,
    neccessityIndicator,
  ]);

  return { state, contextValue, ids: { labelId } };
};

export { useRadioGroup };
