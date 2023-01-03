import React from 'react';
import styled from 'styled-components';
import { getBaseInputStyles } from './baseInputStyles';

import type { StyledBaseInputProps } from './types';
import getTextStyles from '~components/Typography/Text/getTextStyles';

const StyledBaseNativeInput = styled.input<
  Omit<StyledBaseInputProps, 'accessibilityProps' | 'setCurrentInteraction' | 'type'>
>((props) => ({
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

export const StyledBaseInput = React.forwardRef<HTMLInputElement, StyledBaseInputProps>(
  (
    {
      name,
      isDisabled,
      isReadOnly,
      isRequired,
      maxCharacters,
      handleOnFocus,
      handleOnChange,
      handleOnBlur,
      handleOnInput,
      handleOnKeyDown,
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
    return (
      <StyledBaseNativeInput
        ref={ref}
        name={name}
        role={hasPopup ? 'combobox' : undefined}
        readOnly={isReadOnly}
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
