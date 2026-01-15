import type { Snippet, Component } from 'svelte';
import type { IconProps } from '../../Icons/types';

// Icon component type
export type IconComponent = Component<IconProps>;

// Event types matching React Blade signature
export type FormInputOnEvent = {
  name?: string;
  value?: string;
};

export type FormInputKeyDownEvent = {
  name?: string;
  key?: string;
  code?: string;
  event?: KeyboardEvent;
};

// Validation state
export type ValidationState = 'none' | 'error' | 'success';

// Input sizes
export type InputSize = 'xsmall' | 'small' | 'medium' | 'large';

// Base input props
export type BaseInputProps = {
  /**
   * Unique ID for the input
   */
  id: string;

  /**
   * Input name for forms
   */
  name?: string;

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
   * Placeholder text
   */
  placeholder?: string;

  /**
   * Input type
   * @default 'text'
   */
  type?: 'text' | 'telephone' | 'email' | 'url' | 'number' | 'search' | 'password';

  /**
   * Controlled value
   */
  value?: string;

  /**
   * Default value (uncontrolled)
   */
  defaultValue?: string;

  /**
   * Disabled state
   */
  isDisabled?: boolean;

  /**
   * Required state
   */
  isRequired?: boolean;

  /**
   * Validation state
   * @default 'none'
   */
  validationState?: ValidationState;

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
   * Necessity indicator
   * @default 'none'
   */
  necessityIndicator?: 'required' | 'optional' | 'none';

  /**
   * Input size
   * @default 'medium'
   */
  size?: InputSize;

  /**
   * Leading icon component
   */
  leadingIcon?: IconComponent;

  /**
   * Trailing icon component
   */
  trailingIcon?: IconComponent;

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
   * Text alignment
   * @default 'left'
   */
  textAlign?: 'left' | 'center' | 'right';

  /**
   * Auto focus on mount
   */
  autoFocus?: boolean;

  /**
   * Autocomplete suggestion type
   */
  autoCompleteSuggestionType?: 
    | 'none'
    | 'on'
    | 'name'
    | 'email'
    | 'username'
    | 'password'
    | 'newPassword'
    | 'oneTimeCode'
    | 'telephone'
    | 'postalCode'
    | 'countryName'
    | 'creditCardNumber'
    | 'creditCardCSC'
    | 'creditCardExpiry'
    | 'creditCardExpiryMonth'
    | 'creditCardExpiryYear';

  /**
   * Auto capitalize
   */
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';

  /**
   * Keyboard return key type
   */
  keyboardReturnKeyType?: 'default' | 'go' | 'done' | 'next' | 'previous' | 'search' | 'send';

  /**
   * Keyboard type (for mobile)
   */
  keyboardType?: 'text' | 'search' | 'telephone' | 'email' | 'url' | 'decimal';

  /**
   * Hide label text visually
   */
  hideLabelText?: boolean;

  /**
   * Hide form hint
   */
  hideFormHint?: boolean;

  /**
   * Trailing interaction element (e.g., clear button)
   */
  trailingInteractionElement?: Snippet;

  /**
   * Leading interaction element
   */
  leadingInteractionElement?: Snippet;

  /**
   * Trailing button (Link component)
   */
  trailingButton?: Snippet;

  /**
   * Label suffix (e.g., tooltip)
   */
  labelSuffix?: Snippet;

  /**
   * Label trailing element
   */
  labelTrailing?: Snippet;

  /**
   * Trailing header slot
   */
  trailingHeaderSlot?: Snippet<[string | undefined]>;

  /**
   * Trailing footer slot
   */
  trailingFooterSlot?: Snippet<[string | undefined]>;

  /**
   * Test ID for testing
   */
  testID?: string;

  /**
   * Component name for analytics
   */
  componentName?: string;

  // Event handlers
  onChange?: (event: FormInputOnEvent) => void;
  onFocus?: (event: FormInputOnEvent) => void;
  onBlur?: (event: FormInputOnEvent) => void;
  onClick?: (event: FormInputOnEvent) => void;
  onInput?: (event: FormInputOnEvent) => void;
  onKeyDown?: (event: FormInputKeyDownEvent) => void;

  // ARIA props
  hasPopup?: 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog' | boolean;
  popupId?: string;
  isPopupExpanded?: boolean;
  activeDescendant?: string;
  role?: string;
  tabIndex?: number;

  /**
   * Label ID
   */
  labelId?: string;
};

// Styled input specific props
export type StyledBaseInputProps = {
  id: string;
  name?: string;
  type?: BaseInputProps['type'];
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  maxCharacters?: number;
  textAlign?: 'left' | 'center' | 'right';
  autoFocus?: boolean;
  autoCapitalize?: BaseInputProps['autoCapitalize'];
  autoCompleteSuggestionType?: BaseInputProps['autoCompleteSuggestionType'];
  keyboardType?: BaseInputProps['keyboardType'];
  keyboardReturnKeyType?: BaseInputProps['keyboardReturnKeyType'];
  size: InputSize;
  hasLeadingIcon?: boolean;
  hasPrefix?: boolean;
  hasTrailingIcon?: boolean;
  hasSuffix?: boolean;
  hasTrailingInteractionElement?: boolean;
  hasLeadingInteractionElement?: boolean;
  accessibilityProps?: Record<string, unknown>;
  onChange?: (event: FormInputOnEvent) => void;
  onFocus?: (event: FormInputOnEvent) => void;
  onBlur?: (event: FormInputOnEvent) => void;
  onClick?: (event: FormInputOnEvent) => void;
  onInput?: (event: FormInputOnEvent) => void;
  onKeyDown?: (event: FormInputKeyDownEvent) => void;
};

// Input wrapper props
export type BaseInputWrapperProps = {
  isDisabled?: boolean;
  validationState?: ValidationState;
  isFocused?: boolean;
  isHovered?: boolean;
  size: InputSize;
  isTextArea?: boolean;
  children?: Snippet;
};

// Input visuals props
export type BaseInputVisualsProps = {
  type: 'leading' | 'trailing';
  size: InputSize;
  isDisabled?: boolean;
  validationState?: ValidationState;
  leadingIcon?: IconComponent;
  trailingIcon?: IconComponent;
  prefix?: string;
  suffix?: string;
  trailingInteractionElement?: Snippet;
  leadingInteractionElement?: Snippet;
  trailingButton?: Snippet;
  hasOtherTrailingElements?: boolean;
};

