import React from 'react';
import styled from 'styled-components/native';
import type { TextInput } from 'react-native';
import type { StyledBaseInputProps } from './StyledBaseInput.d';
import { getBaseInputStyles } from './baseInputStyles';

type StyledComponentAutoCompleteAndroid =
  | 'off'
  | 'name'
  | 'cc-csc'
  | 'cc-exp'
  | 'cc-exp-month'
  | 'cc-exp-year'
  | 'cc-number'
  | 'email'
  | 'username'
  | 'password'
  | 'postal-code'
  | 'tel'
  | undefined;

const autoCompleteSuggestionTypeAndroid = {
  none: 'off',
  name: 'name',
  email: 'email',
  username: 'username',
  password: 'password',
  newPassword: 'password-new',
  oneTimeCode: 'sms-otp',
  telephone: 'tel',
  postalCode: 'postal-code',
  countryName: 'postal-address-country',
  creditCardNumber: 'cc-number',
  creditCardCSC: 'cc-csc',
  creditCardExpiry: 'cc-exp',
  creditCardExpiryMonth: 'cc-exp-month',
  creditCardExpiryYear: 'cc-exp-year',
} as const;

const autoCompleteSuggestionTypeIOS = {
  none: 'none',
  name: 'name',
  email: 'emailAddress',
  username: 'username',
  password: 'password',
  newPassword: 'newPassword',
  oneTimeCode: 'oneTimeCode',
  telephone: 'telephoneNumber',
  postalCode: 'postalCode',
  countryName: 'countryName',
  creditCardNumber: 'creditCardNumber',
  creditCardCSC: 'none',
  creditCardExpiry: 'none',
  creditCardExpiryMonth: 'none',
  creditCardExpiryYear: 'none',
} as const;

const KeyboardTypeToNativeValuesMap = {
  text: 'default',
  search: 'default',
  telephone: 'phone-pad',
  email: 'email-address',
  url: 'url',
  decimal: 'decimal-pad',
};

const StyledNativeBaseInput = styled.TextInput<
  Omit<
    StyledBaseInputProps,
    'accessibilityProps' | 'setCurrentInteraction' | 'currentInteraction'
  > & {
    isFocused: boolean;
    autoCompleteType?: typeof autoCompleteSuggestionTypeAndroid[keyof typeof autoCompleteSuggestionTypeAndroid];
  }
>((props) => ({
  ...getBaseInputStyles({
    theme: props.theme,
    isFocused: props.isFocused,
    isDisabled: !props.editable,
    validationState: props.validationState,
    leadingIcon: props.leadingIcon,
    prefix: props.prefix,
    interactionElement: props.interactionElement,
    suffix: props.suffix,
    trailingIcon: props.trailingIcon,
  }),
  lineHeight: undefined,
  height: '36px',
}));

export const StyledBaseInput = React.forwardRef<TextInput, StyledBaseInputProps>(
  (
    {
      name,
      isRequired,
      isDisabled,
      maxCharacters,
      handleOnFocus,
      handleOnChange,
      handleOnBlur,
      keyboardType = 'text',
      keyboardReturnKeyType,
      autoCompleteSuggestionType,
      accessibilityProps,
      currentInteraction,
      setCurrentInteraction,
      ...props
    },
    ref,
  ) => {
    return (
      <StyledNativeBaseInput
        // the types of styled-components for react-native is creating a mess, so there's no other option but to type `ref` as any
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={ref as any}
        isFocused={currentInteraction === 'active'}
        editable={!isDisabled}
        maxLength={maxCharacters}
        onFocus={(event): void => {
          handleOnFocus?.({ name, value: event?.nativeEvent.text });
          setCurrentInteraction('active');
        }}
        onBlur={(): void => {
          setCurrentInteraction('default');
        }}
        onChangeText={(text): void => handleOnChange?.({ name, value: text })}
        onEndEditing={(event): void => handleOnBlur?.({ name, value: event?.nativeEvent.text })}
        // @ts-expect-error styled-components have limited keyboard types('default' | 'email-address' | 'numeric' | 'phone-pad' | 'number-pad' | 'decimal-pad') compared to the actual supported types so ignoring the error.
        // source: https://reactnative.dev/docs/textinput/#keyboardtype
        keyboardType={KeyboardTypeToNativeValuesMap[keyboardType]}
        returnKeyType={keyboardReturnKeyType}
        autoCompleteType={
          autoCompleteSuggestionType
            ? (autoCompleteSuggestionTypeAndroid[
                autoCompleteSuggestionType
              ] as StyledComponentAutoCompleteAndroid)
            : undefined
        }
        textContentType={
          autoCompleteSuggestionType
            ? autoCompleteSuggestionTypeIOS[autoCompleteSuggestionType]
            : undefined
        }
        {...props}
        {...accessibilityProps}
      />
    );
  },
);
StyledBaseInput.displayName = 'StyledBaseInput';
