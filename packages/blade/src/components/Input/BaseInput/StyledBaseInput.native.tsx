import type { ReactElement } from 'react';
import { useState } from 'react';
import styled from 'styled-components/native';
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

const StyledNativeBaseInput = styled.TextInput<
  Omit<StyledBaseInputProps, 'accessibilityProps'> & {
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

export const StyledBaseInput = ({
  name,
  isRequired,
  isDisabled,
  handleOnChange,
  handleOnBlur,
  keyboardReturnKeyType,
  autoCompleteSuggestionType,
  accessibilityProps,
  ...props
}: StyledBaseInputProps & {
  keyboardReturnKeyType?: Exclude<StyledBaseInputProps['keyboardReturnKeyType'], 'enter'>;
}): ReactElement => {
  const [isFocused, setisFocused] = useState(false);

  return (
    <StyledNativeBaseInput
      isFocused={isFocused}
      editable={!isDisabled}
      onFocus={(): void => {
        setisFocused(true);
        props.setIsFocused(true);
      }}
      onBlur={(): void => {
        setisFocused(false);
        props.setIsFocused(false);
      }}
      onChangeText={(text): void => handleOnChange?.({ name, value: text })}
      onEndEditing={(event): void => handleOnBlur?.({ name, value: event?.nativeEvent.text })}
      returnKeyType={keyboardReturnKeyType}
      textContentType={
        autoCompleteSuggestionType
          ? autoCompleteSuggestionTypeIOS[autoCompleteSuggestionType]
          : undefined
      }
      autoCompleteType={
        autoCompleteSuggestionType
          ? (autoCompleteSuggestionTypeAndroid[
              autoCompleteSuggestionType
            ] as StyledComponentAutoCompleteAndroid)
          : undefined
      }
      {...props}
      {...accessibilityProps}
    />
  );
};
