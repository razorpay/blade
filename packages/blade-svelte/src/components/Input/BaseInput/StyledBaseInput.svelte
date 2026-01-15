<script lang="ts">
  import type { StyledBaseInputProps, FormInputOnEvent, FormInputKeyDownEvent } from './types';
  import { getStyledInputClasses } from '@razorpay/blade-core/styles';
  import { metaAttribute, MetaConstants } from '@razorpay/blade-core/utils';

  let {
    id,
    name,
    type = 'text',
    value = $bindable(),
    defaultValue,
    placeholder,
    isDisabled = false,
    isRequired = false,
    maxCharacters,
    textAlign = 'left',
    autoFocus = false,
    autoCapitalize,
    autoCompleteSuggestionType,
    keyboardType,
    keyboardReturnKeyType,
    size = 'medium',
    hasLeadingIcon = false,
    hasPrefix = false,
    hasTrailingIcon = false,
    hasSuffix = false,
    hasTrailingInteractionElement = false,
    hasLeadingInteractionElement = false,
    accessibilityProps = {},
    onChange,
    onFocus,
    onBlur,
    onClick,
    onInput,
    onKeyDown,
  }: StyledBaseInputProps = $props();

  // Reference to the input element
  let inputElement: HTMLInputElement | undefined = $state();

  // Internal value for uncontrolled mode
  let internalValue = $state(defaultValue ?? '');

  // Determine if controlled or uncontrolled
  const isControlled = $derived(value !== undefined);

  // Get the current display value
  const displayValue = $derived(isControlled ? value : internalValue);

  // Autocomplete mapping
  const autoCompleteSuggestionTypeMap: Record<string, string> = {
    none: 'off',
    on: 'on',
    name: 'name',
    email: 'email',
    username: 'username',
    password: 'current-password',
    newPassword: 'new-password',
    oneTimeCode: 'one-time-code',
    telephone: 'tel',
    postalCode: 'postal-code',
    countryName: 'country',
    creditCardNumber: 'cc-number',
    creditCardCSC: 'cc-csc',
    creditCardExpiry: 'cc-exp',
    creditCardExpiryMonth: 'cc-exp-month',
    creditCardExpiryYear: 'cc-exp-year',
  };

  // Get autocomplete value
  const autocompleteValue = $derived(
    autoCompleteSuggestionType 
      ? autoCompleteSuggestionTypeMap[autoCompleteSuggestionType] 
      : undefined
  );

  // Get input mode from keyboard type
  const inputModeValue = $derived(
    keyboardType === 'telephone' ? 'tel' : keyboardType
  );

  // Get enter key hint
  const enterKeyHintValue = $derived(
    keyboardReturnKeyType === 'default' ? 'enter' : keyboardReturnKeyType
  );

  // CSS classes
  const inputClasses = $derived(
    getStyledInputClasses({
      size,
      hasLeadingIcon,
      hasPrefix,
      hasTrailingIcon,
      hasSuffix,
      hasTrailingInteractionElement,
      hasLeadingInteractionElement,
      textAlign,
      isDisabled,
    })
  );

  // Meta attributes
  const metaAttrs = metaAttribute({
    name: MetaConstants.StyledBaseInput,
  });

  // Event handlers
  function handleChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const newValue = target.value;

    if (!isControlled) {
      internalValue = newValue;
    }

    onChange?.({ name, value: newValue });
  }

  function handleInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    onInput?.({ name, value: target.value });
  }

  function handleFocus(event: FocusEvent): void {
    const target = event.target as HTMLInputElement;
    onFocus?.({ name, value: target.value });
  }

  function handleBlur(event: FocusEvent): void {
    const target = event.target as HTMLInputElement;
    onBlur?.({ name, value: target.value });
  }

  function handleClick(event: MouseEvent): void {
    const target = event.target as HTMLInputElement;
    onClick?.({ name, value: target.value });
  }

  function handleKeyDown(event: KeyboardEvent): void {
    onKeyDown?.({
      name,
      key: event.key,
      code: event.code,
      event,
    });
  }

  // Export methods for parent access
  export function focus(): void {
    inputElement?.focus();
  }

  export function blur(): void {
    inputElement?.blur();
  }

  export function clear(): void {
    if (!isControlled) {
      internalValue = '';
    }
    if (inputElement) {
      inputElement.value = '';
    }
  }

  export function getElement(): HTMLInputElement | undefined {
    return inputElement;
  }
</script>

<input
  bind:this={inputElement}
  {id}
  {name}
  type={type === 'telephone' ? 'tel' : type}
  value={displayValue}
  {placeholder}
  disabled={isDisabled}
  required={isRequired}
  maxlength={maxCharacters}
  autocomplete={autocompleteValue}
  autocapitalize={autoCapitalize}
  inputmode={inputModeValue}
  enterkeyhint={enterKeyHintValue}
  autofocus={autoFocus}
  class={inputClasses}
  oninput={handleInput}
  onchange={handleChange}
  onfocus={handleFocus}
  onblur={handleBlur}
  onclick={handleClick}
  onkeydown={handleKeyDown}
  {...accessibilityProps}
  {...metaAttrs}
/>

