import { default as React } from 'react';
type CommonProps = {
    as: 'span' | 'label';
    position?: 'top' | 'left';
    necessityIndicator?: 'required' | 'optional' | 'none';
    accessibilityText?: string;
    children: string | undefined;
    id?: string;
    /**
     * Sets the size of the label
     * @default medium
     */
    size?: 'small' | 'medium' | 'large';
    labelSuffix?: React.ReactNode;
    labelTrailing?: React.ReactNode;
};
type LabelProps = CommonProps & {
    htmlFor: string;
    as: 'label';
};
type SpanProps = CommonProps & {
    as: 'span';
    htmlFor?: undefined;
};
type FormLabelProps = LabelProps | SpanProps;
export type FormInputLabelProps = {
    /**
     * Label to be shown for the input field
     */
    label?: string;
    /**
     * Desktop only prop. Default value on mobile will be `top`
     */
    labelPosition?: 'left' | 'top';
    /**
     * Displays `(optional)` when `optional` is passed or `*` when `required` is passed
     */
    necessityIndicator?: 'required' | 'optional' | 'none';
    /**
     * Suffix element to be shown for the input field
     *
     * @example
     * ```jsx
     * labelSuffix={
     *  <Tooltip content="This is a tooltip" placement="right">
     *    <TooltipInteractiveWrapper>
     *        <InfoIcon size="small" color="surface.icon.gray.subtle" />
     *    </TooltipInteractiveWrapper>
     *  </Tooltip>
     * }
     * ```
     */
    labelSuffix?: React.ReactNode;
    /**
     * Trailing element to be shown for the input field
     */
    labelTrailing?: React.ReactNode;
};
declare const FormLabel: ({ as, position, necessityIndicator, accessibilityText, children, id, htmlFor, size, labelSuffix, labelTrailing, }: FormLabelProps) => React.ReactElement;
export { FormLabel };
