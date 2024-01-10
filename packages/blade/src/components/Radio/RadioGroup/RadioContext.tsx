/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import type { RadioGroupProps } from './RadioGroup';
import type { State } from './useRadioGroup';

export type RadioGroupContextType = Pick<
  RadioGroupProps,
  | 'validationState'
  | 'isDisabled'
  | 'isRequired'
  | 'labelPosition'
  | 'name'
  | 'defaultValue'
  | 'value'
  | 'onChange'
  | 'necessityIndicator'
  | 'size'
> & { state?: State };

const RadioGroupContext = React.createContext<RadioGroupContextType>({});
const RadioGroupProvider = RadioGroupContext.Provider;

const useRadioGroupContext = (): RadioGroupContextType => {
  const context = React.useContext(RadioGroupContext);
  return context;
};

export { useRadioGroupContext, RadioGroupProvider };
