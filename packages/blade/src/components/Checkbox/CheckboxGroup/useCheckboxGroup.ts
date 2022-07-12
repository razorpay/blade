/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import React from 'react';
import { useControllableState } from '../../../hooks/useControllable';
import { useId } from '../../../hooks/useId';
import { useTheme } from '../../BladeProvider';
import type { CheckboxGroupProps } from './CheckboxGroup';

type UseCheckboxGroupProps = Pick<
  CheckboxGroupProps,
  'isDisabled' | 'labelPosition' | 'hasError' | 'showOptionalLabel' | 'name'
> & {
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
};

const useCheckboxGroup = ({
  value,
  defaultValue,
  isDisabled,
  labelPosition,
  onChange,
  showOptionalLabel,
  hasError,
  name,
}: UseCheckboxGroupProps) => {
  const { platform } = useTheme();
  const uuid = useId('checkbox-group');
  const labelId = `${uuid}-label`;
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

  const contextValue = React.useMemo(() => {
    return {
      hasError,
      showOptionalLabel,
      isDisabled,
      labelPosition: platform === 'onMobile' ? 'top' : labelPosition,
      name,
      state,
    };
  }, [hasError, showOptionalLabel, isDisabled, platform, labelPosition, name, state]);

  return { state, contextValue, labelId };
};

export { useCheckboxGroup };
