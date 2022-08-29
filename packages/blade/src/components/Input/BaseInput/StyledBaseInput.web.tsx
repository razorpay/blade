import styled from 'styled-components';
import type { ReactElement } from 'react';
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
  '::placeholder': {
    ...getTextStyles({
      size: 'medium',
      variant: 'body',
      type: 'placeholder',
      weight: 'regular',
      contrast: 'low',
      theme: props.theme,
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
  }),
);

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

export const StyledBaseInput = ({
  name,
  isDisabled,
  isRequired,
  handleOnChange,
  handleOnBlur,
  keyboardReturnKeyType,
  autoCompleteSuggestionType,
  accessibilityProps,
  setCurrentInteraction,
  ...props
}: StyledBaseInputProps): ReactElement => {
  return (
    <StyledBaseNativeInput
      disabled={isDisabled}
      required={isRequired}
      onChange={(event): void => handleOnChange?.({ name, value: event })}
      onBlur={(event): void => {
        setCurrentInteraction('default');
        handleOnBlur?.({ name, value: event });
      }}
      onFocus={(): void => setCurrentInteraction('focus')}
      enterKeyHint={keyboardReturnKeyType}
      autoComplete={
        autoCompleteSuggestionType
          ? autoCompleteSuggestionTypeMap[autoCompleteSuggestionType]
          : undefined
      }
      {...props}
      {...accessibilityProps}
    />
  );
};
