import React from 'react';
import styled from 'styled-components';
import type { CSSObject, DefaultTheme, ThemeProps } from 'styled-components';
import { getBaseInputStyles } from './baseInputStyles';

import type { StyledBaseInputProps } from './types';
import getTextStyles from '~components/Typography/Text/getTextStyles';

const getWebInputStyles = (
  props: Omit<StyledBaseInputProps, 'accessibilityProps' | 'setCurrentInteraction' | 'type'> &
    ThemeProps<DefaultTheme> &
    (React.InputHTMLAttributes<HTMLInputElement> | React.ButtonHTMLAttributes<HTMLButtonElement>),
): CSSObject => {
  return {
    ...getBaseInputStyles({
      isDisabled: props.disabled,
      theme: props.theme,
      validationState: props.validationState,
      leadingIcon: props.leadingIcon,
      prefix: props.prefix,
      interactionElement: props.interactionElement,
      suffix: props.suffix,
      trailingIcon: props.trailingIcon,
      textAlign: props.textAlign,
    }),
    outline: 'none',
    border: 'none',
    '::placeholder': {
      ...getTextStyles({
        size: 'medium',
        variant: 'body',
        type: 'placeholder',
        weight: 'regular',
        contrast: 'low',
        theme: props.theme,
      }),
      textAlign: props.textAlign,
    },
    ':focus': {
      outline: 'none',
    },
    cursor: props.disabled ? 'not-allowed' : 'auto',
  };
};

const StyledBaseNativeInput = styled.input<
  Omit<StyledBaseInputProps, 'accessibilityProps' | 'setCurrentInteraction' | 'type'>
>(getWebInputStyles);

const StyledBaseNativeButton = styled.button<
  Omit<StyledBaseInputProps, 'accessibilityProps' | 'setCurrentInteraction' | 'type'>
>((props) => ({
  ...getWebInputStyles(props),
  // In button, we're styling the innerText like a placeholder to make it similar with other inputs
  ...getTextStyles({
    size: 'medium',
    variant: 'body',
    type: 'placeholder',
    weight: 'regular',
    contrast: 'low',
    theme: props.theme,
  }),
  textAlign: props.textAlign,
}));

const autoCompleteSuggestionTypeMap = {
  none: 'off',
  name: 'name',
  email: 'email',
  username: 'username',
  password: 'current-password',
  newPassword: 'new-password',
  oneTimeCode: 'one-time-code',
  telephone: 'tel',
  postalCode: 'postal-code',
  countryName: 'country',
  creditCardNumber: 'cc-number',
  creditCardCSC: 'cc-csc',
  creditCardExpiry: 'cc-exp',
  creditCardExpiryMonth: 'cc-exp-month',
  creditCardExpiryYear: 'cc-exp-year',
};

export const StyledBaseInput = React.forwardRef<
  HTMLInputElement | HTMLButtonElement,
  StyledBaseInputProps
>(
  (
    {
      name,
      isDisabled,
      isRequired,
      maxCharacters,
      handleOnFocus,
      handleOnChange,
      handleOnBlur,
      handleOnInput,
      handleOnKeyDown,
      onClick,
      keyboardType,
      keyboardReturnKeyType,
      autoCompleteSuggestionType,
      accessibilityProps,
      setCurrentInteraction,
      numberOfLines,
      type,
      hasPopup,
      ...props
    },
    ref,
  ) => {
    return props.as === 'button' ? (
      <StyledBaseNativeButton
        // @ts-expect-error: TS doesnt understand that this will always be `button`
        ref={ref}
        name={name}
        disabled={isDisabled}
        required={isRequired}
        onClick={onClick}
        onBlur={(event: React.ChangeEvent<HTMLInputElement>): void => {
          setCurrentInteraction('default');
          handleOnBlur?.({ name, value: event });
        }}
        onFocus={(event: React.ChangeEvent<HTMLInputElement>): void => {
          setCurrentInteraction('active');
          handleOnFocus?.({ name, value: event });
        }}
        onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
          handleOnKeyDown?.({ name, key: event.key, code: event.code, event });
        }}
        {...props}
        {...accessibilityProps}
      >
        {props.placeholder}
      </StyledBaseNativeButton>
    ) : (
      <StyledBaseNativeInput
        // @ts-expect-error: TS doesnt understand that this will always be `input`
        ref={ref}
        name={name}
        type={type === 'telephone' ? 'tel' : type}
        disabled={isDisabled}
        required={isRequired}
        maxLength={maxCharacters}
        rows={numberOfLines}
        inputMode={keyboardType === 'telephone' ? 'tel' : keyboardType}
        enterKeyHint={keyboardReturnKeyType === 'default' ? 'enter' : keyboardReturnKeyType}
        autoComplete={
          autoCompleteSuggestionType
            ? autoCompleteSuggestionTypeMap[autoCompleteSuggestionType]
            : undefined
        }
        onChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
          handleOnChange?.({ name, value: event })
        }
        onBlur={(event: React.ChangeEvent<HTMLInputElement>): void => {
          setCurrentInteraction('default');
          handleOnBlur?.({ name, value: event });
        }}
        onFocus={(event: React.ChangeEvent<HTMLInputElement>): void => {
          setCurrentInteraction('active');
          handleOnFocus?.({ name, value: event });
        }}
        onInput={(event: React.ChangeEvent<HTMLInputElement>) => {
          handleOnInput?.({ name, value: event });
        }}
        onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
          handleOnKeyDown?.({ name, key: event.key, code: event.code, event });
        }}
        {...props}
        {...accessibilityProps}
      />
    );
  },
);
StyledBaseInput.displayName = 'StyledBaseInput';
