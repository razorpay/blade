import type { BaseInputProps } from './BaseInput';

export type StyledBaseInputProps = {
  handleOnChange?: HandleOnChange;
  hasLeadingIcon?: boolean;
  hasTrailingIcon?: boolean;
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
>;

export { StyledBaseInput } from './StyledBaseInput.web';
