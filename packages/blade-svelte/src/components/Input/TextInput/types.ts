import type { Snippet, Component } from 'svelte';
import type { IconProps } from '../../Icons/types';
import type { BaseInputProps, FormInputOnEvent, FormInputKeyDownEvent } from '../BaseInput/types';

export type IconComponent = Component<IconProps>;

// Users should use PasswordInput for password type
type TextInputType = Exclude<BaseInputProps['type'], 'password'>;

export type TextInputProps = {
  /**
   * Label text
   */
  label?: string;

  /**
   * Accessibility label (required if no label)
   */
  accessibilityLabel?: string;

  /**
   * Label position
   * @default 'top'
   */
  labelPosition?: 'top' | 'left';

  /**
   * Label suffix element
   */
  labelSuffix?: Snippet;

  /**
   * Label trailing element
   */
  labelTrailing?: Snippet;

  /**
   * Necessity indicator
   * @default 'none'
   */
  necessityIndicator?: 'required' | 'optional' | 'none';

  /**
   * Validation state
   * @default 'none'
   */
  validationState?: 'none' | 'error' | 'success';

  /**
   * Help text
   */
  helpText?: string;

  /**
   * Error text
   */
  errorText?: string;

  /**
   * Success text
   */
  successText?: string;

  /**
   * Placeholder text
   */
  placeholder?: string;

  /**
   * Default value (uncontrolled)
   */
  defaultValue?: string;

  /**
   * Input name
   */
  name?: string;

  /**
   * Controlled value
   */
  value?: string;

  /**
   * Disabled state
   * @default false
   */
  isDisabled?: boolean;

  /**
   * Required state
   * @default false
   */
  isRequired?: boolean;

  /**
   * Prefix text
   */
  prefix?: string;

  /**
   * Suffix text
   */
  suffix?: string;

  /**
   * Maximum characters
   */
  maxCharacters?: number;

  /**
   * Auto focus
   * @default false
   */
  autoFocus?: boolean;

  /**
   * Keyboard return key type
   */
  keyboardReturnKeyType?: BaseInputProps['keyboardReturnKeyType'];

  /**
   * Autocomplete suggestion type
   */
  autoCompleteSuggestionType?: BaseInputProps['autoCompleteSuggestionType'];

  /**
   * Auto capitalize
   */
  autoCapitalize?: BaseInputProps['autoCapitalize'];

  /**
   * Test ID
   */
  testID?: string;

  /**
   * Input size
   * @default 'medium'
   */
  size?: 'xsmall' | 'small' | 'medium' | 'large';

  /**
   * Leading icon
   */
  leadingIcon?: IconComponent;

  /**
   * Trailing icon
   */
  trailingIcon?: IconComponent;

  /**
   * Input type
   * @default 'text'
   */
  type?: TextInputType;

  /**
   * Text alignment
   * @default 'left'
   */
  textAlign?: 'left' | 'center' | 'right';

  /**
   * Leading element (icon or custom element)
   */
  leading?: IconComponent | Snippet;

  /**
   * Trailing element (icon or custom element)
   */
  trailing?: IconComponent | Snippet;

  /**
   * Show clear button
   * @default false
   */
  showClearButton?: boolean;

  /**
   * Clear button click handler
   */
  onClearButtonClick?: () => void;

  /**
   * Loading state
   * @default false
   */
  isLoading?: boolean;

  /**
   * Trailing button (Link component)
   */
  trailingButton?: Snippet;

  /**
   * Format pattern for input formatting
   * @example "#### #### #### ####" for card numbers
   * @example "##/##" for expiry dates
   */
  format?: string;

  /**
   * Fired when the input value changes. Includes both the formatted `value`
   * and the raw user characters in `rawValue` when a `format` pattern is used.
   */
  onChange?: (event: FormInputOnEvent & { rawValue?: string }) => void;
  /**
   * Fired when the input receives focus.
   */
  onFocus?: (event: FormInputOnEvent) => void;
  /**
   * Fired when the input loses focus.
   */
  onBlur?: (event: FormInputOnEvent) => void;
  /**
   * Fired when the input is clicked.
   */
  onClick?: (event: FormInputOnEvent) => void;
  /**
   * Fired on key down. Includes the original `KeyboardEvent` for advanced use
   * cases (e.g. capturing the input element for cursor positioning).
   */
  onKeyDown?: (event: FormInputKeyDownEvent) => void;

  // ARIA props
  hasPopup?: BaseInputProps['hasPopup'];
  popupId?: string;
  isPopupExpanded?: boolean;
};
