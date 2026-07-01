<script lang="ts">
  import { untrack } from 'svelte';
  import {
    metaAttribute,
    getStyledPropsClasses,
    makeAnalyticsAttribute,
  } from '@razorpay/blade-core/utils';
  import { formHintLeftLabelMarginLeft } from '@razorpay/blade-core/styles';
  import BaseInput from '../BaseInput/BaseInput.svelte';
  import FormLabel from '../_Form/FormLabel.svelte';
  import FormHint from '../_Form/FormHint.svelte';
  import { useFormId } from '../BaseInput/useFormId';
  import { getHintType } from '../BaseInput/utils';
  import type { FormInputOnKeyDownEvent } from '../BaseInput/types';
  import type { OTPInputProps } from './types';

  type BaseInputInstance = { focus: () => void; getInput: () => HTMLInputElement | null };

  let {
    label,
    accessibilityLabel,
    labelPosition = 'top',
    labelSuffix,
    labelTrailing,
    validationState = 'none',
    helpText,
    errorText,
    successText,
    name,
    onChange,
    onFocus,
    onBlur,
    onOTPFilled,
    value,
    isDisabled = false,
    autoFocus = false,
    keyboardReturnKeyType,
    keyboardType = 'decimal',
    placeholder,
    otpLength = 6,
    isMasked = false,
    autoCompleteSuggestionType = 'oneTimeCode',
    size = 'medium',
    testID,
    ...rest
  }: OTPInputProps = $props();

  const ids = useFormId('otp');
  const isControlled = untrack(() => value !== undefined);
  const isLabelLeftPositioned = $derived(labelPosition === 'left');

  const otpToArray = (code?: string): string[] => code?.split('') ?? Array(otpLength).fill('');

  let otpValue = $state<string[]>(untrack(() => otpToArray(value)));
  const inputEls: BaseInputInstance[] = $state([]);

  // Field values: when controlled, always mirror `value`; otherwise use state.
  const fieldValues = $derived(
    isControlled ? otpToArray(value) : otpValue,
  );

  const aggregateValue = $derived(isControlled ? (value ?? '') : otpValue.join(''));

  const hintType = $derived(getHintType({ validationState, hasHelpText: Boolean(helpText) }));

  const hintMarginLeft = $derived(
    isLabelLeftPositioned ? `${formHintLeftLabelMarginLeft[size]}px` : '0px',
  );

  const styledProps = $derived(getStyledPropsClasses(rest));
  const styledPropsStyle = $derived(
    Object.entries(styledProps.inlineStyles ?? {})
      .map(([prop, val]) => `${prop}: ${val}`)
      .join('; ') || undefined,
  );
  const metaAttrs = $derived(metaAttribute({ name: 'otpinput', testID }));
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));

  $effect(() => {
    const joined = isControlled ? (value ?? '') : otpValue.join('');
    if (joined.length >= otpLength) {
      onOTPFilled?.({ name, value: joined.slice(0, otpLength) });
    }
  });

  const focusOnOtpByIndex = (index: number): void => {
    const el = inputEls[index];
    el?.focus();
    el?.getInput()?.select();
  };

  const setOtpValueByIndex = (value: string, index: number): string => {
    const next = Array.from(otpValue);
    next[index] = value;
    otpValue = next;
    return next.join('');
  };

  const handleChange = (
    { value: v }: { name?: string; value?: string },
    currentOtpIndex: number,
  ): void => {
    if (v === ' ') return;

    if (isControlled) {
      const next = Array.from(value);
      next[currentOtpIndex] = v ?? '';
      otpValue = next;
      onChange?.({ name, value: next.join('') });
    } else if (v && v.trim().length > 1) {
      // Pasted / autofilled multi-char value.
      otpValue = Array.from(v);
      onChange?.({ name, value: v.trim().slice(0, otpLength) });
    } else if (otpValue[currentOtpIndex] !== v?.trim()) {
      const joined = setOtpValueByIndex(v?.trim() ?? '', currentOtpIndex);
      onChange?.({ name, value: joined });
    }
  };

  const handleInput = (
    { value: v }: { name?: string; value?: string },
    currentOtpIndex: number,
  ): void => {
    if (v && v.trim().length === 1) {
      focusOnOtpByIndex(currentOtpIndex + 1);
    }
  };

  const handleKeyDown = (
    { key, code, event }: Parameters<FormInputOnKeyDownEvent>[0],
    currentOtpIndex: number,
  ): void => {
    if (key === 'Backspace' || code === 'Backspace' || code === 'Delete' || key === 'Delete') {
      event.preventDefault?.();
      if (otpValue[currentOtpIndex]) {
        handleChange({ value: '' }, currentOtpIndex);
      } else {
        focusOnOtpByIndex(currentOtpIndex - 1);
        handleChange({ value: '' }, currentOtpIndex - 1);
      }
    } else if (key === 'ArrowLeft' || code === 'ArrowLeft') {
      event.preventDefault?.();
      focusOnOtpByIndex(currentOtpIndex - 1);
    } else if (key === 'ArrowRight' || code === 'ArrowRight') {
      event.preventDefault?.();
      focusOnOtpByIndex(currentOtpIndex + 1);
    } else if (key === ' ' || code === 'Space') {
      event.preventDefault?.();
    }
  };

  const getFieldType = (index: number): 'password' | 'text' => {
    if (!isMasked) return 'text';
    if (isControlled) return value ? 'password' : 'text';
    return otpValue[index] ? 'password' : 'text';
  };

  export function focus(index = 0): void {
    focusOnOtpByIndex(index);
  }

  const fieldIndexes = $derived(Array.from({ length: otpLength }, (_, i) => i));
</script>

<div class={(styledProps.classes ?? []).join(' ')} style={styledPropsStyle} {...metaAttrs} {...analyticsAttrs}>
  <div
    style={`display: flex; position: relative; flex-direction: ${isLabelLeftPositioned ? 'row' : 'column'}; ${isLabelLeftPositioned ? 'align-items: center;' : ''}`}
  >
    {#if label}
      <FormLabel
        as="label"
        position={labelPosition}
        htmlFor={`${ids.inputId}-0-input`}
        size={size === 'xsmall' ? 'small' : size}
        {labelSuffix}
        {labelTrailing}
      >
        {label}
      </FormLabel>
    {/if}
    <div style="display: flex; flex-direction: row;">
      <input hidden id={ids.inputId} {name} value={aggregateValue} readonly />
      {#each fieldIndexes as index (index)}
        <div style={`flex: 1; margin-left: ${index === 0 ? '0px' : 'var(--spacing-3)'};`}>
          <BaseInput
            bind:this={inputEls[index]}
            id={`${ids.inputId}-${index}`}
            autoFocus={autoFocus && index === 0}
            accessibilityLabel={`${index === 0 ? label ?? accessibilityLabel ?? '' : ''} character ${index + 1}`}
            label={label ?? ''}
            hideLabelText={true}
            hideFormHint={true}
            textAlign="center"
            {name}
            value={fieldValues[index] ?? ''}
            maxCharacters={(otpValue[index]?.length ?? 0) > 0 ? 1 : undefined}
            onChange={(e) => handleChange(e, index)}
            onFocus={(e) => onFocus?.({ ...e, inputIndex: index })}
            onBlur={(e) => onBlur?.({ ...e, inputIndex: index })}
            onInput={(e) => handleInput(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            {isDisabled}
            placeholder={Array.from(placeholder ?? '')[index] ?? ''}
            isRequired={true}
            {autoCompleteSuggestionType}
            {keyboardType}
            {keyboardReturnKeyType}
            {validationState}
            {successText}
            {errorText}
            {helpText}
            type={getFieldType(index)}
            {size}
            valueComponentType="heading"
          />
        </div>
      {/each}
    </div>
  </div>
  <div style={`margin-left: ${hintMarginLeft};`}>
    <FormHint
      type={hintType}
      {helpText}
      {errorText}
      {successText}
      helpTextId={ids.helpTextId}
      errorTextId={ids.errorTextId}
      successTextId={ids.successTextId}
      size={size === 'xsmall' ? 'small' : size}
    />
  </div>
</div>
