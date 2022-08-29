import React, { useState } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { StyledBaseInput } from './StyledBaseInput';
import { BaseInputVisuals } from './BaseInputVisuals';
import { BaseInputWrapper } from './BaseInputWrapper';
import Box from '~components/Box';
import { FormHint, FormLabel } from '~components/Form';
import { getPlatformType, makeAccessible, useBreakpoint } from '~utils';
import type { FormLabelProps } from '~components/Form/FormLabel';
import type { FormHintProps } from '~components/Form/FormHint';
import { useFormId } from '~components/Form/useFormId';
import { useTheme } from '~components/BladeProvider';
import type { IconComponent } from '~components/Icons';

export type HandleOnEvent = ({
  name,
  value,
}: {
  name?: string;
  value?: React.ChangeEvent<HTMLInputElement> | string;
}) => void;

export type OnEvent = ({ name, value }: { name?: string; value?: string }) => void;

// TODO: need to abstract for generic use
type InputLabelProps = {
  /**
   * Label to be shown for the input field
   */
  label: string;
  /**
   * Desktop only prop. on Mobile by default the label will be on top
   */
  labelPosition?: FormLabelProps['position'];
  /**
   * Displays `(optional)` when `optional` is passed or `*` when `required` is passed
   */
  necessityIndicator?: FormLabelProps['necessityIndicator'];
};

// TODO: need to abstract for generic use
type InputValidationProps = {
  /**
   * Help text for the input
   */
  helpText?: string;
  /**
   * Error text for the input
   *
   * Renders when `validationState` is set to 'error'
   */
  errorText?: string;
  /**
   * success text for the input
   *
   * Renders when `validationState` is set to 'success'
   */
  successText?: string;
  /**
   * If `error`, the input is marked as invalid,
   * and `invalid` attribute will be added
   *
   * If `success`, the input is marked as valid,
   *
   */
  validationState?: 'success' | 'error' | 'none';
};

export type BaseInputProps = InputLabelProps &
  InputValidationProps & {
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
    type?: 'text' | 'telephone' | 'email' | 'url' | 'numeric' | 'search';
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
     * The callback function to be invoked when the value of the input field changes
     */
    onChange?: OnEvent;
    /**
     * The callback function to be invoked when the the input field loses focus
     *
     * For React Native this will call `onEndEditing` event since we want to get the last value of the input field
     */
    onBlur?: OnEvent;
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
     * Prefix symbol to be displayed at the beginning of the input field
     */
    prefix?: string;
    /**
     * this is left to the components which is extending BaseInput
     *
     * eg: consumers can render a loader or they could render a clear button
     */
    interactionElement?: ReactNode;
    // /**
    //  * Decides whether to render a clear icon button
    //  */
    // showClearButton?: boolean;
    // /**
    //  * Event handler to handle the onClick event for clear button.
    //  */
    // onClearButtonClick?: () => void;
    // /**
    //  * Decides whether to show a loading spinner for the input field.
    //  */
    // isLoading?: boolean;
    /**
     * Suffix symbol to be displayed at the beginning of the input field
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
     * determines what return key to show on the keyboard of mobile devices/virtual keyboard
     * **Note**: Few values are platform dependent and might not render on all the platforms
     *
     * `enter` is only available on web
     * `previous` is only available on native android
     */
    keyboardReturnKeyType?: 'enter' | 'go' | 'done' | 'next' | 'previous' | 'search' | 'send';
    /**
     * **Web only**
     *
     * Hints browser to display an appropriate virtual keyboard
     *
     *
     */
    inputMode?: 'text' | 'search' | 'tel' | 'email' | 'url';
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
    autoCompleteSuggestionType?:
      | 'none'
      | 'name'
      | 'email'
      | 'username'
      | 'password'
      | 'newPassword'
      | 'oneTimeCode'
      | 'telephone'
      | 'postalCode'
      | 'countryName'
      | 'creditCardNumber'
      | 'creditCardCSC'
      | 'creditCardExpiry'
      | 'creditCardExpiryMonth'
      | 'creditCardExpiryYear';
  };

const autoCompleteSuggestionTypeValues = [
  'none',
  'name',
  'email',
  'username',
  'password',
  'newPassword',
  'oneTimeCode',
  'telephone',
  'postalCode',
  'countryName',
  'creditCardNumber',
  'creditCardCSC',
  'creditCardExpiry',
  'creditCardExpiryMonth',
  'creditCardExpiryYear',
];

const useInput = ({
  value,
  defaultValue,
  onChange,
  onBlur,
}: Pick<BaseInputProps, 'value' | 'defaultValue' | 'onChange' | 'onBlur'>): {
  handleOnChange: HandleOnEvent;
  handleOnBlur: HandleOnEvent;
} => {
  if (value && defaultValue) {
    throw new Error(
      `[Blade: Input]: Either 'value' or 'defaultValue' shall be passed. This decides if the input field is controlled or uncontrolled`,
    );
  }

  const handleOnChange: HandleOnEvent = React.useCallback(
    ({ name, value }) => {
      let _value = '';

      if (getPlatformType() === 'react-native' && typeof value === 'string') {
        _value = value;
      } else if (typeof value !== 'string') {
        // it's weird but TS forced me to write this much code where I could have just done "getPlatformType() === 'react-native' ? value : value?.target.value" :(
        _value = value?.target.value ?? '';
      }

      onChange?.({
        name,
        value: _value,
      });
    },
    [onChange],
  );

  const handleOnBlur: HandleOnEvent = React.useCallback(
    ({ name, value }) => {
      let _value = '';

      if (getPlatformType() === 'react-native' && typeof value == 'string') {
        _value = value;
      } else if (typeof value !== 'string') {
        // it's weird but TS forced me to write this much code where I could have just done "getPlatformType() === 'react-native' ? value : value?.target.value" :(
        _value = value?.target.value ?? '';
      }

      onBlur?.({
        name,
        value: _value,
      });
    },
    [onBlur],
  );

  return { handleOnChange, handleOnBlur };
};

export const getHintType = ({
  validationState,
  hasHelpText,
}: {
  validationState: BaseInputProps['validationState'];
  hasHelpText: boolean;
}): FormHintProps['type'] => {
  if (validationState === 'error') {
    return 'error';
  }

  if (validationState === 'success') {
    return 'success';
  }

  if (hasHelpText) {
    return 'help';
  }

  return 'help';
};

const getDescribedByElementId = ({
  validationState,
  hasErrorText,
  hasSuccessText,
  hasHelpText,
  errorTextId,
  successTextId,
  helpTextId,
}: {
  validationState: BaseInputProps['validationState'];
  hasErrorText: boolean;
  hasSuccessText: boolean;
  hasHelpText: boolean;
  errorTextId: string;
  successTextId: string;
  helpTextId: string;
}): string => {
  if (validationState === 'error' && hasErrorText) {
    return errorTextId;
  }

  if (validationState === 'success' && hasSuccessText) {
    return successTextId;
  }

  if (hasHelpText) {
    return helpTextId;
  }

  return '';
};

export const BaseInput = ({
  label,
  labelPosition = 'top',
  placeholder,
  type = 'text',
  defaultValue,
  name,
  value,
  onChange,
  isDisabled,
  necessityIndicator,
  validationState,
  errorText,
  helpText,
  successText,
  isRequired,
  leadingIcon,
  prefix,
  interactionElement,
  suffix,
  trailingIcon,
  textAlign,
  autoFocus,
  keyboardReturnKeyType,
  inputMode,
  autoCompleteSuggestionType,
}: BaseInputProps): ReactElement => {
  const { theme } = useTheme();
  const { handleOnChange, handleOnBlur } = useInput({ defaultValue, value, onChange });
  const { inputId, helpTextId, errorTextId, successTextId } = useFormId('input-field');
  const { matchedDeviceType } = useBreakpoint({ breakpoints: theme.breakpoints });
  const isLabelLeftPositioned = labelPosition === 'left' && matchedDeviceType === 'desktop';
  const [isFocused, setIsFocused] = useState(false);
  const accessibilityProps = makeAccessible({
    required: Boolean(isRequired),
    disabled: Boolean(isDisabled),
    invalid: Boolean(validationState === 'error'),
    describedBy: getDescribedByElementId({
      validationState,
      hasErrorText: Boolean(errorText),
      hasSuccessText: Boolean(successText),
      hasHelpText: Boolean(helpText),
      errorTextId,
      successTextId,
      helpTextId,
    }),
  });

  if (
    autoCompleteSuggestionType &&
    !autoCompleteSuggestionTypeValues.includes(autoCompleteSuggestionType)
  ) {
    throw new Error(
      `[Blade: Input]: Expected autoCompleteSuggestionType to be one of ${autoCompleteSuggestionTypeValues.join(
        ', ',
      )} but received ${autoCompleteSuggestionType}`,
    );
  }

  return (
    <>
      <Box
        display="flex"
        flexDirection={isLabelLeftPositioned ? 'row' : 'column'}
        justifyContent={isLabelLeftPositioned ? 'center' : undefined}
        alignItems={isLabelLeftPositioned ? 'center' : undefined}
      >
        <FormLabel
          as="label"
          necessityIndicator={necessityIndicator}
          position={labelPosition}
          htmlFor={inputId}
        >
          {label}
        </FormLabel>
        <BaseInputWrapper
          isDisabled={isDisabled}
          validationState={validationState}
          isFocused={isFocused}
        >
          <BaseInputVisuals leadingIcon={leadingIcon} prefix={prefix} isDisabled={isDisabled} />
          <StyledBaseInput
            id={inputId}
            name={name}
            type={type}
            defaultValue={defaultValue}
            value={value}
            placeholder={placeholder}
            isDisabled={isDisabled}
            validationState={validationState}
            isRequired={isRequired}
            handleOnChange={handleOnChange}
            handleOnBlur={handleOnBlur}
            leadingIcon={leadingIcon}
            prefix={prefix}
            interactionElement={interactionElement}
            suffix={suffix}
            trailingIcon={trailingIcon}
            setIsFocused={setIsFocused}
            textAlign={textAlign}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus={autoFocus}
            keyboardReturnKeyType={keyboardReturnKeyType}
            inputMode={inputMode}
            autoCompleteSuggestionType={autoCompleteSuggestionType}
            accessibilityProps={accessibilityProps}
          />
          <BaseInputVisuals
            interactionElement={interactionElement}
            suffix={suffix}
            trailingIcon={trailingIcon}
            isDisabled={isDisabled}
          />
        </BaseInputWrapper>
      </Box>
      {/* the magic number 136 is basically max-width of label i.e 120 and then right margin i.e 16 which is the spacing between label and input field */}
      <Box marginLeft={isLabelLeftPositioned ? 136 : 0}>
        <FormHint
          type={getHintType({ validationState, hasHelpText: Boolean(helpText) })}
          helpText={helpText}
          errorText={errorText}
          successText={successText}
          helpTextId={helpTextId}
          errorTextId={errorTextId}
          successTextId={successTextId}
        />
      </Box>
    </>
  );
};
