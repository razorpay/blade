import type { Dispatch, SetStateAction } from 'react';
import type { BaseInputProps, HandleOnEvent } from './BaseInput';

export type StyledBaseInputProps = {
  handleOnChange?: HandleOnEvent;
  handleOnBlur?: HandleOnEvent;
  hasLeadingIcon?: boolean;
  hasTrailingIcon?: boolean;
  setIsFocused: Dispatch<SetStateAction<boolean>>;
} & Pick<
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
  | 'textAlign'
  | 'autoFocus'
  | 'keyboardReturnKeyType'
  | 'inputMode'
  | 'autoCompleteSuggestionType'
>;

export { StyledBaseInput } from './StyledBaseInput.web';
