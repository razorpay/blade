import { default as React } from 'react';
import { StyledPropsBlade } from '../../Box/styledProps';
import { DataAnalyticsAttribute, TestID } from '../../../utils/types';
type RadioGroupProps = {
    /**
     * Accepts multiple radios as children
     */
    children: React.ReactNode;
    /**
     * Help text of the radio group
     */
    helpText?: string;
    /**
     * Error text of the radio group
     * Renders when `validationState` is set to 'error'
     *
     * Overrides helpText
     */
    errorText?: string;
    /**
     * Sets the error state of the radioGroup
     * If set to `error` it will render the `errorText` of the group,
     * and propagate `invalid` prop to every radio
     */
    validationState?: 'error' | 'none';
    /**
     * Renders a necessity indicator after radioGroup label
     *
     * If set to `undefined` it renders nothing.
     */
    necessityIndicator?: 'required' | 'optional' | 'none';
    /**
     * Sets the disabled state of the radioGroup
     * If set to `true` it propagate down to all the radios
     *
     * @default false
     */
    isDisabled?: boolean;
    /**
     * Sets the required state of the radioGroup
     * @default false
     */
    isRequired?: boolean;
    /**
     * Renders the label of the radio group
     */
    label?: string;
    /**
     * Sets the position of the label
     *
     * @default 'top'
     */
    labelPosition?: 'top' | 'left';
    /**
     * Initial value of the radio group
     */
    defaultValue?: string;
    /**
     * value of the radio group
     *
     * Use `onChange` to update its value
     */
    value?: string;
    /**
     * The callback invoked when any of the radio's state changes
     */
    onChange?: ({ name, value, event, }: {
        name: string | undefined;
        value: string;
        event: React.ChangeEvent<HTMLInputElement>;
    }) => void;
    /**
     * The name of the input field in a radio
     * (Useful for form submission).
     */
    name?: string;
    /**
     * Size of the radios
     *
     * @default "medium"
     */
    size?: 'small' | 'medium' | 'large';
    /**
     * Orientation of the radio group
     *
     * @default 'vertical'
     */
    orientation?: 'vertical' | 'horizontal';
} & TestID & DataAnalyticsAttribute & StyledPropsBlade;
declare const RadioGroup: ({ children, label, helpText, isDisabled, isRequired, necessityIndicator, labelPosition, validationState, errorText, name, defaultValue, onChange, value, size, orientation, testID, flexWrap, ...rest }: RadioGroupProps) => React.ReactElement;
export type { RadioGroupProps };
export { RadioGroup };
