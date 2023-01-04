import React from 'react';
import styled from 'styled-components/native';
import type { CSSObject, ThemeProps, DefaultTheme } from 'styled-components';
import type {
  TextInputProps,
  TextInput,
  TouchableHighlight,
  TouchableHighlightProps,
} from 'react-native';
import type { StyledBaseInputProps } from './types';
import { getBaseInputStyles } from './baseInputStyles';
import { Text } from '~components/Typography';

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

type StyledComponentInputProps = Omit<
  StyledBaseInputProps,
  'accessibilityProps' | 'setCurrentInteraction' | 'currentInteraction'
> & {
  isTextArea?: boolean;
  isFocused: boolean;
  autoCompleteType?: typeof autoCompleteSuggestionTypeAndroid[keyof typeof autoCompleteSuggestionTypeAndroid];
};

const getRNInputStyles = (
  props: StyledComponentInputProps &
    ThemeProps<DefaultTheme> &
    (TextInputProps | TouchableHighlightProps),
): CSSObject => {
  return {
    ...getBaseInputStyles({
      theme: props.theme,
      isFocused: props.isFocused,
      isDisabled: 'editable' in props ? !props.editable : undefined,
      validationState: props.validationState,
      leadingIcon: props.leadingIcon,
      prefix: props.prefix,
      interactionElement: props.interactionElement,
      suffix: props.suffix,
      trailingIcon: props.trailingIcon,
    }),
    lineHeight: undefined,
    textAlignVertical: 'top',
    height: props.isTextArea
      ? `${props.theme.typography.lineHeights.xl * (props.numberOfLines ?? 0)}px`
      : '36px',
  };
};

const StyledBaseNativeInput = styled.TextInput<StyledComponentInputProps>(getRNInputStyles);
const StyledBaseNativeButton = styled.TouchableOpacity<StyledComponentInputProps>(getRNInputStyles);

export const StyledBaseInput = React.forwardRef<
  TextInput | TouchableHighlight,
  StyledBaseInputProps
>(
  (
    {
      name,
      isRequired,
      isDisabled,
      maxCharacters,
      handleOnFocus,
      handleOnChange,
      handleOnBlur,
      handleOnInput,
      handleOnKeyDown,
      onClick,
      keyboardType = 'text',
      keyboardReturnKeyType,
      autoCompleteSuggestionType,
      accessibilityProps,
      currentInteraction,
      setCurrentInteraction,
      type,
      numberOfLines,
      isTextArea,
      hasPopup,
      ...props
    },
    ref,
  ) => {
    return hasPopup ? (
      <StyledBaseNativeButton
        // the types of styled-components for react-native is creating a mess, so there's no other option but to type `ref` as any
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={ref as any}
        // @ts-expect-error: not able to type onClick for both web and native
        onPress={onClick}
        onFocus={(): void => {
          setCurrentInteraction('active');
        }}
        onBlur={(): void => {
          setCurrentInteraction('default');
        }}
        {...props}
        {...accessibilityProps}
      >
        <Text size="medium" variant="body" type="placeholder" weight="regular">
          {props.placeholder}
        </Text>
      </StyledBaseNativeButton>
    ) : (
      <StyledBaseNativeInput
        // the types of styled-components for react-native is creating a mess, so there's no other option but to type `ref` as any
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={ref as any}
        multiline={isTextArea}
        numberOfLines={numberOfLines}
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
        onChangeText={(text): void => {
          handleOnChange?.({ name, value: text });
          handleOnInput?.({ name, value: text });
        }}
        onEndEditing={(event): void => handleOnBlur?.({ name, value: event?.nativeEvent.text })}
        onKeyPress={(event): void => {
          handleOnKeyDown?.({
            name,
            key: event?.nativeEvent.key,
            event: (event as unknown) as React.KeyboardEvent<HTMLInputElement>, // TODO: handle platform specific type
          });
        }}
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
        secureTextEntry={type === 'password'}
        isTextArea={isTextArea}
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
