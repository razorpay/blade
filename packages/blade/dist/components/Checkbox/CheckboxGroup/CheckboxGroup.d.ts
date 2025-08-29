import { default as React } from 'react';
import { StyledPropsBlade } from '../../Box/styledProps';
import { DataAnalyticsAttribute, TestID } from '../../../utils/types';
type CheckboxGroupProps = {
    /**
     * Accepts multiple checkboxes as children
     */
    children: React.ReactNode;
    /**
     * Help text of the checkbox group
     */
    helpText?: string;
    /**
     * Error text of the checkbox group
     * Renders when `validationState` is set to 'error'
     *
     * Overrides helpText
     */
    errorText?: string;
    /**
     * Sets the error state of the CheckboxGroup
     * If set to `error` it will render the `errorText` of the group,
     * and propagate `invalid` prop to every checkbox
     */
    validationState?: 'error' | 'none';
    /**
     * Renders a necessity indicator after CheckboxGroup label
     *
     * If set to `undefined` it renders nothing.
     */
    necessityIndicator?: 'required' | 'optional' | 'none';
    /**
     * Sets the disabled state of the CheckboxGroup
     * If set to `true` it propagate down to all the checkboxes
     *
     * @default false
     */
    isDisabled?: boolean;
    /**
     * Sets the required state of the CheckboxGroup
     * @default false
     */
    isRequired?: boolean;
    /**
     * Renders the label of the checkbox group
     */
    label?: string;
    /**
     * Sets the position of the label
     *
     * @default 'top'
     */
    labelPosition?: 'top' | 'left';
    /**
     * Initial value of the checkbox group
     */
    defaultValue?: string[];
    /**
     * value of the checkbox group
     *
     * Use `onChange` to update its value
     */
    value?: string[];
    /**
     * The callback invoked when any of the checkbox's state changes
     */
    onChange?: ({ name, values }: {
        name: string;
        values: string[];
    }) => void;
    /**
     * The name of the input field in a checkbox
     * (Useful for form submission).
     */
    name?: string;
    /**
     * Size of the checkbox
     *
     * @default "medium"
     */
    size?: 'small' | 'medium' | 'large';
    /**
     * Orientation of the checkbox group
     *
     * @default "vertical"
     */
    orientation?: 'vertical' | 'horizontal';
} & TestID & DataAnalyticsAttribute & StyledPropsBlade;
declare const CheckboxGroup: ({ children, label, helpText, isDisabled, isRequired, necessityIndicator, labelPosition, validationState, errorText, name, defaultValue, onChange, value, size, testID, orientation, flexWrap, ...rest }: CheckboxGroupProps) => React.ReactElement;
export type { CheckboxGroupProps };
export { CheckboxGroup };
