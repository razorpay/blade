/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import type { CheckboxGroupProps } from './CheckboxGroup';
import type { useCheckboxGroup } from './useCheckboxGroup';

type CheckboxGroupContextType = Pick<
  CheckboxGroupProps,
  | 'validationState'
  | 'isDisabled'
  | 'neccessityIndicator'
  | 'labelPosition'
  | 'name'
  | 'defaultValue'
  | 'value'
  | 'onChange'
> & { state?: ReturnType<typeof useCheckboxGroup>['state'] };

const CheckboxGroupContext = React.createContext<CheckboxGroupContextType>({});
const CheckboxGroupProvider = CheckboxGroupContext.Provider;

const useCheckboxGroupContext = () => {
  const context = React.useContext(CheckboxGroupContext);
  if (!context) {
    throw new Error(
      '[Blade useCheckboxGroupContext]: Seems like you forgot to wrap the component with `CheckboxGroupProvider`',
    );
  }

  return context;
};

export { useCheckboxGroupContext, CheckboxGroupProvider };
