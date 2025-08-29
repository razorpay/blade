import { default as React } from 'react';
import { BaseInputProps } from '../BaseInput';
import { FormInputOnEvent } from '../../Form';
import { StyledPropsBlade } from '../../Box/styledProps';
import { DataAnalyticsAttribute } from '../../../utils/types';
type FormInputOnEventWithIndex = ({ name, value, inputIndex, }: {
    name?: string;
    value?: string;
    inputIndex: number;
}) => void;
export type OTPInputCommonProps = Pick<BaseInputProps, 'label' | 'accessibilityLabel' | 'labelPosition' | 'labelSuffix' | 'labelTrailing' | 'validationState' | 'helpText' | 'errorText' | 'successText' | 'name' | 'onChange' | 'value' | 'isDisabled' | 'autoFocus' | 'keyboardReturnKeyType' | 'keyboardType' | 'placeholder' | 'testID' | 'size' | keyof DataAnalyticsAttribute> & {
    /**
     * Determines the number of input fields to show for the OTP
     * @default 6
     */
    otpLength?: 4 | 6;
    /**
     * The callback function to be invoked when all the values of the OTPInput are filled
     */
    onOTPFilled?: FormInputOnEvent;
    /**
     * Masks input characters in all the fields
     */
    isMasked?: boolean;
    /**
     * Determines what autoComplete suggestion type to show. Defaults to `oneTimeCode`.
     *
     * It's not recommended to turn this off in favor of otp input practices.
     *
     *
     * Internally it'll render platform specific attributes:
     *
     * - web: `autocomplete`
     * - iOS: `textContentType`
     * - android: `autoComplete`
     *
     */
    autoCompleteSuggestionType?: Extract<BaseInputProps['autoCompleteSuggestionType'], 'none' | 'oneTimeCode'>;
    /**
     * The callback function to be invoked when one of the input fields gets focus
     */
    onFocus?: FormInputOnEventWithIndex;
    /**
     * The callback function to be invoked when one of the input fields is blurred
     */
    onBlur?: FormInputOnEventWithIndex;
} & StyledPropsBlade;
type OTPInputPropsWithA11yLabel = {
    /**
     * Label to be shown for the input field
     */
    label?: undefined;
    /**
     * Accessibility label for the input
     */
    accessibilityLabel: string;
};
type OTPInputPropsWithLabel = {
    /**
     * Label to be shown for the input field
     */
    label: string;
    /**
     * Accessibility label for the input
     */
    accessibilityLabel?: string;
};
type OTPInputProps = (OTPInputPropsWithA11yLabel | OTPInputPropsWithLabel) & OTPInputCommonProps;
declare const OTPInput: React.ForwardRefExoticComponent<OTPInputProps & React.RefAttributes<HTMLInputElement[]>>;
export type { OTPInputProps };
export { OTPInput };
