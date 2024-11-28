import React from 'react';
import type { BaseInputProps } from '../BaseInput';
import { BaseInput } from '../BaseInput';
import { EyeIcon, EyeOffIcon } from '~components/Icons';
import BaseBox from '~components/Box/BaseBox';
import { CharacterCounter } from '~components/Form/CharacterCounter';
import { IconButton } from '~components/Button/IconButton';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { MetaConstants } from '~utils/metaAttribute';
import type { DataAnalyticsAttribute, BladeElementRef } from '~utils/types';

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

type PasswordInputCommonProps = Pick<
  BaseInputProps,
  | 'label'
  | 'accessibilityLabel'
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
  | 'onSubmit'
  | 'onFocus'
  | 'name'
  | 'autoFocus'
  | 'keyboardReturnKeyType'
  | 'autoCompleteSuggestionType'
  | 'testID'
  | 'size'
  | keyof DataAnalyticsAttribute
> &
  PasswordInputExtraProps &
  StyledPropsBlade;

/*
  Mandatory accessibilityLabel prop when label is not provided
*/
type PasswordInputPropsWithA11yLabel = {
  /**
   * Label to be shown for the input field
   */
  label?: undefined;
  /**
   * Accessibility label for the input
   */
  accessibilityLabel: string;
};

/*
  Optional accessibilityLabel prop when label is provided
*/
type PasswordInputPropsWithLabel = {
  /**
   * Label to be shown for the input field
   */
  label: string;
  /**
   * Accessibility label for the input
   */
  accessibilityLabel?: string;
};

type PasswordInputProps = (PasswordInputPropsWithA11yLabel | PasswordInputPropsWithLabel) &
  PasswordInputCommonProps;

const _PasswordInput: React.ForwardRefRenderFunction<BladeElementRef, PasswordInputProps> = (
  {
    label,
    accessibilityLabel,
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
    onSubmit,
    name,
    autoFocus = false,
    keyboardReturnKeyType = 'done',
    autoCompleteSuggestionType,
    testID,
    size = 'medium',
    ...rest
  },
  ref,
) => {
  const [isRevealed, setIsRevealed] = React.useState(false);
  const isEnabled = !isDisabled;

  // If input is disabled reveal button shouldn't be present and input should be masked
  const isRevealedAndEnabled = isRevealed && isEnabled;

  const toggleIsRevealed = (): void => setIsRevealed((revealed) => !revealed);
  const iconAccessibilityLabel = isRevealedAndEnabled ? 'Hide password' : 'Show password';
  const type = isRevealedAndEnabled ? 'text' : 'password';

  const revealButtonIcon = isRevealedAndEnabled ? EyeOffIcon : EyeIcon;
  const revealButton =
    showRevealButton && !isDisabled ? (
      <IconButton
        size="medium"
        icon={revealButtonIcon}
        onClick={toggleIsRevealed}
        accessibilityLabel={iconAccessibilityLabel}
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
      ref={ref}
      componentName={MetaConstants.PasswordInput}
      id="password-field"
      label={label as string}
      accessibilityLabel={accessibilityLabel}
      hideLabelText={!Boolean(label)}
      labelPosition={labelPosition}
      type={type}
      trailingInteractionElement={revealButton}
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
      onSubmit={onSubmit}
      onFocus={onFocus}
      name={name}
      // eslint-disable-next-line jsx-a11y/no-autofocus
      autoFocus={autoFocus}
      autoCompleteSuggestionType={autoCompleteSuggestionType}
      keyboardReturnKeyType={keyboardReturnKeyType}
      autoCapitalize="none"
      testID={testID}
      size={size}
      {...rest}
    />
  );
};

// nosemgrep
const PasswordInput = assignWithoutSideEffects(React.forwardRef(_PasswordInput), {
  displayName: 'PasswordInput',
});

export type { PasswordInputProps };
export { PasswordInput };
