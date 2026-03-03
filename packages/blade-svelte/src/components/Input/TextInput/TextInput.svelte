<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { TextInputProps, IconComponent } from './types';
  import type { FormInputOnEvent, FormInputKeyDownEvent } from '../BaseInput/types';
  import { BaseInput } from '../BaseInput';
  import { IconButton } from '../../Button/IconButton';
  import { CloseIcon } from '../../Icons';
  import { Divider } from '../../Divider';
  import { CharacterCounter } from '../../Form';
  import Spinner from '../../Spinner/BaseSpinner/BaseSpinner.svelte';
  import { hintMarginTop } from '@razorpay/blade-core/styles';
  import { MetaConstants } from '@razorpay/blade-core/utils';
  import { createFormattedInputState } from './useFormattedInput.svelte';

  let {
    label,
    accessibilityLabel,
    labelPosition = 'top',
    labelSuffix,
    labelTrailing,
    necessityIndicator = 'none',
    validationState = 'none',
    helpText,
    errorText,
    successText,
    placeholder,
    defaultValue,
    name,
    value = $bindable(),
    isDisabled = false,
    isRequired = false,
    prefix,
    suffix,
    maxCharacters,
    autoFocus = false,
    keyboardReturnKeyType,
    autoCompleteSuggestionType,
    autoCapitalize,
    testID,
    size = 'medium',
    icon,
    leadingIcon,
    trailingIcon,
    type = 'text',
    textAlign = 'left',
    leading,
    trailing,
    showClearButton = false,
    onClearButtonClick,
    isLoading = false,
    trailingButton,
    format,
    hasPopup,
    popupId,
    isPopupExpanded,
    onChange,
    onFocus,
    onBlur,
    onClick,
    onKeyDown,
    onSubmit,
  }: TextInputProps = $props();

  // Warn about deprecated icon prop
  $effect(() => {
    if (icon) {
      console.warn(
        '[Blade: TextInput] The `icon` prop is deprecated. Use `leading` instead.',
      );
    }
  });

  // Validate format pattern in dev mode
  $effect(() => {
    if (format) {
      const hasAlphanumeric = /[a-zA-Z0-9]/.test(format);
      if (hasAlphanumeric) {
        throw new Error(
          `[Blade: TextInput] Invalid format "${format}". Only # and special characters are allowed — no letters or numbers.`,
        );
      }
    }
  });

  // Stable unique ID: use name if provided, else generate one at component init
  const instanceId = name ?? `textinput-${Math.random().toString(36).slice(2, 9)}`;

  // Reference to BaseInput
  let baseInputRef: BaseInput | undefined = $state();

  // Internal clear-button visibility
  let shouldShowClearButton = $state(false);

  // Formatting state — delegates all format logic to the shared utility
  const formatting = createFormattedInputState({ format, onChange, value, defaultValue });

  // Derived values
  const inputValue = $derived(format ? formatting.formattedValue : value);
  const effectiveMaxCharacters = $derived(format ? formatting.maxLength : maxCharacters);

  // Sync clear button visibility whenever inputValue or showClearButton changes
  $effect(() => {
    shouldShowClearButton = Boolean(showClearButton && (inputValue ?? defaultValue));
  });

  // Resolve leadingIcon: explicit prop > deprecated icon > leading if it's a component
  const _leadingIcon = $derived.by((): IconComponent | undefined => {
    if (leadingIcon) return leadingIcon;
    if (icon) return icon;
    if (leading && typeof leading === 'function' && 'name' in leading) {
      return leading as IconComponent;
    }
    return undefined;
  });

  const _trailingIcon = $derived.by((): IconComponent | undefined => {
    if (trailingIcon) return trailingIcon;
    if (trailing && typeof trailing === 'function' && 'name' in trailing) {
      return trailing as IconComponent;
    }
    return undefined;
  });

  // Custom snippet slots (non-icon leading/trailing)
  const hasLeadingInteractionElement = $derived(!_leadingIcon && Boolean(leading));
  const hasTrailingInteractionElement = $derived(!_trailingIcon && Boolean(trailing));

  // Event handlers
  function handleOnChange(event: FormInputOnEvent): void {
    if (format) {
      formatting.handleChange(event);
    } else {
      if (showClearButton && event.value?.length) {
        shouldShowClearButton = true;
      }
      if (shouldShowClearButton && !event.value?.length) {
        shouldShowClearButton = false;
      }
      if (value !== undefined) {
        value = event.value;
      }
      onChange?.(event);
    }
  }

  function handleOnFocus(event: FormInputOnEvent): void {
    onFocus?.(event);
  }

  function handleOnBlur(event: FormInputOnEvent): void {
    onBlur?.(event);
  }

  function handleOnKeyDown(event: FormInputKeyDownEvent): void {
    if (format) {
      formatting.handleKeyDown(event.event!);
    }
    onKeyDown?.(event);
  }

  function handleClearButtonClick(): void {
    baseInputRef?.clear();
    if (value !== undefined) {
      value = '';
    }
    onClearButtonClick?.();
    baseInputRef?.focus();
    shouldShowClearButton = false;
  }

  // Public imperative API
  export function focus(): void {
    baseInputRef?.focus();
  }

  export function blur(): void {
    baseInputRef?.blur();
  }

  export function clear(): void {
    handleClearButtonClick();
  }
</script>

<BaseInput
  bind:this={baseInputRef}
  id={instanceId}
  componentName={MetaConstants.TextInput}
  {name}
  {label}
  {accessibilityLabel}
  hideLabelText={!label}
  {labelPosition}
  {labelSuffix}
  {labelTrailing}
  {placeholder}
  {type}
  value={inputValue}
  defaultValue={format ? undefined : defaultValue}
  {isDisabled}
  {isRequired}
  {necessityIndicator}
  {validationState}
  {helpText}
  {errorText}
  {successText}
  {size}
  leadingIcon={_leadingIcon}
  trailingIcon={_trailingIcon}
  {prefix}
  {suffix}
  maxCharacters={effectiveMaxCharacters}
  {textAlign}
  {autoFocus}
  {autoCapitalize}
  {autoCompleteSuggestionType}
  {keyboardReturnKeyType}
  {hasPopup}
  {popupId}
  {isPopupExpanded}
  {trailingButton}
  {testID}
  {onSubmit}
  onChange={handleOnChange}
  onFocus={handleOnFocus}
  onBlur={handleOnBlur}
  onClick={onClick}
  onKeyDown={handleOnKeyDown}
>
  {#snippet leadingInteractionElement()}
    {#if hasLeadingInteractionElement && typeof leading === 'function'}
      {@render (leading as Snippet)()}
    {/if}
  {/snippet}

  {#snippet trailingInteractionElement()}
    {#if isLoading}
      <Spinner accessibilityLabel="Loading Content" color="primary" size="medium" />
    {:else if shouldShowClearButton && hasTrailingInteractionElement}
      <div style="display: flex; align-items: center; gap: 8px;">
        <IconButton
          icon={CloseIcon}
          size="medium"
          accessibilityLabel="Clear Input Content"
          isDisabled={isDisabled}
          onClick={handleClearButtonClick}
        />
        <Divider orientation="vertical" />
        {#if typeof trailing === 'function'}
          {@render (trailing as Snippet)()}
        {/if}
      </div>
    {:else if shouldShowClearButton}
      <IconButton
        icon={CloseIcon}
        size="medium"
        accessibilityLabel="Clear Input Content"
        isDisabled={isDisabled}
        onClick={handleClearButtonClick}
      />
    {:else if hasTrailingInteractionElement && typeof trailing === 'function'}
      {@render (trailing as Snippet)()}
    {/if}
  {/snippet}

  {#snippet trailingFooterSlot(currentValue)}
    {#if !format && effectiveMaxCharacters}
      <div style="margin-top: {hintMarginTop[size]}; margin-right: 4px;">
        <CharacterCounter
          currentCount={currentValue?.length ?? 0}
          maxCount={effectiveMaxCharacters}
          {size}
        />
      </div>
    {/if}
  {/snippet}
</BaseInput>
