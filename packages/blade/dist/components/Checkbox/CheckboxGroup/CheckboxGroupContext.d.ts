import { default as React } from 'react';
import { CheckboxGroupProps } from './CheckboxGroup';
import { State } from './useCheckboxGroup';
export type CheckboxGroupContextType = Pick<CheckboxGroupProps, 'validationState' | 'isDisabled' | 'isRequired' | 'labelPosition' | 'name' | 'necessityIndicator' | 'defaultValue' | 'value' | 'onChange' | 'size'> & {
    state?: State;
};
declare const CheckboxGroupProvider: React.Provider<CheckboxGroupContextType>;
declare const useCheckboxGroupContext: () => CheckboxGroupContextType;
export { useCheckboxGroupContext, CheckboxGroupProvider };
