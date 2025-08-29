import { default as React } from 'react';
import { BaseInputProps } from '../BaseInput';
import { StyledPropsBlade } from '../../Box/styledProps';
import { DataAnalyticsAttribute, BladeElementRef } from '../../../utils/types';
type PasswordInputExtraProps = {
    /**
     * Shows a reveal button to toggle password visibility
     *
     * @default true
     */
    showRevealButton?: boolean;
    /**
     * Displays asterisk (`*`) when `isRequired` is enabled
     *
     * @default none
     */
    necessityIndicator?: Exclude<BaseInputProps['necessityIndicator'], 'optional'>;
    /**
     * Determines what autoComplete suggestion type to show. Defaults to using platform heuristics.
     *
     * It's not recommended to turn this off in favor of safe password practices.
     * Providing `password` or `newPassword` is more informative to the platform for browser autofill or password managers.
     *
     * **Note**: Using `newPassword` on iOS has some [known issue](https://github.com/facebook/react-native/issues/21911) on React Native
     *
     * Internally it'll render platform specific attributes:
     *
     * - web: `autocomplete`
     * - iOS: `textContentType`
     * - android: `autoComplete`
     *
     */
    autoCompleteSuggestionType?: Extract<BaseInputProps['autoCompleteSuggestionType'], 'none' | 'password' | 'newPassword'>;
};
type PasswordInputCommonProps = Pick<BaseInputProps, 'label' | 'accessibilityLabel' | 'labelPosition' | 'labelSuffix' | 'labelTrailing' | 'maxCharacters' | 'validationState' | 'errorText' | 'successText' | 'helpText' | 'isDisabled' | 'defaultValue' | 'placeholder' | 'isRequired' | 'value' | 'onChange' | 'onBlur' | 'onSubmit' | 'onFocus' | 'name' | 'autoFocus' | 'keyboardReturnKeyType' | 'autoCompleteSuggestionType' | 'testID' | 'size' | keyof DataAnalyticsAttribute> & PasswordInputExtraProps & StyledPropsBlade;
type PasswordInputPropsWithA11yLabel = {
    /**
     * Label to be shown for the input field
     */
    label?: undefined;
    /**
     * Accessibility label for the input
     */
    accessibilityLabel: string;
};
type PasswordInputPropsWithLabel = {
    /**
     * Label to be shown for the input field
     */
    label: string;
    /**
     * Accessibility label for the input
     */
    accessibilityLabel?: string;
};
type PasswordInputProps = (PasswordInputPropsWithA11yLabel | PasswordInputPropsWithLabel) & PasswordInputCommonProps;
declare const PasswordInput: React.ForwardRefExoticComponent<PasswordInputProps & React.RefAttributes<BladeElementRef>>;
export type { PasswordInputProps };
export { PasswordInput };
