import { ReactElement, default as React } from 'react';
export type FormHintProps = {
    type: 'help' | 'error' | 'success';
    /**
     * Help text for the group
     */
    helpText?: string;
    /**
     * Error text for the group
     *
     * Renders when `state` is set to 'error'
     */
    errorText?: string;
    /**
     * Success text for the group
     *
     * Renders when `state` is set to 'success'
     */
    successText?: string;
    /**
     * Sets the id on errorText.
     * Needed for accessibility reasons.
     */
    errorTextId?: string;
    /**
     * Sets the id on helpText.
     * Needed for accessibility reasons.
     */
    helpTextId?: string;
    /**
     * Sets the id on successText.
     * Needed for accessibility reasons.
     */
    successTextId?: string;
    /**
     * Sets the size of the hint
     * @default medium
     */
    size?: 'small' | 'medium' | 'large';
};
declare const FormHint: ({ type, helpText, errorText, successText, helpTextId, errorTextId, successTextId, size, }: FormHintProps) => React.ReactElement;
export { FormHint };
