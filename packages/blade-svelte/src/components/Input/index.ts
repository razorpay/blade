/**
 * Public input components. `BaseInput` and the `_Form` internals
 * (FormLabel/FormHint/CharacterCounter) are intentionally NOT re-exported —
 * they are implementation details consumed only by these leaves.
 */
export { TextInput } from './TextInput';
export type { TextInputProps, TextInputType } from './TextInput';

export { SearchInput } from './SearchInput';
export type { SearchInputProps } from './SearchInput';

export { OTPInput } from './OTPInput';
export type { OTPInputProps, OTPInputInstance, OTPInputOnEventWithIndex } from './OTPInput';

export { PhoneNumberInput } from './PhoneNumberInput';
export type {
  PhoneNumberInputProps,
  PhoneNumberInputInstance,
  PhoneNumberChangePayload,
} from './PhoneNumberInput';
