/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import React from 'react';
import type { CheckboxGroupProps } from './CheckboxGroup';
import type { CheckboxGroupContextType } from './CheckboxGroupContext';
import { useControllableState } from '~src/hooks/useControllable';
import { useTheme } from '~components/BladeProvider';
import { useId } from '~src/hooks/useId';

type UseCheckboxGroupProps = Pick<
  CheckboxGroupProps,
  | 'isDisabled'
  | 'labelPosition'
  | 'validationState'
  | 'name'
  | 'value'
  | 'defaultValue'
  | 'onChange'
>;

export type State = {
  value: string[];
  setValue(value: string[]): void;
  isChecked(value: string): boolean;
  addValue(value: string): void;
  removeValue(value: string): void;
};

const useCheckboxGroup = ({
  value,
  defaultValue,
  isDisabled,
  labelPosition,
  onChange,
  validationState,
  name,
}: UseCheckboxGroupProps) => {
  const { platform } = useTheme();
  const idBase = useId('checkbox-group');
  const labelId = `${idBase}-label`;
  const [checkedValues, setValue] = useControllableState({
    value,
    defaultValue: defaultValue || [],
    onChange: (values: string[]) => onChange?.({ values, name: name! }),
  });

  const state = React.useMemo<State>(() => {
    return {
      value: checkedValues,
      setValue(value: string[]) {
        if (isDisabled) {
          return;
        }

        setValue(value);
      },
      isChecked(value: string) {
        return checkedValues.includes(value);
      },
      addValue(value: string) {
        if (isDisabled) {
          return;
        }
        if (!checkedValues.includes(value)) {
          setValue(checkedValues.concat(value));
        }
      },
      removeValue(value: string) {
        if (isDisabled) {
          return;
        }
        if (checkedValues.includes(value)) {
          setValue(checkedValues.filter((existingValue) => existingValue !== value));
        }
      },
    };
  }, [checkedValues, isDisabled, setValue]);

  const contextValue = React.useMemo<CheckboxGroupContextType>(() => {
    return {
      validationState,
      isDisabled,
      labelPosition: platform === 'onMobile' ? 'top' : labelPosition,
      name,
      state,
    };
  }, [validationState, isDisabled, platform, labelPosition, name, state]);

  return { state, contextValue, ids: { labelId } };
};

export { useCheckboxGroup };
