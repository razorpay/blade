import { CheckboxGroupProps } from './CheckboxGroup';
import { CheckboxGroupContextType } from './CheckboxGroupContext';
type UseCheckboxGroupProps = Pick<CheckboxGroupProps, 'isDisabled' | 'isRequired' | 'labelPosition' | 'validationState' | 'name' | 'necessityIndicator' | 'value' | 'defaultValue' | 'onChange' | 'size'>;
export type State = {
    value: string[];
    setValue(value: string[]): void;
    isChecked(value: string): boolean;
    addValue(value: string): void;
    removeValue(value: string): void;
};
declare const useCheckboxGroup: ({ value, defaultValue, isDisabled, isRequired, labelPosition, onChange, validationState, name, necessityIndicator, size, }: UseCheckboxGroupProps) => {
    state: State;
    contextValue: CheckboxGroupContextType;
    ids: {
        labelId: string;
    };
};
export { useCheckboxGroup };
