import type { ReactElement, ReactNode } from 'react';
import { useState } from 'react';
import type { BaseInputProps } from '../BaseInput';
import { BaseInput } from '../BaseInput';
import { EyeIcon, EyeOffIcon } from '~components/Icons';
import Box from '~components/Box';
import { CharacterCounter } from '~components/Form/CharacterCounter';
import { IconButton } from '~components/Button/IconButton';

type Maybe<Type> = Type | undefined;

type PasswordFieldExtraProps = {
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

type PasswordFieldProps = Pick<
  BaseInputProps,
  | 'id'
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
  PasswordFieldExtraProps;

const PasswordField = ({
  id,
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
}: PasswordFieldProps): ReactElement => {
  const [isRevealed, setIsRevealed] = useState(false);

  const toggleIsRevealed = (): void => setIsRevealed((revealed) => !revealed);
  const accessibilityLabel = isRevealed ? 'Hide password' : 'Show password';
  const type = isRevealed ? 'text' : 'password';

  const revealButtonIcon = isRevealed ? EyeOffIcon : EyeIcon;
  const revealButton = showRevealButton ? (
    <IconButton
      size="medium"
      icon={revealButtonIcon}
      onClick={toggleIsRevealed}
      accessibilityLabel={accessibilityLabel}
    />
  ) : null;

  const trailingFooterSlot = (value: Maybe<string>): Maybe<ReactNode> =>
    maxCharacters ? (
      <Box marginTop="spacing.2" marginRight="spacing.1">
        <CharacterCounter currentCount={value?.length ?? 0} maxCount={maxCharacters} />
      </Box>
    ) : null;

  return (
    <BaseInput
      id={id}
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

export { PasswordFieldProps, PasswordField };
