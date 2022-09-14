import type { ReactElement, ReactNode } from 'react';
import { useState } from 'react';
import type { BaseInputProps } from '../BaseInput';
import { BaseInput } from '../BaseInput';
import { EyeIcon, EyeOffIcon } from '~components/Icons';
import Box from '~components/Box';
import { CharacterCounter } from '~components/Form/CharacterCounter';
import { IconButton } from '~components/Button/IconButton';

type PasswordFieldExtraProps = {
  /**
   * Shows a reveal button to toggle password visibility
   *
   * @default true
   */
  showRevealButton?: boolean;
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
> &
  PasswordFieldExtraProps;

type Maybe<Type> = Type | undefined;

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
    />
  );
};

export { PasswordFieldProps, PasswordField };
