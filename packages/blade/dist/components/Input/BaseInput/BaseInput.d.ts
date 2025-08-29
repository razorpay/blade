import { default as React, ReactNode } from 'react';
import { FormInputLabelProps, FormInputValidationProps, FormInputOnEvent, FormHintProps } from '../../Form';
import { IconComponent } from '../../Icons';
import { StyledPropsBlade } from '../../Box/styledProps';
import { Platform } from '../../../utils';
import { FormInputHandleOnKeyDownEvent } from '../../Form/FormTypes';
import { BladeElementRef, ContainerElementType, DataAnalyticsAttribute, TestID } from '../../../utils/types';
import { AriaAttributes } from '../../../utils/makeAccessible';
import { LinkProps } from '../../Link';
import { MotionMetaProp } from '../../BaseMotion';
type CommonAutoCompleteSuggestionTypes = 'none' | 'name' | 'email' | 'username' | 'password' | 'newPassword' | 'oneTimeCode' | 'telephone' | 'postalCode' | 'countryName' | 'creditCardNumber' | 'creditCardCSC' | 'creditCardExpiry' | 'creditCardExpiryMonth' | 'creditCardExpiryYear';
type WebAutoCompleteSuggestionType = CommonAutoCompleteSuggestionTypes | 'on';
type BaseInputCommonProps = FormInputLabelProps & DataAnalyticsAttribute & FormInputValidationProps & {
    /**
     * Determines if it needs to be rendered as input, textarea or button
     */
    as?: 'input' | 'textarea' | 'button';
    /**
     * ID that will be used for accessibility
     */
    id: string;
    /**
     * Placeholder text to be displayed inside the input field
     */
    placeholder?: string;
    /**
     * Type of Input Field to be rendered.
     *
     * @default text
     */
    type?: 'text' | 'telephone' | 'email' | 'url' | 'number' | 'search' | 'password';
    /**
     * Used to set the default value of input field when it's uncontrolled
     */
    defaultValue?: string;
    /**
     * The name of the input field.
     *
     * Useful in form submissions
     */
    name?: string;
    /**
     * The callback function to be invoked when the input field gets focus
     */
    onFocus?: FormInputOnEvent;
    /**
     * The callback function to be invoked when the value of the input field changes
     */
    onChange?: FormInputOnEvent;
    /**
     * The callback function to be invoked when input is clicked
     */
    onClick?: FormInputOnEvent;
    /**
     * The callback function to be invoked when the value of the input field has any input
     */
    onInput?: FormInputOnEvent;
    /**
     * The callback function to be invoked whenever there is a keyDown event
     */
    onKeyDown?: FormInputHandleOnKeyDownEvent;
    /**
     * The callback function to be invoked when the the input field loses focus
     *
     * For React Native this will call `onEndEditing` event since we want to get the last value of the input field
     */
    onBlur?: FormInputOnEvent;
    /**
     * Ignores the blur event animation (Used in Select to ignore blur animation when item in option is clicked)
     */
    shouldIgnoreBlurAnimation?: boolean;
    /**
     * sets boolean that ignores the blur animations on baseinput
     */
    setShouldIgnoreBlurAnimation?: (shouldIgnoreBlurAnimation: boolean) => void;
    /**
     * Used to turn the input field to controlled so user can control the value
     */
    value?: string;
    /**
     * Used to disable the input field
     */
    isDisabled?: boolean;
    /**
     * If true, the input is marked as required, and `required` attribute will be added
     */
    isRequired?: boolean;
    /**
     * Icon to be shown at the start of the input field
     */
    leadingIcon?: IconComponent;
    /**
     * Prefix symbol to be displayed at the beginning of the input field. If leadingIcon is provided it'll be placed after it
     */
    prefix?: string;
    /**
     * Element to be rendered before suffix. This is decided by the component which is extending BaseInput
     *
     * eg: consumers can render a loader or they could render a clear button
     */
    trailingInteractionElement?: ReactNode;
    /**
     * Callback to be invoked when the TrailingInteractionElement is clicked
     */
    onTrailingInteractionElementClick?: () => void;
    /**
     * Element to be rendered before prefix. This is decided by the component which is extending BaseInput
     *
     * eg: consumers can render a country selector or button
     */
    leadingInteractionElement?: ReactNode;
    /**
     * Leading DropDown to be rendered at Prefix slot
     */
    leadingDropDown?: ReactNode;
    /**
     * Trailing DropDown to be rendered at Suffix slot
     */
    trailingDropDown?: ReactNode;
    /**
     * Suffix symbol to be displayed at the end of the input field. If trailingIcon is provided it'll be placed before it
     */
    suffix?: string;
    /**
     * Icon to be displayed at the end of the input field
     */
    trailingIcon?: IconComponent;
    /**
     * Displays the character counter under the input field
     */
    maxCharacters?: number;
    /**
     * alignment of the text inside input field
     */
    textAlign?: 'left' | 'center' | 'right';
    /**
     * If true, focuses the input field on load
     *
     * **Note:**
     * Automatically focusing a form control can confuse visually-impaired people using screen-reading technology and people with cognitive impairments.
     * When autofocus is assigned, screen-readers "teleport" their user to the form control without warning them beforehand.
     */
    autoFocus?: boolean;
    /**
     * Hints the platform to display an appropriate virtual keyboard
     *
     * **Native:** Passes as is the `keyboardType` attribute
     *
     * **Web:** Passes the value to the `inputMode` attribute
     */
    keyboardType?: 'text' | 'search' | 'telephone' | 'email' | 'url' | 'decimal';
    /**
     * determines what return key to show on the keyboard of mobile devices/virtual keyboard
     * **Note**: Few values are platform dependent and might not render on all the platforms
     *
     * `default` is only available on native. it'll be mapped to `enter` for web
     * `previous` is only available on native android
     */
    keyboardReturnKeyType?: 'default' | 'go' | 'done' | 'next' | 'previous' | 'search' | 'send';
    /**
     * Element to be rendered on the trailing slot of input field label
     */
    trailingHeaderSlot?: (value?: string) => ReactNode;
    /**
     * Element to be rendered on the trailing slot of input field footer
     */
    trailingFooterSlot?: (value?: string) => ReactNode;
    /**
     * Sets the textarea's number of lines
     */
    numberOfLines?: 1 | 2 | 3 | 4 | 5;
    /**
     * Sets the accessibility label for the input
     */
    accessibilityLabel?: string;
    /**
     * Sets the id of the label
     *
     * (Useful when assigning one label to multiple elements using aria-labelledby)
     */
    labelId?: string;
    /**
     * Can be used in select to set the id of the active descendant from the listbox
     */
    activeDescendant?: string;
    /**
     * Hides the label text
     */
    hideLabelText?: boolean;
    /**
     * Hides the form hint text
     */
    hideFormHint?: boolean;
    /**
     * componentName prop sets the data-blade-component attribute name
     * for internal metric collection purposes
     */
    componentName?: string;
    /**
     * whether the input has a popup
     */
    hasPopup?: AriaAttributes['hasPopup'];
    /**
     * id of the popup
     */
    popupId?: string;
    /**
     * true if popup is in expanded state
     */
    isPopupExpanded?: boolean;
    setInputWrapperRef?: (node: ContainerElementType) => void;
    /**
     * sets the autocapitalize behavior for the input
     */
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    /**
     * constraints the height of input to given number rows
     *
     * When set to expandable, input takes 1 row in the begining and expands to take 3 when active
     *
     * @default 'single'
     */
    maxTagRows?: 'single' | 'multiple' | 'expandable';
    /**
     * A slot for adding tags to input
     */
    tags?: React.ReactElement[] | null;
    /**
     * Disables stripping of tags and shows all tags
     */
    showAllTags?: boolean;
    /**
     * State variable of active tag index
     */
    activeTagIndex?: number;
    /**
     * Is this input SelectInput or AutoComplete
     */
    isDropdownTrigger?: boolean;
    /**
     * Is the label expected to be rendered inside input?
     * Used in AutoComplete and Select when label can't exist outside
     *
     */
    isLabelInsideInput?: boolean;
    /**
     * State setter for active tag index
     */
    setActiveTagIndex?: (activeTagIndex: number) => void;
    /**
     * Sets the size of the input field
     * @default medium
     */
    size?: 'medium' | 'large';
    /**
     * Link button to be rendered at the end of the input field.
     * **Note:** `size` of the Link will be set to the same size as the input field, `isDisabled` will follow Input's `isDisabled`, & `variant` will be set to `button`.
     * Example:
     * ```tsx
     * trailingButton={<Link onClick={handleClick}>Apply</Link>}
     * ```
     */
    trailingButton?: React.ReactElement<LinkProps>;
    /**
     * Whether to use Text or Heading component for Input text
     * @default text
     **/
    valueComponentType?: 'text' | 'heading';
    /**
     * Whether to render the input as a table cell
     * @default true
     **/
    isTableInputCell?: boolean;
    /**
     * Hides the form hints and shows them as tooltip of trailing
     */
    showHintsAsTooltip?: boolean;
    role?: AriaAttributes['role'];
    /**
     * Tab Index of the input field
     *
     * @default undefined
     */
    tabIndex?: number;
} & TestID & Platform.Select<{
    native: {
        /**
         * The callback function to be invoked when the value of the input field is submitted.
         */
        onSubmit?: FormInputOnEvent;
        /**
         * determines what autoComplete suggestion type to show
         *
         * Internally it'll render platform specific attributes:
         *
         * - web: `autocomplete`
         * - iOS: `textContentType`
         * - android: `autoComplete`
         *
         */
        autoCompleteSuggestionType?: CommonAutoCompleteSuggestionTypes;
    };
    web: {
        /**
         * This is a react-native only prop and has no effect on web.
         */
        onSubmit?: undefined;
        /**
         * determines what autoComplete suggestion type to show
         *
         * Internally it'll render platform specific attributes:
         *
         * - web: `autocomplete`
         * - iOS: `textContentType`
         * - android: `autoComplete`
         *
         */
        autoCompleteSuggestionType?: WebAutoCompleteSuggestionType;
    };
}> & StyledPropsBlade & MotionMetaProp;
type BaseInputPropsWithA11yLabel = {
    /**
     * Label to be shown for the input field
     */
    label?: undefined;
    /**
     * Accessibility label for the input
     */
    accessibilityLabel: string;
};
type BaseInputPropsWithLabel = {
    /**
     * Label to be shown for the input field
     */
    label: string;
    /**
     * Accessibility label for the input
     */
    accessibilityLabel?: string;
};
export type BaseInputProps = (BaseInputPropsWithA11yLabel | BaseInputPropsWithLabel) & BaseInputCommonProps;
export declare const getHintType: ({ validationState, hasHelpText, }: {
    validationState: BaseInputProps['validationState'];
    hasHelpText: boolean;
}) => FormHintProps['type'];
declare const BaseInput: React.ForwardRefExoticComponent<BaseInputProps & React.RefAttributes<BladeElementRef>>;
export { BaseInput };
