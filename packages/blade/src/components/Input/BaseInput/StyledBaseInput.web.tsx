import React from 'react';
import styled from 'styled-components';
import type { CSSObject, DefaultTheme, ThemeProps } from 'styled-components';
import { getBaseInputStyles } from './baseInputStyles';
import type { StyledBaseInputProps } from './types';
import getTextStyles from '~components/Typography/Text/getTextStyles';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { Text } from '~components/Typography';

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
      trailingInteractionElement: props.trailingInteractionElement,
      leadingInteractionElement: props.leadingInteractionElement,
      suffix: props.suffix,
      trailingIcon: props.trailingIcon,
      textAlign: props.textAlign,
      isTextArea: props.isTextArea,
      hasTags: props.hasTags,
      isDropdownTrigger: props.isDropdownTrigger,
      size: props.$size,
      valueComponentType: props.valueComponentType,
      isTableInputCell: props.isTableInputCell,
    }),
    outline: 'none',
    border: 'none',
    '::placeholder': {
      ...getTextStyles({
        size: props.$size,
        variant: 'body',
        weight: 'regular',
        color: 'surface.text.gray.disabled',
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
}));

const autoCompleteSuggestionTypeMap = {
  none: 'off',
  on: 'on',
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

const _StyledBaseInput: React.ForwardRefRenderFunction<
  HTMLInputElement | HTMLButtonElement,
  StyledBaseInputProps
> = (
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
    autoCapitalize,
    $size,
    valueComponentType,
    ...props
  },
  ref,
) => {
  const commonProps = {
    onBlur: (event: React.ChangeEvent<HTMLInputElement>): void => {
      // In certain cases like SelectInput, we want to ignore the blur animation when option item is clicked.
      // The selectinput should always look like it is in focus otherwise it triggers blur + focus again which can cause flicker
      if (!shouldIgnoreBlurAnimation) {
        setCurrentInteraction('default');
      }
      handleOnBlur?.({ name, value: event });
    },
    onFocus: (event: React.ChangeEvent<HTMLInputElement>): void => {
      setCurrentInteraction('focus');
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
        if (props.isDropdownTrigger) {
          // dropdown triggers have click event on outer container as well on web to handle outer padding clicks of input
          // we don't want the clicks to be called twice in such cases so we stop propogation if this click has happened
          event.stopPropagation();
        }

        handleOnClick?.({ name, value: event });
      }}
      $size={$size}
      valueComponentType={valueComponentType}
      {...commonProps}
      {...props}
      {...accessibilityProps}
      value={props.value}
    >
      <Text
        color={
          props.value && !isDisabled ? 'surface.text.gray.subtle' : 'surface.text.gray.disabled'
        }
        truncateAfterLines={1}
        textAlign={props.textAlign}
        size={$size}
      >
        {props.value ? props.value : props.placeholder}
      </Text>
    </StyledBaseNativeButton>
  ) : (
    <StyledBaseNativeInput
      // @ts-expect-error: TS doesnt understand that this will always be `input`
      ref={ref}
      name={name}
      type={type === 'telephone' ? 'tel' : type}
      required={isRequired}
      maxLength={maxCharacters}
      // In Tagged TextArea, tags take up their own space so we need to define height instead of relying on HTML rows
      rows={props.isTextArea && props.isDropdownTrigger ? 1 : numberOfLines}
      numberOfLines={numberOfLines}
      inputMode={keyboardType === 'telephone' ? 'tel' : keyboardType}
      onChange={(event: React.ChangeEvent<HTMLInputElement>): void =>
        handleOnChange?.({ name, value: event })
      }
      onInput={(event: React.ChangeEvent<HTMLInputElement>) => {
        handleOnInput?.({ name, value: event });
      }}
      onClick={(event) => {
        if (props.isDropdownTrigger) {
          // dropdown triggers have click event on outer container as well on web to handle outer padding clicks of input
          // we don't want the clicks to be called twice in such cases so we stop propogation if this click has happened
          event.stopPropagation();
        }

        handleOnClick?.({ name, value: event });
      }}
      autoCapitalize={autoCapitalize}
      $size={$size}
      valueComponentType={valueComponentType}
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
