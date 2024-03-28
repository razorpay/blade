import type { CountryCodeType } from '@razorpay/i18nify-js';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { BaseInputProps } from '~components/Input/BaseInput';

type CommonProps = Pick<
  BaseInputProps,
  | 'size'
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
  | 'onClick'
  | 'leadingIcon'
  | 'trailingIcon'
  | 'accessibilityLabel'
  | 'autoFocus'
  | 'testID'
  | 'keyboardReturnKeyType'
  | 'autoCompleteSuggestionType'
>;

type PhoneNumberInputProps = StyledPropsBlade &
  CommonProps & {
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
     * Uncontrolled state of the country code.
     *
     * @default "IN" or autodetect based on the user's locale
     */
    defaultCountryCode?: CountryCodeType;
    /**
     * Controlled state of the country code to be used in the input.
     */
    countryCode?: CountryCodeType;
    /**
     * Callback that is called when the country is selected from the country selector.
     */
    onCountrySelection?: ({ countryCode }: { countryCode: CountryCodeType }) => void;
    /**
     * List of countries to be shown in the country selector.
     */
    countries?: CountryCodeType[];
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
      countryCode: CountryCodeType;
      /**
       * raw value of the input
       */
      value: string;
      /**
       * name of the input
       */
      name: string;
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
  };

export type { PhoneNumberInputProps };
