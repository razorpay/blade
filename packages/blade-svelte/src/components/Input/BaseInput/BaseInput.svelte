<script lang="ts">
  import type { BaseInputProps, FormInputOnEvent, FormInputKeyDownEvent } from './types';
  import BaseInputWrapper from './BaseInputWrapper.svelte';
  import BaseInputVisuals from './BaseInputVisuals.svelte';
  import StyledBaseInput from './StyledBaseInput.svelte';
  import { FormLabel } from '../../Form/FormLabel';
  import { FormHint } from '../../Form/FormHint';
  import {
    getInputContainerClasses,
    getLabelRowClasses,
    getHintRowClasses,
    formHintLeftLabelMarginLeft,
  } from '@razorpay/blade-core/styles';
  import { metaAttribute, makeAccessible, makeAnalyticsAttribute } from '@razorpay/blade-core/utils';

  let {
    id,
    name,
    label,
    accessibilityLabel,
    labelPosition = 'top',
    placeholder,
    type = 'text',
    value = $bindable(),
    defaultValue,
    isDisabled = false,
    isRequired = false,
    validationState = 'none',
    helpText,
    errorText,
    successText,
    necessityIndicator = 'none',
    size = 'medium',
    leadingIcon,
    trailingIcon,
    prefix,
    suffix,
    maxCharacters,
    textAlign = 'left',
    autoFocus = false,
    autoCapitalize,
    autoCompleteSuggestionType,
    keyboardType,
    keyboardReturnKeyType,
    hideLabelText = false,
    hideFormHint = false,
    trailingInteractionElement,
    leadingInteractionElement,
    trailingButton,
    labelSuffix,
    labelTrailing,
    trailingHeaderSlot,
    trailingFooterSlot,
    testID,
    componentName,
    hasPopup,
    popupId,
    isPopupExpanded,
    activeDescendant,
    role,
    tabIndex,
    labelId,
    onChange,
    onFocus,
    onBlur,
    onClick,
    onInput,
    onKeyDown,
    ...rest
  }: BaseInputProps = $props();

  // Reference to the styled input
  let styledInputRef: StyledBaseInput | undefined = $state();

  // Internal value tracking
  let internalValue = $state(defaultValue ?? value ?? '');

  // Update internal value when controlled value changes
  $effect(() => {
    if (value !== undefined) {
      internalValue = value;
    }
  });

  // Generate IDs for accessibility
  const inputId = $derived(`${id}-input`);
  const helpTextId = $derived(`${id}-help`);
  const errorTextId = $derived(`${id}-error`);
  const successTextId = $derived(`${id}-success`);

  // Determine described by element
  const describedBy = $derived.by(() => {
    if (validationState === 'error' && errorText) return errorTextId;
    if (validationState === 'success' && successText) return successTextId;
    if (helpText) return helpTextId;
    return undefined;
  });

  // Determine if label is left positioned
  const isLabelLeftPositioned = $derived(labelPosition === 'left');

  // Determine necessity
  const _isRequired = $derived(isRequired || necessityIndicator === 'required');

  // Accessibility props
  const accessibilityProps = $derived(
    makeAccessible({
      required: _isRequired,
      disabled: isDisabled,
      invalid: validationState === 'error',
      describedBy,
      label: accessibilityLabel,
      hasPopup,
      expanded: hasPopup ? isPopupExpanded : undefined,
      controls: hasPopup ? popupId : undefined,
      role: role ?? (hasPopup ? 'combobox' : undefined),
      activeDescendant,
    })
  );

  // Check what visuals we have
  const hasLeadingIcon = $derived(Boolean(leadingIcon));
  const hasTrailingIcon = $derived(Boolean(trailingIcon));
  const hasPrefix = $derived(Boolean(prefix));
  const hasSuffix = $derived(Boolean(suffix));
  const hasTrailingInteractionElement = $derived(Boolean(trailingInteractionElement));
  const hasLeadingInteractionElement = $derived(Boolean(leadingInteractionElement));
  const hasTrailingButton = $derived(Boolean(trailingButton));

  // Will render hint text?
  const willRenderHintText = $derived(
    Boolean(helpText) ||
    (validationState === 'success' && Boolean(successText)) ||
    (validationState === 'error' && Boolean(errorText))
  );

  // Get hint type
  const hintType = $derived.by(() => {
    if (validationState === 'error') return 'error';
    if (validationState === 'success') return 'success';
    return 'help';
  });

  // CSS classes
  const containerClasses = $derived(getInputContainerClasses(isLabelLeftPositioned));
  const labelRowClasses = $derived(getLabelRowClasses(isLabelLeftPositioned));
  const hintRowClasses = getHintRowClasses();

  // Meta and analytics attributes
  const metaAttrs = metaAttribute({
    name: componentName,
    testID,
  });
  const analyticsAttrs = makeAnalyticsAttribute(rest);

  // Event handlers that update internal value
  function handleChange(event: FormInputOnEvent): void {
    if (event.value !== undefined) {
      internalValue = event.value;
      if (value !== undefined) {
        value = event.value;
      }
    }
    onChange?.(event);
  }

  function handleFocus(event: FormInputOnEvent): void {
    onFocus?.(event);
  }

  function handleBlur(event: FormInputOnEvent): void {
    onBlur?.(event);
  }

  function handleClick(event: FormInputOnEvent): void {
    onClick?.(event);
  }

  function handleInput(event: FormInputOnEvent): void {
    if (event.value !== undefined) {
      internalValue = event.value;
    }
    onInput?.(event);
  }

  function handleKeyDown(event: FormInputKeyDownEvent): void {
    onKeyDown?.(event);
  }

  function handleWrapperClick(): void {
    styledInputRef?.focus();
  }

  // Export methods
  export function focus(): void {
    styledInputRef?.focus();
  }

  export function blur(): void {
    styledInputRef?.blur();
  }

  export function clear(): void {
    styledInputRef?.clear();
    internalValue = '';
  }

  export function getInputElement(): HTMLInputElement | undefined {
    return styledInputRef?.getElement();
  }
</script>

<div 
  class={containerClasses} 
  style="display: flex; flex-direction: {isLabelLeftPositioned ? 'row' : 'column'}; width: 100%;"
  {...metaAttrs} 
  {...analyticsAttrs}
>
  <!-- Label and Header Slot -->
  {#if !hideLabelText && label}
    <div class={labelRowClasses}>
      <FormLabel
        as="label"
        htmlFor={inputId}
        id={labelId}
        position={labelPosition}
        {necessityIndicator}
        size={size}
        {labelSuffix}
        {labelTrailing}
      >
        {label}
      </FormLabel>
      {#if trailingHeaderSlot && !isLabelLeftPositioned}
        {@render trailingHeaderSlot(internalValue)}
      {/if}
    </div>
  {/if}

  <!-- Input and Hint Container (grouped together for left label layout) -->
  <div style="display: flex; flex-direction: column; flex: 1; width: {isLabelLeftPositioned ? 'auto' : '100%'};">
    <!-- Input Wrapper -->
    <BaseInputWrapper
      {isDisabled}
      {validationState}
      {size}
      onclick={handleWrapperClick}
    >
      {#snippet children()}
        <!-- Leading Visuals -->
        <BaseInputVisuals
          type="leading"
          {size}
          {isDisabled}
          {validationState}
          leadingIcon={leadingIcon}
          {prefix}
          {leadingInteractionElement}
        />

        <!-- Styled Input -->
        <StyledBaseInput
          bind:this={styledInputRef}
          id={inputId}
          {name}
          {type}
          bind:value
          {defaultValue}
          {placeholder}
          {isDisabled}
          isRequired={_isRequired}
          {maxCharacters}
          {textAlign}
          {autoFocus}
          {autoCapitalize}
          {autoCompleteSuggestionType}
          {keyboardType}
          {keyboardReturnKeyType}
          {size}
          {hasLeadingIcon}
          {hasPrefix}
          {hasTrailingIcon}
          {hasSuffix}
          {hasTrailingInteractionElement}
          {hasLeadingInteractionElement}
          {accessibilityProps}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onClick={handleClick}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
        />

        <!-- Trailing Visuals -->
        <BaseInputVisuals
          type="trailing"
          {size}
          {isDisabled}
          {validationState}
          trailingIcon={trailingIcon}
          {suffix}
          {trailingInteractionElement}
          {trailingButton}
          hasOtherTrailingElements={hasSuffix || hasTrailingIcon || hasTrailingButton}
        />
      {/snippet}
    </BaseInputWrapper>

    <!-- Hint and Footer Slot -->
    {#if !hideFormHint}
      <div 
        class={hintRowClasses}
        style="display: flex; flex-direction: row; justify-content: space-between; width: 100%;"
      >
        {#if willRenderHintText}
          <FormHint
            type={hintType}
            {helpText}
            {errorText}
            {successText}
            {helpTextId}
            {errorTextId}
            {successTextId}
            {size}
          />
        {/if}
        {#if trailingFooterSlot}
          <div style="margin-left: auto;">
            {@render trailingFooterSlot(internalValue)}
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>

