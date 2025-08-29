import { default as React } from 'react';
import { RadioGroupProps } from './RadioGroup';
import { State } from './useRadioGroup';
export type RadioGroupContextType = Pick<RadioGroupProps, 'validationState' | 'isDisabled' | 'isRequired' | 'labelPosition' | 'name' | 'defaultValue' | 'value' | 'onChange' | 'necessityIndicator' | 'size'> & {
    state?: State;
};
declare const RadioGroupProvider: React.Provider<RadioGroupContextType>;
declare const useRadioGroupContext: () => RadioGroupContextType;
export { useRadioGroupContext, RadioGroupProvider };
