import type { Dispatch, SetStateAction } from 'react';
import type { BaseInputProps, HandleOnEvent } from './BaseInput';
import type { ActionStates } from '~tokens/theme/theme';

export type StyledBaseInputProps = Pick<
  BaseInputProps,
  | 'id'
  | 'name'
  | 'type'
  | 'placeholder'
  | 'defaultValue'
  | 'value'
  | 'isDisabled'
  | 'isRequired'
  | 'validationState'
  | 'leadingIcon'
  | 'prefix'
  | 'interactionElement'
  | 'suffix'
  | 'trailingIcon'
  | 'maxCharacters'
  | 'textAlign'
  | 'autoFocus'
  | 'keyboardType'
  | 'keyboardReturnKeyType'
  | 'autoCompleteSuggestionType'
> & {
  handleOnFocus?: HandleOnEvent;
  handleOnChange?: HandleOnEvent;
  handleOnBlur?: HandleOnEvent;
  hasLeadingIcon?: boolean;
  hasTrailingIcon?: boolean;
  accessibilityProps: Record<string, unknown>;
  currentInteraction: keyof ActionStates;
  setCurrentInteraction: Dispatch<SetStateAction<keyof ActionStates>>;
};

export { StyledBaseInput } from './StyledBaseInput.web';
