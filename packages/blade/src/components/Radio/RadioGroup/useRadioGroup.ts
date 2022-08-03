/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import React from 'react';
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
>;

export type State = {
  value: string;
  setValue(value: string): void;
  removeValue(): void;
  isChecked(value: string): boolean;
};

const useRadioGroup = ({
  value,
  defaultValue,
  isDisabled,
  labelPosition,
  onChange,
  validationState,
  name,
}: UseRadioGroupProps) => {
  const { platform } = useTheme();
  const idBase = useId('radio-group');
  const labelId = `${idBase}-label`;
  const fallbackName = name || idBase;
  const [checkedValue, setValue] = useControllableState({
    value,
    defaultValue,
    onChange: (value: string) => onChange?.({ value, name: fallbackName }),
  });

  const state = React.useMemo<State>(() => {
    return {
      value: checkedValue,
      setValue(value: string) {
        if (isDisabled) {
          return;
        }

        setValue(value);
      },
      removeValue() {
        if (isDisabled) {
          return;
        }

        // @ts-expect-error TODO: fix this
        setValue(undefined);
      },
      isChecked(value: string) {
        return checkedValue === value;
      },
    };
  }, [checkedValue, isDisabled, setValue]);

  const contextValue = React.useMemo<RadioGroupContextType>(() => {
    return {
      validationState,
      isDisabled,
      labelPosition: platform === 'onMobile' ? 'top' : labelPosition,
      name: fallbackName,
      state,
    };
  }, [validationState, isDisabled, platform, labelPosition, state, fallbackName]);

  return { state, contextValue, ids: { labelId } };
};

export { useRadioGroup };
