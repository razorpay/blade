import React from 'react';
import styled from 'styled-components/native';
import type { CSSObject, ThemeProps, DefaultTheme } from 'styled-components';
import type {
  TextInputProps,
  TextInput,
  TouchableHighlight,
  TouchableHighlightProps,
  GestureResponderEvent,
} from 'react-native';
import type { BaseInputProps } from './BaseInput';
import type { StyledBaseInputProps } from './types';
import { getBaseInputStyles } from './baseInputStyles';
import { Text } from '~components/Typography';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { size } from '~tokens/global';
import { makeSize } from '~utils/makeSize';
import type { Platform } from '~utils';

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
  editable?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
};

const getInputHeight = ({
  isTextArea,
  hasTags,
  numberOfLines,
  lineHeight,
}: Pick<StyledBaseInputProps, 'hasTags' | 'isTextArea' | 'numberOfLines'> & {
  lineHeight: number;
}): string | undefined => {
  if (isTextArea) {
    return `${lineHeight * (numberOfLines ?? 0)}px`;
  }

  if (hasTags) {
    return undefined; // we don't set height on input. We set it on wrapper to properly include tags in overall height
  }

  return makeSize(size[36]);
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
      isDisabled: !props.editable,
      validationState: props.validationState,
      leadingIcon: props.leadingIcon,
      prefix: props.prefix,
      interactionElement: props.interactionElement,
      suffix: props.suffix,
      trailingIcon: props.trailingIcon,
      isTextArea: props.isTextArea,
      hasTags: props.hasTags,
      isDropdownTrigger: props.isDropdownTrigger,
    }),
    lineHeight: undefined,
    textAlignVertical: 'top',
    height: getInputHeight({
      isTextArea: props.isTextArea,
      hasTags: props.hasTags,
      numberOfLines: props.numberOfLines,
      lineHeight: props.theme.typography.lineHeights[300],
    }),
  };
};
const StyledNativeBaseInput = styled.TextInput<StyledComponentInputProps>(
  ({
    id,
    isFocused,
    theme,
    editable,
    validationState,
    leadingIcon,
    prefix,
    interactionElement,
    suffix,
    trailingIcon,
    isTextArea,
    numberOfLines,
    isDropdownTrigger,
    hasTags,
  }) =>
    getRNInputStyles({
      id,
      isFocused,
      theme,
      editable,
      validationState,
      leadingIcon,
      prefix,
      interactionElement,
      suffix,
      trailingIcon,
      isTextArea,
      numberOfLines,
      hasTags,
      isDropdownTrigger,
    }),
);
const StyledNativeBaseButton = styled.TouchableOpacity<StyledComponentInputProps>(
  ({
    id,
    isFocused,
    theme,
    editable,
    validationState,
    leadingIcon,
    prefix,
    interactionElement,
    suffix,
    trailingIcon,
    isTextArea,
    numberOfLines,
    isDropdownTrigger,
    hasTags,
  }) =>
    getRNInputStyles({
      id,
      isFocused,
      theme,
      editable,
      validationState,
      leadingIcon,
      prefix,
      interactionElement,
      suffix,
      trailingIcon,
      isTextArea,
      numberOfLines,
      isDropdownTrigger,
      hasTags,
    }),
);

const _StyledBaseInput: React.ForwardRefRenderFunction<
  TextInput | TouchableHighlight,
  StyledBaseInputProps
> = (
  {
    name,
    isRequired,
    isDisabled,
    maxCharacters,
    handleOnFocus,
    handleOnChange,
    handleOnBlur,
    handleOnSubmit,
    handleOnInput,
    handleOnKeyDown,
    handleOnClick,
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
    shouldIgnoreBlurAnimation,
    autoCapitalize,
    as,
    ...props
  },
  ref,
) => {
  const buttonValue = props.value ? props.value : props.placeholder;
  const commonProps = {
    onBlur: (): void => {
      // In certain cases like SelectInput, we want to ignore the blur animation when option item is clicked.
      // The selectinput should always look like it is in focus otherwise it triggers blur + focus again which can cause flicker
      if (!shouldIgnoreBlurAnimation) {
        setCurrentInteraction('default');
      }
    },
    isFocused: currentInteraction === 'active',
  };

  return hasPopup ? (
    <StyledNativeBaseButton
      // the types of styled-components for react-native is creating a mess, so there's no other option but to type `ref` as any
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      onPress={(): void => {
        handleOnClick?.({ name, value: props.value });
      }}
      onFocus={(): void => {
        handleOnFocus?.({ name, value: props.value });
        setCurrentInteraction('active');
      }}
      as={undefined}
      {...commonProps}
      {...props}
      {...accessibilityProps}
    >
      <Text
        type={props.value ? 'subtle' : 'placeholder'}
        truncateAfterLines={1}
        textAlign={props.textAlign}
      >
        {buttonValue}
      </Text>
    </StyledNativeBaseButton>
  ) : (
    <StyledNativeBaseInput
      // the types of styled-components for react-native is creating a mess, so there's no other option but to type `ref` as any
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      multiline={isTextArea}
      numberOfLines={numberOfLines}
      editable={!isDisabled}
      maxLength={maxCharacters}
      onFocus={(event): void => {
        handleOnFocus?.({ name, value: event?.nativeEvent.text });
        setCurrentInteraction('active');
      }}
      onChangeText={(text): void => {
        handleOnChange?.({ name, value: text });
        handleOnInput?.({ name, value: text });
      }}
      onEndEditing={(event): void => handleOnBlur?.({ name, value: event?.nativeEvent.text })}
      onSubmitEditing={(event): void => handleOnSubmit?.({ name, value: event?.nativeEvent.text })}
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
              autoCompleteSuggestionType as Platform.CastNative<
                BaseInputProps['autoCompleteSuggestionType']
              >
            ] as StyledComponentAutoCompleteAndroid)
          : undefined
      }
      secureTextEntry={type === 'password'}
      isTextArea={isTextArea}
      textContentType={
        autoCompleteSuggestionType
          ? autoCompleteSuggestionTypeIOS[
              autoCompleteSuggestionType as Platform.CastNative<
                BaseInputProps['autoCompleteSuggestionType']
              >
            ]
          : undefined
      }
      autoCapitalize={autoCapitalize}
      {...commonProps}
      {...props}
      {...accessibilityProps}
    />
  );
};

const StyledBaseInput = assignWithoutSideEffects(React.forwardRef(_StyledBaseInput), {
  displayName: 'StyledBaseInput',
});

export { StyledBaseInput };
