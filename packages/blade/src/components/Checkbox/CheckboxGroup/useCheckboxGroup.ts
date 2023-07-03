/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import React from 'react';
import type { CheckboxGroupProps } from './CheckboxGroup';
import type { CheckboxGroupContextType } from './CheckboxGroupContext';
import { useControllableState } from '~utils/useControllable';
import { useTheme } from '~components/BladeProvider';
import { useFormId } from '~components/Form/useFormId';

type UseCheckboxGroupProps = Pick<
  CheckboxGroupProps,
  | 'isDisabled'
  | 'isRequired'
  | 'labelPosition'
  | 'validationState'
  | 'name'
  | 'value'
  | 'defaultValue'
  | 'onChange'
  | 'size'
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
  isRequired,
  labelPosition,
  onChange,
  validationState,
  name,
  size,
}: UseCheckboxGroupProps) => {
  const { platform } = useTheme();
  const { labelId } = useFormId('checkbox-group');
  const [checkedValues, setValue] = useControllableState({
    value,
    defaultValue: defaultValue || [],
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    onChange: (values: string[]) => onChange?.({ values, name: name! }),
  });

  const state = React.useMemo<State>(() => {
    return {
      value: checkedValues,
      setValue(value: string[]) {
        if (isDisabled) {
          return;
        }

        setValue(() => value);
      },
      isChecked(value: string) {
        return checkedValues.includes(value);
      },
      addValue(value: string) {
        if (isDisabled) {
          return;
        }
        if (!checkedValues.includes(value)) {
          setValue(() => checkedValues.concat(value));
        }
      },
      removeValue(value: string) {
        if (isDisabled) {
          return;
        }
        if (checkedValues.includes(value)) {
          setValue(() => checkedValues.filter((existingValue) => existingValue !== value));
        }
      },
    };
  }, [checkedValues, isDisabled, setValue]);

  const contextValue = React.useMemo<CheckboxGroupContextType>(() => {
    return {
      validationState,
      isDisabled,
      isRequired,
      labelPosition: platform === 'onMobile' ? 'top' : labelPosition,
      name,
      state,
      size,
    };
  }, [validationState, isDisabled, isRequired, platform, labelPosition, name, state, size]);

  return { state, contextValue, ids: { labelId } };
};

export { useCheckboxGroup };
