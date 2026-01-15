// Re-export Base components with their original names to ensure they're available
// when other components reference them at runtime
export { default as BaseText } from './Typography/BaseText/BaseText.svelte';
export { default as BaseButton } from './Button/BaseButton/BaseButton.svelte';
export { default as BaseSpinner } from './Spinner/BaseSpinner/BaseSpinner.svelte';
export { default as BaseAmount } from './Amount/BaseAmount/BaseAmount.svelte';
export { default as BaseLink } from './Link/BaseLink/BaseLink.svelte';

// Typography
export { default as Text } from './Typography/Text/Text.svelte';
export { default as Heading } from './Typography/Heading/Heading.svelte';
export { default as Code } from './Typography/Code/Code.svelte';

// Button
export { default as Button } from './Button/Button.svelte';
export { IconButton } from './Button/IconButton';
export type { IconButtonProps } from './Button/IconButton';

// Link
export { default as Link } from './Link/Link.svelte';

// Spinner (alias to BaseSpinner for backward compatibility)
export { default as Spinner } from './Spinner/BaseSpinner/BaseSpinner.svelte';

// Amount
export { default as Amount } from './Amount/Amount.svelte';

// Icons
export * from './Icons';

// BladeProvider
export * from './BladeProvider';

// Form
export { FormLabel, FormHint, CharacterCounter } from './Form';
export type { FormLabelProps, FormHintProps, CharacterCounterProps } from './Form';

// Input
export { BaseInput, TextInput } from './Input';
export type {
  BaseInputProps,
  TextInputProps,
  FormInputOnEvent,
  FormInputKeyDownEvent,
  ValidationState,
  InputSize,
} from './Input';

// Divider
export { Divider } from './Divider';
export type { DividerProps } from './Divider';
