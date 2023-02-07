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
  ...getTextStyles({
    size: 'medium',
    variant: 'body',
    type: 'subtle',
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
      handleOnClick,
      keyboardType,
      keyboardReturnKeyType,
      autoCompleteSuggestionType,
      accessibilityProps,
      setCurrentInteraction,
      numberOfLines,
      type,
      hasPopup,
      shouldIgnoreBlurAnimation,
      setShouldIgnoreBlurAnimation,
      ...props
    },
    ref,
  ) => {
    const commonProps = {
      onBlur: (event: React.ChangeEvent<HTMLInputElement>): void => {
        if (shouldIgnoreBlurAnimation && setShouldIgnoreBlurAnimation) {
          setShouldIgnoreBlurAnimation(false);
        } else {
          setCurrentInteraction('default');
        }
        handleOnBlur?.({ name, value: event });
      },
      onFocus: (event: React.ChangeEvent<HTMLInputElement>): void => {
        setCurrentInteraction('active');
        handleOnFocus?.({ name, value: event });
      },
      onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => {
        handleOnKeyDown?.({ name, key: event.key, code: event.code, event });
      },
      disabled: isDisabled,
      enterKeyHint: keyboardReturnKeyType === 'default' ? 'enter' : keyboardReturnKeyType,
      autoComplete: autoCompleteSuggestionType
        ? autoCompleteSuggestionTypeMap[autoCompleteSuggestionType]
        : undefined,
    };

    return props.as === 'button' ? (
      <StyledBaseNativeButton
        // @ts-expect-error: TS doesnt understand that this will always be `button`
        ref={ref}
        name={name}
        type="button"
        onClick={(event: React.MouseEvent<HTMLInputElement>): void => {
          handleOnClick?.({ name, value: event });
        }}
        {...commonProps}
        {...props}
        {...accessibilityProps}
        value={props.value ? props.value : props.defaultValue}
      >
        {props.value ? props.value : props.defaultValue}
      </StyledBaseNativeButton>
    ) : (
      <StyledBaseNativeInput
        // @ts-expect-error: TS doesnt understand that this will always be `input`
        ref={ref}
        name={name}
        type={type === 'telephone' ? 'tel' : type}
        required={isRequired}
        maxLength={maxCharacters}
        rows={numberOfLines}
        inputMode={keyboardType === 'telephone' ? 'tel' : keyboardType}
        onChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
          handleOnChange?.({ name, value: event })
        }
        onInput={(event: React.ChangeEvent<HTMLInputElement>) => {
          handleOnInput?.({ name, value: event });
        }}
        {...commonProps}
        {...props}
        {...accessibilityProps}
      />
    );
  },
);
StyledBaseInput.displayName = 'StyledBaseInput';
