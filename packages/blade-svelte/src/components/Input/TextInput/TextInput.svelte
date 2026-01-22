<script lang="ts">
  import type { Snippet, Component } from 'svelte';
  import type { TextInputProps, IconComponent } from './types';
  import type { FormInputOnEvent, FormInputKeyDownEvent } from '../BaseInput/types';
  import { BaseInput } from '../BaseInput';
  import { IconButton } from '../../Button/IconButton';
  import { CloseIcon } from '../../Icons';
  import { Divider } from '../../Divider';
  import { CharacterCounter } from '../../Form';
  import Spinner from '../../Spinner/BaseSpinner/BaseSpinner.svelte';
  import { hintMarginTop } from '@razorpay/blade-core/styles';
  import { metaAttribute, MetaConstants } from '@razorpay/blade-core/utils';
  import { formatValue, stripPatternCharacters, isUserCharacter } from './useFormattedInput';
  import type { IconProps } from '../../Icons/types';

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
  }: TextInputProps = $props();

  // Reference to BaseInput
  let baseInputRef: BaseInput | undefined = $state();

  // Internal state for clear button visibility
  let shouldShowClearButton = $state(false);

  // Input focus state
  let isInputFocused = $state(autoFocus);

  // Formatted input state
  let formattedValue = $state('');
  let rawValue = $state('');
  let inputElement: HTMLInputElement | null = null;
  let cursorInfo: { position?: number; endOfSection?: boolean } = {};

  // Track if we're currently processing user input
  let isProcessingInput = false;

  // Initialize and sync formatted value
  // Only update when value changes from external source (not from user typing)
  $effect(() => {
    if (format && !isProcessingInput) {
      const initial = value ?? defaultValue ?? '';
      const raw = stripPatternCharacters(initial);
      const newFormatted = formatValue(raw, format);
      
      // Only update if the formatted result is different
      if (newFormatted !== formattedValue) {
        formattedValue = newFormatted;
        rawValue = raw;
      }
    }
  });

  // Update clear button visibility
  $effect(() => {
    const currentValue = format ? formattedValue : (value ?? defaultValue);
    shouldShowClearButton = Boolean(showClearButton && currentValue);
  });

  // Computed values
  const effectiveMaxCharacters = $derived(format ? format.length : maxCharacters);
  const inputValue = $derived(format ? formattedValue : value);

  // Determine leading/trailing icons from leading/trailing props
  const _leadingIcon = $derived.by(() => {
    if (leadingIcon) return leadingIcon;
    // Check if leading is an icon component (has name property typical of components)
    if (leading && typeof leading === 'function' && 'name' in leading) {
      return leading as IconComponent;
    }
    return undefined;
  });

  const _trailingIcon = $derived.by(() => {
    if (trailingIcon) return trailingIcon;
    if (trailing && typeof trailing === 'function' && 'name' in trailing) {
      return trailing as IconComponent;
    }
    return undefined;
  });

  // Check if leading/trailing are custom elements (snippets)
  const hasLeadingInteractionElement = $derived(
    !_leadingIcon && leading && typeof leading === 'function'
  );
  const hasTrailingInteractionElement = $derived(
    !_trailingIcon && trailing && typeof trailing === 'function'
  );

  // Format validation
  $effect(() => {
    if (format && typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      const hasAlphanumeric = /[a-zA-Z0-9]/.test(format);
      if (hasAlphanumeric) {
        console.error(
          `[Blade: TextInput] Invalid format "${format}". Only # and special characters allowed, no letters/numbers.`
        );
      }
    }
  });

  // Handle formatted input change
  function handleFormattedChange(event: FormInputOnEvent): void {
    if (!format) {
      handleOnChange(event);
      return;
    }

    // Mark that we're processing user input to prevent effect from interfering
    isProcessingInput = true;

    const inputVal = event.value ?? '';
    const currentValue = formattedValue;
    const cursorPosition = inputElement?.selectionStart ?? 0;
    const didDelete = inputVal.length < currentValue.length;

    cursorInfo.position = cursorPosition;

    let newRawValue = stripPatternCharacters(inputVal);

    // Handle delimiter deletion
    if (didDelete) {
      const deletedChar = currentValue[cursorPosition] ?? '';
      const deletedDelimiter = !isUserCharacter(deletedChar);

      if (deletedDelimiter) {
        const beforeCursor = inputVal.substring(0, cursorPosition);
        const afterCursor = inputVal.substring(cursorPosition);
        const rawBefore = stripPatternCharacters(beforeCursor);
        const rawAfter = stripPatternCharacters(afterCursor);

        newRawValue = rawBefore.slice(0, -1) + rawAfter;
        cursorInfo.position = beforeCursor.replace(/([\d\w]+)[^\dA-Za-z]+$/, '$1').length - 1;
      }
    }

    const newFormattedValue = formatValue(newRawValue, format);
    cursorInfo.endOfSection = false;

    // Handle cursor positioning when typing
    if (!didDelete) {
      const nextChar = newFormattedValue[cursorPosition];
      const nextIsDelimiter = nextChar ? !isUserCharacter(nextChar) : false;

      const remainingText = newFormattedValue.substring(cursorPosition);
      const nextUserCharIndex = remainingText.search(/[\dA-Za-z]/);
      const hasMoreUserChars = nextUserCharIndex !== -1;

      cursorInfo.endOfSection = nextIsDelimiter && !hasMoreUserChars;

      if (nextIsDelimiter && hasMoreUserChars) {
        const prevChar = newFormattedValue[cursorPosition - 1] ?? '';
        const prevIsDelimiter = !isUserCharacter(prevChar);

        if (prevIsDelimiter) {
          cursorInfo.position = cursorPosition + nextUserCharIndex + 1;
        } else {
          const delimiterExistedBefore =
            currentValue[cursorPosition] === newFormattedValue[cursorPosition];
          if (delimiterExistedBefore) {
            cursorInfo.position = cursorPosition + 1;
          }
        }
      }
    }

    formattedValue = newFormattedValue;
    rawValue = newRawValue;

    onChange?.({ name: event.name, value: newFormattedValue, rawValue: newRawValue });

    // Apply cursor position
    if (inputElement && cursorInfo.position !== undefined && !cursorInfo.endOfSection) {
      requestAnimationFrame(() => {
        inputElement?.setSelectionRange(cursorInfo.position!, cursorInfo.position!);
      });
    }

    // Reset flag after a microtask to allow effect to run for external changes
    queueMicrotask(() => {
      isProcessingInput = false;
    });
  }

  // Event handlers
  function handleOnChange(event: FormInputOnEvent): void {
    if (showClearButton && event.value?.length) {
      shouldShowClearButton = true;
    }

    if (shouldShowClearButton && !event.value?.length) {
      shouldShowClearButton = false;
    }

    if (format) {
      handleFormattedChange(event);
    } else {
      if (value !== undefined) {
        value = event.value;
      }
      onChange?.(event);
    }
  }

  function handleOnFocus(event: FormInputOnEvent): void {
    isInputFocused = true;
    onFocus?.(event);
  }

  function handleOnBlur(event: FormInputOnEvent): void {
    isInputFocused = false;
    onBlur?.(event);
  }

  function handleOnKeyDown(event: FormInputKeyDownEvent): void {
    // Capture input element for cursor positioning
    if (format && event.event?.currentTarget) {
      inputElement = event.event.currentTarget as HTMLInputElement;
    }
    onKeyDown?.(event);
  }

  function handleClearButtonClick(): void {
    baseInputRef?.clear();
    if (format) {
      formattedValue = '';
      rawValue = '';
    }
    if (value !== undefined) {
      value = '';
    }
    onClearButtonClick?.();
    baseInputRef?.focus();
    shouldShowClearButton = false;
  }

  // Export methods
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
  id={name ?? 'textinput'}
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
  isRequired={isRequired}
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
  onChange={handleOnChange}
  onFocus={handleOnFocus}
  onBlur={handleOnBlur}
  onClick={onClick}
  onKeyDown={handleOnKeyDown}
>
  {#snippet leadingInteractionElement()}
    {#if hasLeadingInteractionElement && typeof leading === 'function'}
      {@render leading()}
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
          {@render trailing()}
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
      {@render trailing()}
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

