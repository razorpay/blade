import type { Snippet } from 'svelte';
import type { StyledPropsBlade, DataAnalyticsAttribute } from '@razorpay/blade-core/utils';
import type {
  BaseInputSize,
  BaseInputValidationState,
  BaseInputValueComponentType,
} from '@razorpay/blade-core/styles';
import type { IconComponent } from '../../Icons/iconMap';
import type { NecessityIndicator } from '../_Form/types';

export type { BaseInputSize, BaseInputValidationState, BaseInputValueComponentType };

/** Input DOM type. `password` is intentionally excluded from leaf inputs. */
export type BaseInputType =
  | 'text'
  | 'telephone'
  | 'email'
  | 'url'
  | 'number'
  | 'search'
  | 'password';

export type KeyboardType = 'text' | 'search' | 'telephone' | 'email' | 'url' | 'decimal';
export type KeyboardReturnKeyType =
  | 'default'
  | 'go'
  | 'done'
  | 'next'
  | 'previous'
  | 'search'
  | 'send';
export type AutoCompleteSuggestionType =
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
export type AutoCapitalize = 'none' | 'sentences' | 'words' | 'characters';
export type LabelPosition = 'top' | 'left';
export type ValidationTextPlacement = 'outside' | 'inside';

/**
 * Payload shape for input value events (`onChange`/`onFocus`/`onBlur`/`onInput`/
 * `onClick`). `value` is extracted from the DOM event internally; `rawValue` is
 * emitted by formatted inputs.
 */
export type FormInputOnEvent = (event: {
  name?: string;
  value?: string;
  rawValue?: string;
}) => void;

/** Payload shape for `onKeyDown` (web-only). */
export type FormInputOnKeyDownEvent = (event: {
  name?: string;
  key?: string;
  code?: string;
  event: KeyboardEvent;
}) => void;

/** Validation-related props shared across inputs. */
export type FormInputValidationProps = {
  /** Help text rendered below the input. */
  helpText?: string;
  /** Error text rendered below the input when `validationState` is `error`. */
  errorText?: string;
  /** Success text rendered below the input when `validationState` is `success`. */
  successText?: string;
  /**
   * Validation state — drives border color/width and hint.
   * @default 'none'
   */
  validationState?: BaseInputValidationState;
  /**
   * Placement of the validation text relative to the input.
   * @default 'outside'
   */
  validationTextPlacement?: ValidationTextPlacement;
};

/** Label-related props shared across inputs. */
export type FormInputLabelProps = {
  /** Label text for the input. */
  label?: string;
  /**
   * Label position. `left` is a desktop-only layout.
   * @default 'top'
   */
  labelPosition?: LabelPosition;
  /** Necessity indicator shown after the label text. */
  necessityIndicator?: NecessityIndicator;
  /** Suffix element rendered right after the label text. */
  labelSuffix?: Snippet;
  /** Trailing element rendered at the end of the label row. */
  labelTrailing?: Snippet;
};

/**
 * Imperative handle exposed via `bind:this`. Mirrors React's `BladeElementRef`.
 */
export interface BaseInputInstance {
  /** Move keyboard focus to the underlying input element. */
  focus: () => void;
  /** The underlying input element (or null before mount). */
  getInput: () => HTMLInputElement | null;
}

/**
 * Reduced, web-only BaseInput props. Tag-slot, dropdown-trigger, Table,
 * CounterInput, ChatInput and React-Native props are stripped (out of scope).
 */
export type BaseInputCommonProps = FormInputLabelProps &
  FormInputValidationProps &
  StyledPropsBlade &
  DataAnalyticsAttribute & {
    /** Element type. Only `input`/`textarea` are supported. @default 'input' */
    as?: 'input' | 'textarea';
    /** Id used for the input + accessibility wiring. */
    id: string;
    /** Placeholder text. */
    placeholder?: string;
    /** Input type. @default 'text' */
    type?: BaseInputType;
    /** Default value (uncontrolled). */
    defaultValue?: string;
    /** Controlled value. */
    value?: string;
    /** Name of the input (form submission). */
    name?: string;
    /** Focus callback. */
    onFocus?: FormInputOnEvent;
    /** Change callback. */
    onChange?: FormInputOnEvent;
    /** Click callback. */
    onClick?: FormInputOnEvent;
    /** Input callback (fires on every input event). */
    onInput?: FormInputOnEvent;
    /** KeyDown callback (web-only). */
    onKeyDown?: FormInputOnKeyDownEvent;
    /** Paste callback (web-only). */
    onPaste?: (event: ClipboardEvent) => void;
    /** Blur callback. */
    onBlur?: FormInputOnEvent;
    /** Disables the input. */
    isDisabled?: boolean;
    /** Marks the input required (adds `required`). */
    isRequired?: boolean;
    /** Leading icon component. */
    leadingIcon?: IconComponent;
    /** Prefix text rendered at the start of the input. */
    prefix?: string;
    /** Element rendered before the suffix (clear button / loader live here). */
    trailingInteractionElement?: Snippet;
    /** Click handler for the trailing interaction element. */
    onTrailingInteractionElementClick?: () => void;
    /** Element rendered before the prefix (e.g. a country selector). */
    leadingInteractionElement?: Snippet;
    /** Suffix text rendered at the end of the input. */
    suffix?: string;
    /** Trailing icon component. */
    trailingIcon?: IconComponent;
    /** Character counter limit; adds `maxlength`. */
    maxCharacters?: number;
    /** Text alignment of the input value. */
    textAlign?: 'left' | 'center' | 'right';
    /** Focuses the input on mount. */
    autoFocus?: boolean;
    /** Hints the platform which virtual keyboard to show (maps to `inputMode`). */
    keyboardType?: KeyboardType;
    /** Return-key type on virtual keyboards (maps to `enterkeyhint`). */
    keyboardReturnKeyType?: KeyboardReturnKeyType;
    /** Autocomplete suggestion type (maps to `autocomplete`). */
    autoCompleteSuggestionType?: AutoCompleteSuggestionType;
    /** Autocapitalize behaviour (maps to `autocapitalize`). */
    autoCapitalize?: AutoCapitalize;
    /** Trailing element rendered in the label row footer (e.g. a counter). */
    trailingHeaderSlot?: Snippet<[string | undefined]>;
    /** Trailing element rendered in the hint row footer (e.g. a counter). */
    trailingFooterSlot?: Snippet<[string | undefined]>;
    /** Accessibility label (required when `label` is absent). */
    accessibilityLabel?: string;
    /** Id of the label element. */
    labelId?: string;
    /** Hides the visible label text. */
    hideLabelText?: boolean;
    /** Hides the form hint row. */
    hideFormHint?: boolean;
    /** Component name for the `data-blade-component` attribute. */
    componentName?: string;
    /** Input size. @default 'medium' */
    size?: BaseInputSize;
    /** Override the wrapper border radius token. */
    borderRadius?: 'small' | 'medium';
    /** Trailing `Link`-style button (rendered via snippet). */
    trailingButton?: Snippet;
    /** Text vs heading rendering of the value. @default 'text' */
    valueComponentType?: BaseInputValueComponentType;
    /** Hides hints and shows them as a tooltip on the trailing icon. */
    showHintsAsTooltip?: boolean;
    /** Tab index of the input. */
    tabIndex?: number;
    /** Test ID for the outer wrapper. */
    testID?: string;
  };

export type BaseInputProps = BaseInputCommonProps;
