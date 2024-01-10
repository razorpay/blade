/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import type { CheckboxGroupProps } from './CheckboxGroup';
import type { State } from './useCheckboxGroup';

export type CheckboxGroupContextType = Pick<
  CheckboxGroupProps,
  | 'validationState'
  | 'isDisabled'
  | 'isRequired'
  | 'labelPosition'
  | 'name'
  | 'necessityIndicator'
  | 'defaultValue'
  | 'value'
  | 'onChange'
  | 'size'
> & { state?: State };

const CheckboxGroupContext = React.createContext<CheckboxGroupContextType>({});
const CheckboxGroupProvider = CheckboxGroupContext.Provider;

const useCheckboxGroupContext = (): CheckboxGroupContextType => {
  const context = React.useContext(CheckboxGroupContext);
  return context;
};

export { useCheckboxGroupContext, CheckboxGroupProvider };
