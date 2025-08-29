import { default as React } from 'react';
import { GestureResponderEvent } from 'react-native';
export type OnChange = ({ isChecked, event, value, }: {
    isChecked: boolean;
    event: React.ChangeEvent;
    value?: string;
}) => void;
type UseRadioProps = {
    hasError?: boolean;
    /**
     * If `true`, The Radio will be checked. This also makes the Radio controlled
     * Use `onChange` to update its value
     *
     * @default false
     */
    isChecked?: boolean;
    /**
     * If `true`, the Radio will be initially checked. This also makes the Radio uncontrolled
     *
     * @default false
     */
    defaultChecked?: boolean;
    /**
     * The callback invoked when the checked state of the `Radio` changes.
     */
    onChange?: OnChange;
    /**
     * The name of the input field in a Radio
     * (Useful for form submission).
     */
    name?: string;
    /**
     * The value to be used in the Radio input.
     * This is the value that will be returned on form submission.
     */
    value?: string;
    /**
     * If `true`, the Radio will be disabled
     *
     * @default false
     */
    isDisabled?: boolean;
    /**
     * If `true`, the Radio input is marked as required,
     * and `required` attribute will be added
     *
     * @default false
     */
    isRequired?: boolean;
};
declare const useRadio: ({ isChecked, defaultChecked, isDisabled, isRequired, hasError, onChange, name, value, }: UseRadioProps) => {
    state: {
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
        isChecked: boolean;
        setChecked: import('../../utils/useControllable').ControllableStateSetter<boolean>;
    };
    ids: {
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
export type InputProps = ReturnType<typeof useRadio>['inputProps'];
export { useRadio };
