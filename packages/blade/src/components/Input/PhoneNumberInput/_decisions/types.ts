import type { CountryCodeType } from '@razorpay/i18nify-js';
import type { IconComponent } from '~components/Icons';
import type { BaseInputProps } from '~components/Input/BaseInput';

type CommonProps = Pick<
  BaseInputProps,
  | 'label'
  | 'labelPosition'
  | 'name'
  | 'validationState'
  | 'errorText'
  | 'successText'
  | 'helpText'
  | 'defaultValue'
  | 'necessityIndicator'
  | 'isRequired'
  | 'isDisabled'
  | 'onFocus'
  | 'onBlur'
>;

type PhoneNumberInputProps = CommonProps & {
  /**
   * Default value of the input, Used to set the default value of input field when it's uncontrolled
   */
  defaultValue?: string;
  /**
   * Value of the input, Used to turn the input field to controlled so user can control the value
   */
  value?: string;
  /**
   * The default country code to be used in the input.
   *
   * @default "IN" or autodetect based on the user's locale
   */
  defaultCountryCode?: CountryCodeType;
  /**
   * Callback that is called when the value of the input changes.
   */
  onChange?: (event: {
    /**
     * formatted phone number with dial code
     *
     * @example: "+91 123456789"
     */
    phoneNumber: string;
    /**
     * dial code of the country
     *
     * @example: 91 for India
     */
    dialCode: string;
    /**
     * country code of the country
     *
     * @example: "IN" for India
     */
    countryCode: string;
    /**
     * raw value of the input
     */
    value: string;
  }) => void;
  /**
   * If true, the dial code text will be shown in the leading text.
   *
   * @default true
   */
  showDialCode?: boolean;
  /**
   * If true, the country selector will be shown.
   *
   * @default true
   */
  showCountrySelector?: boolean;
  /**
   * Callback that is called when the clear button is clicked.
   */
  onClearButtonClick?: () => void;
  /**
   * Icon to be shown on the leading side of the input.
   */
  leadingIcon?: IconComponent;
  /**
   * The size of the input field.
   *
   * @default medium
   */
  size?: 'medium' | 'large';
};

export type { PhoneNumberInputProps };
