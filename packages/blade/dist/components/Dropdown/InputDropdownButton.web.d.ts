import { default as React } from 'react';
import { BaseButtonProps } from '../Button/BaseButton/BaseButton';
import { DataAnalyticsAttribute } from '../../utils/types';
import { IconComponent } from '../Icons';
type BaseInputDropDownButtonProps = {
    /**
     * isOpen is used to control the open state of the dropdown
     */
    isOpen?: boolean;
    /**
     * onBlur is the callback function that is called when the dropdown is blurred
     */
    onBlur?: BaseButtonProps['onBlur'];
    /**
     * onKeyDown is the callback function that is called when the dropdown is keyed down
     */
    onKeyDown?: BaseButtonProps['onKeyDown'];
    /**
     * onClick is the callback function that is called when the dropdown is clicked
     */
    onClick?: BaseButtonProps['onClick'];
    /**
     * accessibilityLabel is the label of the dropdown
     */
    accessibilityLabel?: string;
    /**
     * @private
     */
    _isInsideSearchInput?: boolean;
    /**
     * isDisabled is the disabled state of the dropdown
     */
    isDisabled?: boolean;
    /**
     * onChange is the callback function that is called when the dropdown is changed
     */
    onChange?: (props: {
        name: string;
        value: string;
    }) => void;
    /**
     * name is the name of the dropdown
     */
    name?: string;
    /**
     * testID is the testID of the dropdown
     */
    testID?: string;
    /**
     * icon is the icon of the dropdown
     */
    icon?: IconComponent;
} & DataAnalyticsAttribute;
type ControlledInputDropDownButtonProps = BaseInputDropDownButtonProps & {
    /**
     * value is the value of the dropdown
     */
    value: string;
    defaultValue?: never;
};
type UncontrolledInputDropDownButtonProps = BaseInputDropDownButtonProps & {
    value?: never;
    /**
     * defaultValue is the default selected value of the dropdown
     */
    defaultValue: string;
};
type InputDropDownButtonProps = ControlledInputDropDownButtonProps | UncontrolledInputDropDownButtonProps;
declare const InputDropdownButton: ({ onClick, onBlur, onKeyDown, accessibilityLabel, _isInsideSearchInput, isDisabled, onChange, name, testID, value, defaultValue, icon: Icon, ...rest }: InputDropDownButtonProps) => React.ReactElement | null;
export { InputDropdownButton };
