/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import React from 'react';
import { useControllableState } from '../../../hooks/useControllable';
import { useId } from '../../../hooks/useId';
import { useTheme } from '../../BladeProvider';
import type { CheckboxGroupProps } from './CheckboxGroup';
import type { CheckboxGroupContextType } from './CheckboxGroupContext';

type UseCheckboxGroupProps = Pick<
  CheckboxGroupProps,
  | 'isDisabled'
  | 'labelPosition'
  | 'validationState'
  | 'neccessityIndicator'
  | 'name'
  | 'value'
  | 'defaultValue'
  | 'onChange'
>;

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
    onChange,
  });

  const state = React.useMemo(() => {
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

  const contextValue = React.useMemo((): CheckboxGroupContextType => {
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
