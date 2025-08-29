import { default as React } from 'react';
import { BladeElementRef } from '../../../utils/types';
/**
 * ### SelectInput
 *
 * Our equivalent of `<select>` tag. Lets you select items from given options.
 *
 * To be used in combination of `Dropdown` and `ActionList` component
 *
 * ---
 *
 * #### Usage
 *
 * ```diff
 * <Dropdown>
 * + <SelectInput label="Select Fruits" />
 *   <DropdownOverlay>
 *     <ActionList>
 *       <ActionListItem title="Mango" value="mango" />
 *       <ActionListItem title="Apple" value="apple" />
 *     </ActionList>
 *   </DropdownOverlay>
 * </Dropdown>
 * ```
 *
 * ---
 *
 * Checkout {@link https://blade.razorpay.com/?path=/docs/components-dropdown-with-select--with-single-select SelectInput Documentation}.
 */
declare const SelectInput: React.ForwardRefExoticComponent<(({
    label?: undefined;
    accessibilityLabel: string;
} | {
    label: string;
    accessibilityLabel?: string | undefined;
}) & Pick<import('../BaseInput').BaseInputProps, `data-analytics-${string}` | "name" | "label" | "testID" | "prefix" | "size" | "onBlur" | "onFocus" | "autoFocus" | "placeholder" | "onClick" | "isDisabled" | "accessibilityLabel" | "suffix" | "validationState" | "errorText" | "successText" | "necessityIndicator" | "helpText" | "isRequired"> & {
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
}) & React.RefAttributes<BladeElementRef>>;
export { SelectInput };
