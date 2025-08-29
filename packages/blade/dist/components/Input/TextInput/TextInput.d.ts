import { default as React } from 'react';
import { BaseInputProps } from '../BaseInput';
import { TaggedInputProps } from '../BaseInput/useTaggedInput';
import { IconComponent } from '../../Icons';
import { StyledPropsBlade } from '../../Box/styledProps';
import { BladeElementRef, DataAnalyticsAttribute } from '../../../utils/types';
type Type = Exclude<BaseInputProps['type'], 'password'>;
type TextInputCommonProps = Pick<BaseInputProps, 'label' | 'accessibilityLabel' | 'labelPosition' | 'labelSuffix' | 'labelTrailing' | 'necessityIndicator' | 'validationState' | 'helpText' | 'errorText' | 'successText' | 'placeholder' | 'defaultValue' | 'name' | 'onChange' | 'onFocus' | 'onBlur' | 'value' | 'isDisabled' | 'isRequired' | 'prefix' | 'suffix' | 'maxCharacters' | 'autoFocus' | 'keyboardReturnKeyType' | 'autoCompleteSuggestionType' | 'onSubmit' | 'autoCapitalize' | 'testID' | 'onClick' | 'size' | 'leadingIcon' | 'trailingButton' | 'trailingIcon' | 'textAlign' | 'popupId' | 'isPopupExpanded' | 'hasPopup' | 'componentName' | 'onKeyDown' | keyof DataAnalyticsAttribute> & {
    /**
     * Decides whether to render a clear icon button
     */
    showClearButton?: boolean;
    /**
     * Event handler to handle the onClick event for clear button. Used when `showClearButton` is `true`
     */
    onClearButtonClick?: () => void;
    /**
     * Decides whether to show a loading spinner for the input field.
     */
    isLoading?: boolean;
    /**
     * Icon that will be rendered at the beginning of the input field
     * @deprecated Use `leading` instead. This prop will be removed in the next major version.
     */
    icon?: IconComponent;
    /**
     * Type of Input Field to be rendered. Use `PasswordInput` for type `password`
     *
     *
     * **Note on number type**
     *
     * `type="number"` internally uses `inputMode="numeric"` instead of HTML's `type="number"` which also allows text characters.
     * If you have a usecase where you only want to support number input, you can handle it on validations end.
     *
     * Check out [Why the GOV.UK Design System team changed the input type for numbers](https://technology.blog.gov.uk/2020/02/24/why-the-gov-uk-design-system-team-changed-the-input-type-for-numbers/) for reasoning
     *
     * @default text
     */
    type?: Type;
    /**
     *
     * Icon or React Element to be rendered at the end of the input field
     */
    trailing?: React.ReactElement | IconComponent;
    /**
     * Icon or React Element to be rendered at the beginning of the input field
     */
    leading?: React.ReactElement | IconComponent;
    /**
     * Format pattern where # represents input characters and other symbols act as delimiters
     * When provided, input will be automatically formatted and onChange will include rawValue
     *
     * **Note:**
     * 1. Format pattern should only contain # symbols and special characters as delimiters.
     *    Alphanumeric characters (letters and numbers) are not allowed in the format pattern.
     * 2. When format is provided, user input is restricted to alphanumeric characters only.
     *    Special characters and symbols will be filtered out automatically from user input.
     *
     * @example "#### #### #### ####" for card numbers
     * @example "##/##" for expiry dates
     * @example "(###) ###-####" for phone numbers
     */
    format?: '#### #### #### ####' | '##/##' | '##/##/####' | '(###) ###-####' | '###-##-####' | '##:##' | '##:##:##' | '#### #### ####' | '###.###.###.###' | '## ## ####' | '##-###-##' | (string & {});
} & TaggedInputProps & StyledPropsBlade;
type TextInputPropsWithA11yLabel = {
    /**
     * Label to be shown for the input field
     */
    label?: undefined;
    /**
     * Accessibility label for the input
     */
    accessibilityLabel: string;
};
type TextInputPropsWithLabel = {
    /**
     * Label to be shown for the input field
     */
    label: string;
    /**
     * Accessibility label for the input
     */
    accessibilityLabel?: string;
};
type TextInputProps = (TextInputPropsWithA11yLabel | TextInputPropsWithLabel) & TextInputCommonProps;
declare const TextInput: React.ForwardRefExoticComponent<TextInputProps & React.RefAttributes<BladeElementRef>>;
export type { TextInputProps };
export { TextInput };
