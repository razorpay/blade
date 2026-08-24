<script lang="ts">
  import { untrack } from 'svelte';
  import { makeAnalyticsAttribute } from '@razorpay/blade-core/utils';
  import { useFormId } from '../BaseInput/useFormId';
  import BaseInput from '../BaseInput/BaseInput.svelte';
  import CharacterCounter from '../_Form/CharacterCounter.svelte';
  import IconButton from '../../Button/IconButton/IconButton.svelte';
  import Spinner from '../../Spinner/BaseSpinner/BaseSpinner.svelte';
  import { CloseIcon } from '../../Icons';
  import { useFormId } from '../BaseInput/useFormId';
  import { createFormattedInput } from './useFormattedInput';
  import type { TextInputProps } from './types';

  let {
    label,
    accessibilityLabel,
    labelPosition = 'top',
    labelSuffix,
    labelTrailing,
    necessityIndicator = 'none',
    placeholder,
    type = 'text',
    defaultValue,
    value,
    name,
    id,
    onChange,
    onFocus,
    onBlur,
    onClick,
    onKeyDown,
    isDisabled = false,
    isRequired = false,
    prefix,
    suffix,
    maxCharacters,
    autoFocus = false,
    keyboardReturnKeyType,
    autoCompleteSuggestionType,
    autoCapitalize,
    validationState = 'none',
    validationTextPlacement = 'outside',
    helpText,
    errorText,
    successText,
    size = 'medium',
    textAlign,
    showClearButton = false,
    onClearButtonClick,
    isLoading = false,
    leadingIcon,
    trailingIcon,
    trailingButton,
    leading,
    trailing,
    format,
    componentName = 'textinput',
    testID,
    ...rest
  }: TextInputProps = $props();

  const ids = useFormId('textinput', id);

  let baseInput = $state<{ focus: () => void; getInput: () => HTMLInputElement | null } | null>(
    null,
  );
  const ids = useFormId('textinput');

  const formatter = untrack(() =>
    format ? createFormattedInput({ pattern: format, onChange }) : null,
  );

  // Formatted display value (only used when `format` is set); seeded once.
  let formattedValue = $state(
    untrack(() => (formatter ? formatter.formatValue(value ?? defaultValue ?? '') : '')),
  );

  const effectiveMaxCharacters = $derived(format ? formatter?.maxLength : maxCharacters);

  // Clear button visibility mirrors React: shown once there is a value.
  let shouldShowClearButton = $state(
    untrack(() => Boolean(showClearButton && (defaultValue ?? value))),
  );

  const inputValue = $derived(format ? formattedValue : value);

  const handleChange = (payload: { name?: string; value?: string; rawValue?: string }) => {
    const v = payload.value;
    if (showClearButton) {
      if (v && v.length) {
        shouldShowClearButton = true;
      } else if (!v || !v.length) {
        shouldShowClearButton = false;
      }
    }

    if (format && formatter) {
      formattedValue = formatter.handleChange(
        { name: payload.name, value: v },
        formattedValue,
        baseInput?.getInput() ?? null,
      );
    } else {
      onChange?.(payload);
    }
  };

  const clearInput = () => {
    const el = baseInput?.getInput();
    if (el) {
      el.value = '';
      el.focus();
    }
    onClearButtonClick?.();
    baseInput?.focus();
    shouldShowClearButton = false;
    if (format && formatter) {
      formattedValue = formatter.formatValue('');
    }
  };

  const hasTrailingInteractionElement = $derived(Boolean(trailing));
  const showInteractionElement = $derived(isLoading || shouldShowClearButton || hasTrailingInteractionElement);

  export function focus(): void {
    baseInput?.focus();
  }
  export function getInput(): HTMLInputElement | null {
    return baseInput?.getInput() ?? null;
  }

  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
</script>

{#snippet trailingInteraction()}
  {#if isLoading}
    <Spinner accessibilityLabel="Loading Content" color="primary" size="medium" />
  {:else if shouldShowClearButton && hasTrailingInteractionElement}
    <IconButton icon={CloseIcon} size="medium" {isDisabled} accessibilityLabel="Clear Input Content" onClick={clearInput} />
    {@render trailing?.()}
  {:else if shouldShowClearButton}
    <IconButton icon={CloseIcon} size="medium" {isDisabled} accessibilityLabel="Clear Input Content" onClick={clearInput} />
  {:else if hasTrailingInteractionElement}
    {@render trailing?.()}
  {/if}
{/snippet}

{#snippet footerCounter(currentValue: string | undefined)}
  {#if !format && effectiveMaxCharacters}
    <CharacterCounter currentCount={currentValue?.length ?? 0} maxCount={effectiveMaxCharacters} {size} />
  {/if}
{/snippet}

<BaseInput
  bind:this={baseInput}
  id={ids.baseId}
  {componentName}
  label={label ?? ''}
  hideLabelText={!label}
  {accessibilityLabel}
  {labelPosition}
  {labelSuffix}
  {labelTrailing}
  {necessityIndicator}
  {placeholder}
  {type}
  defaultValue={format ? undefined : defaultValue}
  value={inputValue}
  {name}
  maxCharacters={effectiveMaxCharacters}
  onChange={handleChange}
  {onFocus}
  {onBlur}
  {onClick}
  {onKeyDown}
  {isDisabled}
  {isRequired}
  {prefix}
  {suffix}
  {leadingIcon}
  {trailingIcon}
  {trailingButton}
  leadingInteractionElement={leading}
  trailingInteractionElement={showInteractionElement ? trailingInteraction : undefined}
  {validationState}
  {validationTextPlacement}
  {helpText}
  {errorText}
  {successText}
  {size}
  {textAlign}
  {autoFocus}
  {keyboardReturnKeyType}
  {autoCompleteSuggestionType}
  {autoCapitalize}
  trailingFooterSlot={footerCounter}
  {testID}
  {...analyticsAttrs}
  {...rest}
/>
