import type { BaseInputProps } from './BaseInput';

export type StyledBaseInputProps = {
  handleOnChange?: HandleOnChange;
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
>;

export { StyledBaseInput } from './StyledBaseInput.web';
