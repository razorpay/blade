<script lang="ts">
  import { untrack } from 'svelte';
  import type { HTMLInputAttributes } from 'svelte/elements';
  import {
    metaAttribute,
    makeAccessible,
    makeAnalyticsAttribute,
    getStyledPropsClasses,
  } from '@razorpay/blade-core/utils';
  import {
    getBaseInputWrapperClasses,
    getBaseInputClasses,
    getBaseInputTemplateClasses,
    baseInputBorderRadius,
    formHintLeftLabelMarginLeft,
  } from '@razorpay/blade-core/styles';
  import FormLabel from '../_Form/FormLabel.svelte';
  import FormHint from '../_Form/FormHint.svelte';
  import BaseInputVisuals from './BaseInputVisuals.svelte';
  import {
    getKeyboardAndAutocompleteProps,
    getAutoComplete,
    getEnterKeyHint,
    getInputMode,
    getDomType,
    getHintType,
    getDescribedByElementId,
  } from './utils';
  import type { BaseInputProps } from './types';
  import { getInputGroupContext } from '../../InputGroup/inputGroupContext';

  const templateClasses = getBaseInputTemplateClasses();

  let {
    as = 'input',
    id,
    label,
    labelPosition = 'top',
    necessityIndicator = 'none',
    labelSuffix,
    labelTrailing,
    placeholder,
    type = 'text',
    defaultValue,
    value,
    name,
    onFocus,
    onChange,
    onClick,
    onInput,
    onKeyDown,
    onPaste,
    onBlur,
    isDisabled = false,
    isRequired = false,
    leadingIcon,
    prefix,
    trailingInteractionElement,
    onTrailingInteractionElementClick,
    leadingInteractionElement,
    suffix,
    trailingIcon,
    maxCharacters,
    textAlign,
    autoFocus = false,
    keyboardType,
    keyboardReturnKeyType,
    autoCompleteSuggestionType,
    autoCapitalize,
    trailingHeaderSlot,
    trailingFooterSlot,
    helpText,
    errorText,
    successText,
    validationState = 'none',
    validationTextPlacement = 'outside',
    accessibilityLabel,
    labelId,
    hideLabelText = false,
    hideFormHint = false,
    componentName = 'base-input',
    size = 'medium',
    borderRadius,
    trailingButton,
    valueComponentType = 'text',
    showHintsAsTooltip = false,
    tabIndex,
    testID,
    ...rest
  }: BaseInputProps = $props();

  // When rendered inside an InputGroup, the group overrides size/isDisabled and
  // suppresses this input's own label + hint (mirrors React BaseInput.tsx).
  const inputGroupCtx = getInputGroupContext();
  const isInsideInputGroup = Boolean(inputGroupCtx);
  const effectiveSize = $derived(inputGroupCtx?.size ?? size);
  const effectiveDisabled = $derived(inputGroupCtx?.isDisabled ?? isDisabled);

  let inputEl: HTMLInputElement | HTMLTextAreaElement | null = $state(null);

  // Controlled vs uncontrolled: seed internal state from defaultValue once. When
  // `value` is provided the input is controlled and `currentValue` reads it.
  const isControlled = untrack(() => value !== undefined);
  let internalValue = $state(untrack(() => defaultValue ?? ''));
  const currentValue = $derived(isControlled ? (value ?? '') : internalValue);

  const hasLabel = $derived(Boolean(label));
  const isLabelLeftPositioned = $derived(labelPosition === 'left' && Boolean(label));
  const shouldRenderLabel = $derived(hasLabel && !hideLabelText && !isInsideInputGroup);

  const keyboardProps = $derived(
    getKeyboardAndAutocompleteProps({
      type: type === 'password' ? 'text' : type,
      keyboardReturnKeyType,
      autoCompleteSuggestionType,
      autoCapitalize,
    }),
  );

  // Explicit `keyboardType` overrides the type-derived inputmode (OTPInput).
  const resolvedInputMode = $derived(
    getInputMode(keyboardType ?? keyboardProps.keyboardType) as HTMLInputAttributes['inputmode'],
  );
  const domAutoComplete = $derived(
    getAutoComplete(keyboardProps.autoCompleteSuggestionType) as HTMLInputAttributes['autocomplete'],
  );
  const domEnterKeyHint = $derived(
    getEnterKeyHint(keyboardProps.keyboardReturnKeyType) as HTMLInputAttributes['enterkeyhint'],
  );

  const wrapperRadius = $derived(borderRadius ?? baseInputBorderRadius[effectiveSize]);

  const wrapperClasses = $derived(
    getBaseInputWrapperClasses({ validationState, borderRadius: wrapperRadius }),
  );

  // `__blade-base-input-wrapper` is the stable global hook the InputGroup
  // corner-rounding rules target. Harmless (unstyled) on standalone inputs.
  const inputWrapperClasses = $derived(`${wrapperClasses} __blade-base-input-wrapper`);

  const hasLeadingVisuals = $derived(
    Boolean(leadingInteractionElement) || Boolean(leadingIcon) || Boolean(prefix),
  );
  const hasInsideValidation = $derived(
    validationTextPlacement === 'inside' && validationState !== 'none',
  );
  const hasTrailingVisuals = $derived(
    Boolean(trailingInteractionElement) ||
      Boolean(suffix) ||
      Boolean(trailingIcon) ||
      Boolean(trailingButton) ||
      hasInsideValidation,
  );

  const inputClasses = $derived(
    getBaseInputClasses({
      size: effectiveSize,
      valueComponentType,
      hasLeadingVisual: hasLeadingVisuals,
      hasTrailingVisual: hasTrailingVisuals,
      textAlign,
    }),
  );

  const styledProps = $derived(getStyledPropsClasses(rest));
  const outerClasses = $derived(
    [templateClasses.outer, ...(styledProps.classes ?? [])].filter(Boolean).join(' '),
  );
  const outerStyles = $derived(
    Object.entries(styledProps.inlineStyles ?? {})
      .map(([prop, val]) => `${prop}: ${val}`)
      .join('; ') || undefined,
  );

  const fieldClasses = $derived(
    [templateClasses.field, isLabelLeftPositioned ? templateClasses.labelLeft : '']
      .filter(Boolean)
      .join(' '),
  );

  const focusRingClasses = $derived(
    [
      templateClasses.focusRingWrapper,
      wrapperRadius === 'medium' ? templateClasses.radiusMedium : '',
      '__blade-focus-ring-wrapper',
    ]
      .filter(Boolean)
      .join(' '),
  );

  const hintType = $derived(getHintType({ validationState, hasHelpText: Boolean(helpText) }));
  const showFormHintOutside = $derived(
    !hideFormHint && validationTextPlacement === 'outside',
  );

  // When the label is left-positioned the hint row sits below as a sibling of the
  // label|input row and is indented by the label column width so it aligns under
  // the input (mirrors React's `formHintLeftLabelMarginLeft`).
  const hintMarginLeft = $derived(
    isLabelLeftPositioned && !hideLabelText ? formHintLeftLabelMarginLeft[effectiveSize] : 0,
  );

  const inputIds = $derived({
    inputId: `${id}-input`,
    labelId: labelId ?? `${id}-label`,
    helpTextId: `${id}-helptext`,
    errorTextId: `${id}-errortext`,
    successTextId: `${id}-successtext`,
  });

  const describedBy = $derived(
    getDescribedByElementId({
      validationState,
      hasErrorText: Boolean(errorText),
      hasSuccessText: Boolean(successText),
      hasHelpText: Boolean(helpText),
      errorTextId: inputIds.errorTextId,
      successTextId: inputIds.successTextId,
      helpTextId: inputIds.helpTextId,
    }),
  );

  const a11yAttrs = $derived(
    makeAccessible({
      required: Boolean(isRequired),
      disabled: Boolean(effectiveDisabled),
      invalid: validationState === 'error',
      describedBy,
      label: shouldRenderLabel ? undefined : accessibilityLabel,
      labelledBy: shouldRenderLabel ? inputIds.labelId : undefined,
    }),
  );

  const metaAttrs = $derived(metaAttribute({ name: componentName, testID }));
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));

  const eventPayload = (target: HTMLInputElement | HTMLTextAreaElement) => ({
    name,
    value: target.value,
  });

  const handleInput = (event: Event) => {
    if (effectiveDisabled) return;
    const target = event.currentTarget as HTMLInputElement | HTMLTextAreaElement;
    if (!isControlled) {
      internalValue = target.value;
    }
    onInput?.(eventPayload(target));
  };

  const handleChange = (event: Event) => {
    if (effectiveDisabled) return;
    onChange?.(eventPayload(event.currentTarget as HTMLInputElement | HTMLTextAreaElement));
  };

  const handleFocus = (event: FocusEvent) => {
    if (effectiveDisabled) return;
    onFocus?.(eventPayload(event.currentTarget as HTMLInputElement | HTMLTextAreaElement));
  };

  const handleBlur = (event: FocusEvent) => {
    if (effectiveDisabled) return;
    onBlur?.(eventPayload(event.currentTarget as HTMLInputElement | HTMLTextAreaElement));
  };

  const handleClick = (event: MouseEvent) => {
    if (effectiveDisabled) return;
    onClick?.(eventPayload(event.currentTarget as HTMLInputElement | HTMLTextAreaElement));
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (effectiveDisabled) return;
    onKeyDown?.({ name, key: event.key, code: event.code, event });
  };

  const handlePaste = (event: ClipboardEvent) => {
    if (effectiveDisabled) return;
    onPaste?.(event);
  };

  const handleTrailingInteractionElementClick = () => {
    if (effectiveDisabled) return;
    onTrailingInteractionElementClick?.();
  };

  export function focus(): void {
    if (effectiveDisabled) return;
    inputEl?.focus();
  }
  export function getInput(): HTMLInputElement | null {
    return inputEl as HTMLInputElement | null;
  }

  $effect(() => {
    if (autoFocus) {
      untrack(() => inputEl)?.focus();
    }
  });
</script>

<div class={outerClasses} style={outerStyles} {...metaAttrs} {...analyticsAttrs}>
  <div class={fieldClasses}>
    {#if shouldRenderLabel}
      <div
        class={[templateClasses.labelRow, isLabelLeftPositioned ? templateClasses.labelLeft : '']
          .filter(Boolean)
          .join(' ')}
      >
        <FormLabel
          as="label"
          position={labelPosition}
          size={effectiveSize === 'xsmall' ? 'small' : effectiveSize}
          {necessityIndicator}
          id={inputIds.labelId}
          htmlFor={inputIds.inputId}
          {labelSuffix}
          {labelTrailing}
        >
          {label}
        </FormLabel>
        {#if trailingHeaderSlot}
          {@render trailingHeaderSlot(currentValue)}
        {/if}
      </div>
    {/if}

    <div class={templateClasses.field}>
      <div class={focusRingClasses}>
        <div
          class={inputWrapperClasses}
          data-disabled={effectiveDisabled ? '' : undefined}
        >
          <BaseInputVisuals
            visualType="leading"
            size={effectiveSize}
            isDisabled={effectiveDisabled}
            {leadingIcon}
            {prefix}
            {leadingInteractionElement}
          />

          {#if as === 'textarea'}
            <textarea
              bind:this={inputEl}
              class={inputClasses}
              id={inputIds.inputId}
              {name}
              {placeholder}
              value={currentValue}
              disabled={effectiveDisabled || undefined}
              required={isRequired || undefined}
              maxlength={maxCharacters}
              tabindex={tabIndex}
              autocomplete={domAutoComplete}
              autocapitalize={keyboardProps.autoCapitalize}
              enterkeyhint={domEnterKeyHint}
              inputmode={resolvedInputMode}
              oninput={handleInput}
              onchange={handleChange}
              onfocus={handleFocus}
              onblur={handleBlur}
              onclick={handleClick}
              onkeydown={handleKeyDown}
              onpaste={handlePaste}
              {...a11yAttrs}
            ></textarea>
          {:else}
            <input
              bind:this={inputEl}
              class={inputClasses}
              id={inputIds.inputId}
              type={getDomType(keyboardProps.type)}
              {name}
              {placeholder}
              value={currentValue}
              disabled={effectiveDisabled || undefined}
              required={isRequired || undefined}
              maxlength={maxCharacters}
              tabindex={tabIndex}
              autocomplete={domAutoComplete}
              autocapitalize={keyboardProps.autoCapitalize}
              enterkeyhint={domEnterKeyHint}
              inputmode={resolvedInputMode}
              oninput={handleInput}
              onchange={handleChange}
              onfocus={handleFocus}
              onblur={handleBlur}
              onclick={handleClick}
              onkeydown={handleKeyDown}
              onpaste={handlePaste}
              {...a11yAttrs}
            />
          {/if}

          <BaseInputVisuals
            visualType="trailing"
            size={effectiveSize}
            isDisabled={effectiveDisabled}
            {validationState}
            {trailingInteractionElement}
            onTrailingInteractionElementClick={handleTrailingInteractionElementClick}
            {suffix}
            {trailingIcon}
            {trailingButton}
            {showHintsAsTooltip}
            {errorText}
            {successText}
            {validationTextPlacement}
            errorTextId={inputIds.errorTextId}
            successTextId={inputIds.successTextId}
          />
        </div>
      </div>
    </div>
  </div>

  {#if !isInsideInputGroup && (showFormHintOutside || trailingFooterSlot)}
    <div
      class={[
        templateClasses.hintRow,
        showFormHintOutside && (helpText || errorText || successText)
          ? templateClasses.hasHint
          : templateClasses.noHint,
      ]
        .filter(Boolean)
        .join(' ')}
      style={hintMarginLeft ? `margin-left: ${hintMarginLeft}px` : undefined}
    >
      {#if showFormHintOutside}
        <FormHint
          type={hintType}
          size={effectiveSize === 'xsmall' ? 'small' : effectiveSize}
          {helpText}
          {errorText}
          {successText}
          helpTextId={inputIds.helpTextId}
          errorTextId={inputIds.errorTextId}
          successTextId={inputIds.successTextId}
        />
      {/if}
      {#if trailingFooterSlot}
        {@render trailingFooterSlot(currentValue)}
      {/if}
    </div>
  {/if}
</div>
