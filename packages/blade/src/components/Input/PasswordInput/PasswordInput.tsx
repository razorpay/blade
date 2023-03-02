import React from 'react';
import type { BaseInputProps } from '../BaseInput';
import { BaseInput } from '../BaseInput';
import { EyeIcon, EyeOffIcon } from '~components/Icons';
import BaseBox from '~components/Box/BaseBox';
import { CharacterCounter } from '~components/Form/CharacterCounter';
import { IconButton } from '~components/Button/IconButton';
import type { BladeElementRef } from '~src/hooks/useBladeInnerRef';
import { useBladeInnerRef } from '~src/hooks/useBladeInnerRef';
import type { StyledProps } from '~components/Box/styled-props';

type PasswordInputExtraProps = {
  /**
   * Shows a reveal button to toggle password visibility
   *
   * @default true
   */
  showRevealButton?: boolean;

  /**
   * Displays asterisk (`*`) when `isRequired` is enabled
   *
   * @default none
   */
  necessityIndicator?: Exclude<BaseInputProps['necessityIndicator'], 'optional'>;

  /**
   * Determines what autoComplete suggestion type to show. Defaults to using platform heuristics.
   *
   * It's not recommended to turn this off in favor of safe password practices.
   * Providing `password` or `newPassword` is more informative to the platform for browser autofill or password managers.
   *
   * **Note**: Using `newPassword` on iOS has some [known issue](https://github.com/facebook/react-native/issues/21911) on React Native
   *
   * Internally it'll render platform specific attributes:
   *
   * - web: `autocomplete`
   * - iOS: `textContentType`
   * - android: `autoComplete`
   *
   */
  autoCompleteSuggestionType?: Extract<
    BaseInputProps['autoCompleteSuggestionType'],
    'none' | 'password' | 'newPassword'
  >;
};

type PasswordInputProps = Pick<
  BaseInputProps,
  | 'label'
  | 'labelPosition'
  | 'maxCharacters'
  | 'validationState'
  | 'errorText'
  | 'successText'
  | 'helpText'
  | 'isDisabled'
  | 'defaultValue'
  | 'placeholder'
  | 'isRequired'
  | 'value'
  | 'onChange'
  | 'onBlur'
  | 'onFocus'
  | 'name'
  | 'autoFocus'
  | 'keyboardReturnKeyType'
  | 'autoCompleteSuggestionType'
> &
  PasswordInputExtraProps &
  StyledProps;

const _PasswordInput: React.ForwardRefRenderFunction<BladeElementRef, PasswordInputProps> = (
  {
    label,
    labelPosition = 'top',
    showRevealButton = true,
    maxCharacters,
    validationState,
    errorText,
    successText,
    helpText,
    isDisabled = false,
    defaultValue,
    placeholder,
    isRequired = false,
    necessityIndicator = 'none',
    value,
    onChange,
    onFocus,
    onBlur,
    name,
    autoFocus = false,
    keyboardReturnKeyType = 'done',
    autoCompleteSuggestionType,
    ...styledProps
  },
  ref,
) => {
  const inputRef = useBladeInnerRef(ref);
  const [isRevealed, setIsRevealed] = React.useState(false);
  const isEnabled = !isDisabled;

  // If input is disabled reveal button shouldn't be present and input should be masked
  const isRevealedAndEnabled = isRevealed && isEnabled;

  const toggleIsRevealed = (): void => setIsRevealed((revealed) => !revealed);
  const accessibilityLabel = isRevealedAndEnabled ? 'Hide password' : 'Show password';
  const type = isRevealedAndEnabled ? 'text' : 'password';

  const revealButtonIcon = isRevealedAndEnabled ? EyeOffIcon : EyeIcon;
  const revealButton =
    showRevealButton && !isDisabled ? (
      <IconButton
        size="medium"
        icon={revealButtonIcon}
        onClick={toggleIsRevealed}
        accessibilityLabel={accessibilityLabel}
      />
    ) : null;

  const trailingFooterSlot = (value?: string): React.ReactNode =>
    maxCharacters ? (
      <BaseBox marginTop="spacing.2" marginRight="spacing.1">
        <CharacterCounter currentCount={value?.length ?? 0} maxCount={maxCharacters} />
      </BaseBox>
    ) : null;

  return (
    <BaseInput
      {...styledProps}
      ref={inputRef as React.Ref<HTMLInputElement>}
      componentName="password-input"
      id="password-field"
      label={label}
      labelPosition={labelPosition}
      type={type}
      interactionElement={revealButton}
      trailingFooterSlot={trailingFooterSlot}
      maxCharacters={maxCharacters}
      validationState={validationState}
      errorText={errorText}
      successText={successText}
      helpText={helpText}
      isDisabled={isDisabled}
      defaultValue={defaultValue}
      placeholder={placeholder}
      isRequired={isRequired}
      necessityIndicator={necessityIndicator}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      onFocus={onFocus}
      name={name}
      // eslint-disable-next-line jsx-a11y/no-autofocus
      autoFocus={autoFocus}
      autoCompleteSuggestionType={autoCompleteSuggestionType}
      keyboardReturnKeyType={keyboardReturnKeyType}
    />
  );
};

const PasswordInput = React.forwardRef(_PasswordInput);
// nosemgrep
PasswordInput.displayName = 'PasswordInput';

export { PasswordInputProps, PasswordInput };
