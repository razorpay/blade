import { default as React } from 'react';
import { RadioGroupProps } from './RadioGroup';
import { RadioGroupContextType } from './RadioContext';
type UseRadioGroupProps = Pick<RadioGroupProps, 'isDisabled' | 'isRequired' | 'labelPosition' | 'validationState' | 'name' | 'value' | 'defaultValue' | 'onChange' | 'necessityIndicator' | 'size'>;
export type State = {
    value: string;
    setValue(value: string, event: React.ChangeEvent<Element>): void;
    removeValue(): void;
    isChecked(value: string): boolean;
};
type UseRadioGroupReturn = {
    state: State;
    contextValue: RadioGroupContextType;
    ids: {
        labelId: string;
    };
};
declare const useRadioGroup: ({ value, defaultValue, isDisabled, isRequired, labelPosition, onChange, validationState, necessityIndicator, name, size, }: UseRadioGroupProps) => UseRadioGroupReturn;
export { useRadioGroup };
