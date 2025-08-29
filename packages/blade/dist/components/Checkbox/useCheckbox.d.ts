import { default as React } from 'react';
import { GestureResponderEvent } from 'react-native';
import { CheckboxProps } from './Checkbox';
type UseCheckboxProps = Pick<CheckboxProps, 'isChecked' | 'defaultChecked' | 'isDisabled' | 'isIndeterminate' | 'isRequired' | 'onChange' | 'name' | 'value'> & {
    role?: 'checkbox' | 'switch';
    hasError?: boolean;
    hasHelperText?: boolean;
};
declare const useCheckbox: ({ role, isChecked, defaultChecked, isIndeterminate, isDisabled, isRequired, hasError, hasHelperText, onChange, name, value, }: UseCheckboxProps) => {
    state: {
        isReactNative: boolean;
        isChecked: boolean;
        setChecked: import('../../utils/useControllable').ControllableStateSetter<boolean>;
    };
    inputProps: {
        onPress: (event: React.ChangeEvent<HTMLInputElement> | GestureResponderEvent) => void;
        name: string | undefined;
        value: string | undefined;
    };
    ids?: undefined;
} | {
    state: {
        isReactNative: boolean;
        isChecked: boolean;
        setChecked: import('../../utils/useControllable').ControllableStateSetter<boolean>;
    };
    ids: {
        inputId: string;
        errorTextId: string;
        helpTextId: string;
    };
    inputProps: {
        ref: React.RefObject<HTMLInputElement>;
        onChange: (event: React.ChangeEvent<HTMLInputElement> | GestureResponderEvent) => void;
        type: string;
        name: string | undefined;
        value: string | undefined;
        checked: boolean;
        disabled: boolean | undefined;
        required: boolean | undefined;
    };
};
export type InputProps = ReturnType<typeof useCheckbox>['inputProps'];
export { useCheckbox };
