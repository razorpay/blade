/* eslint-disable react/display-name */
import React from 'react';
import styled from 'styled-components';
import { getBaseInputStyles } from './baseInputStyles';

import type { StyledBaseInputProps } from './StyledBaseInput.d';
import getTextStyles from '~components/Typography/Text/getTextStyles';

// omitting our consumer `onChange` prop since the types are conflicting with the default onChange of HTML
const StyledBaseNativeInput = styled.input<
  Omit<StyledBaseInputProps, 'accessibilityProps' | 'setCurrentInteraction'>
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
      isRequired,
      maxCharacters,
      handleOnFocus,
      handleOnChange,
      handleOnBlur,
      keyboardType,
      keyboardReturnKeyType,
      autoCompleteSuggestionType,
      accessibilityProps,
      setCurrentInteraction,
      ...props
    },
    ref,
  ) => {
    return (
      <StyledBaseNativeInput
        ref={ref}
        disabled={isDisabled}
        required={isRequired}
        maxLength={maxCharacters}
        onChange={(event): void => handleOnChange?.({ name, value: event })}
        onBlur={(event): void => {
          setCurrentInteraction('default');
          handleOnBlur?.({ name, value: event });
        }}
        onFocus={(event): void => {
          setCurrentInteraction('focus');
          handleOnFocus?.({ name, value: event });
        }}
        enterKeyHint={keyboardReturnKeyType === 'default' ? 'enter' : keyboardReturnKeyType}
        autoComplete={
          autoCompleteSuggestionType
            ? autoCompleteSuggestionTypeMap[autoCompleteSuggestionType]
            : undefined
        }
        inputMode={keyboardType === 'telephone' ? 'tel' : keyboardType}
        {...props}
        {...accessibilityProps}
      />
    );
  },
);
