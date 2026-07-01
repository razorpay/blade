import type { Snippet } from 'svelte';
import type { StyledPropsBlade, DataAnalyticsAttribute } from '@razorpay/blade-core/utils';
import type {
  BaseInputSize,
  LabelPosition,
  FormInputOnEvent,
  AutoCapitalize,
} from '../BaseInput/types';

export interface SearchInputProps extends StyledPropsBlade, DataAnalyticsAttribute {
  /** Label shown for the input. */
  label?: string;
  /** Accessibility label (required when `label` is absent). */
  accessibilityLabel?: string;
  /** Label position. @default 'top' */
  labelPosition?: LabelPosition;
  /** Suffix element rendered after the label text. */
  labelSuffix?: Snippet;
  /** Trailing element rendered at the end of the label row. */
  labelTrailing?: Snippet;
  /** Help text below the input. */
  helpText?: string;
  /** Placeholder text. */
  placeholder?: string;
  /** Uncontrolled default value. */
  defaultValue?: string;
  /** Controlled value. */
  value?: string;
  /** Name of the input. */
  name?: string;
  /** Change callback. */
  onChange?: FormInputOnEvent;
  /** Focus callback. */
  onFocus?: FormInputOnEvent;
  /** Blur callback. */
  onBlur?: FormInputOnEvent;
  /** Click callback. */
  onClick?: FormInputOnEvent;
  /** Click handler for the clear button. */
  onClearButtonClick?: () => void;
  /** Shows a loading spinner in the trailing slot. */
  isLoading?: boolean;
  /** Toggle visibility of the search icon. @default true */
  showSearchIcon?: boolean;
  /** Trailing element rendered at the end of the input. */
  trailing?: Snippet;
  /** Disables the input. */
  isDisabled?: boolean;
  /** Focus the input on mount. */
  autoFocus?: boolean;
  /** Autocapitalize behaviour. */
  autoCapitalize?: AutoCapitalize;
  /** Input size. @default 'medium' */
  size?: BaseInputSize;
  /** Test ID for the element. */
  testID?: string;
}
