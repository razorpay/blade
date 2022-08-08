import type { BaseInputProps } from './BaseInput';

export type StyledBaseInputProps = {
  handleOnChange?: HandleOnChange;
} & Pick<
  BaseInputProps,
  | 'type'
  | 'name'
  | 'placeholder'
  | 'defaultValue'
  | 'value'
  | 'isDisabled'
  | 'isRequired'
  | 'validationState'
>;

export { StyledBaseInput } from './StyledBaseInput.web';
