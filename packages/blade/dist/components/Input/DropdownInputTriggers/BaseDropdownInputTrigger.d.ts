import { default as React } from 'react';
import { BaseInputProps } from '../BaseInput';
import { BladeElementRef } from '../../../utils/types';
declare const BaseDropdownInputTrigger: React.ForwardRefExoticComponent<Omit<({
    label?: undefined;
    accessibilityLabel: string;
} | {
    label: string;
    accessibilityLabel?: string | undefined;
}) & Pick<BaseInputProps, `data-analytics-${string}` | "name" | "label" | "testID" | "prefix" | "size" | "onBlur" | "onFocus" | "autoFocus" | "placeholder" | "onClick" | "isDisabled" | "accessibilityLabel" | "suffix" | "validationState" | "errorText" | "successText" | "necessityIndicator" | "helpText" | "isRequired"> & {
    icon?: import('../..').IconComponent | undefined;
    value?: string | string[] | undefined;
    defaultValue?: string | string[] | undefined;
    onChange?: (({ name, values }: {
        name?: string | undefined;
        values: string[];
    }) => void) | undefined;
    syncInputValueWithSelection?: ((value: string) => void) | undefined;
    maxRows?: "multiple" | "single" | "expandable" | undefined;
    labelPosition?: "left" | "top" | "inside-input" | undefined;
}, "onClick" | "onKeydown"> & {
    onTriggerKeydown: import('../../Form/FormTypes').FormInputHandleOnKeyDownEvent | undefined;
    onInputValueChange?: import('../../Form').FormInputOnEvent | undefined;
    inputValue?: string | undefined;
    isSelectInput: boolean;
    onTriggerClick: import('../../Form').FormInputOnEvent | undefined;
} & React.RefAttributes<BladeElementRef>>;
export { BaseDropdownInputTrigger };
