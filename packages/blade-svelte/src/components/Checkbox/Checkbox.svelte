<script lang="ts">
  import { untrack } from 'svelte';
  import {
    metaAttribute,
    MetaConstants,
    makeAccessible,
    makeAnalyticsAttribute,
    getStyledPropsClasses,
  } from '@razorpay/blade-core/utils';
  import {
    getCheckboxIconWrapperClasses,
    getCheckboxLabelTextClasses,
    getCheckboxHelpTextClasses,
    getCheckboxErrorTextClasses,
    getCheckboxSupportingTextWrapperClasses,
    getCheckboxTemplateClasses,
  } from '@razorpay/blade-core/styles';
  import { getCheckboxGroupContext } from './CheckboxGroup/checkboxGroupContext';
  import type { CheckboxProps } from './types';

  const templateClasses = getCheckboxTemplateClasses();

  let {
    isChecked,
    defaultChecked,
    onChange,
    children,
    helpText,
    errorText,
    isIndeterminate = false,
    name,
    value,
    isDisabled = false,
    isRequired = false,
    validationState,
    size = 'medium',
    tabIndex,
    testID,
    ...rest
  }: CheckboxProps = $props();

  // ─── CheckboxGroup context ───────────────────────────────────────────────────

  const groupCtx = $derived(getCheckboxGroupContext());

  // Merge individual props with group context (group wins for shared props)
  const effectiveDisabled = $derived(isDisabled || groupCtx?.isDisabled || false);
  const effectiveRequired = $derived(
    isRequired || groupCtx?.isRequired || groupCtx?.necessityIndicator === 'required' || false,
  );
  const effectiveName = $derived(name ?? groupCtx?.name);
  const effectiveSize = $derived(groupCtx?.size ?? size);
  const effectiveValidationState = $derived(validationState ?? groupCtx?.validationState);
  const hasError = $derived(effectiveValidationState === 'error');

  // ─── Controlled / uncontrolled state ─────────────────────────────────────────

  let internalChecked = $state(untrack(() => defaultChecked) ?? false);

  const isControlled = $derived(isChecked !== undefined || groupCtx?.state !== undefined);

  const isCheckedState = $derived.by(() => {
    if (groupCtx?.state && value !== undefined) {
      return groupCtx.state.isChecked(value);
    }
    if (isChecked !== undefined) {
      return isChecked;
    }
    return internalChecked;
  });

  let inputEl: HTMLInputElement | undefined = $state();

  // ─── IDs for accessibility ────────────────────────────────────────────────────

  const idBase = `checkbox-${Math.random().toString(36).slice(2, 7)}`;
  const helpTextId = helpText ? `${idBase}-help` : undefined;
  const errorTextId = errorText ? `${idBase}-error` : undefined;
  const describedBy = [helpTextId, errorTextId].filter(Boolean).join(' ') || undefined;

  // ─── Event handlers ──────────────────────────────────────────────────────────

  function handleChange(event: Event): void {
    if (effectiveDisabled) return;
    const next = !isCheckedState;

    if (groupCtx?.state && value !== undefined) {
      if (next) {
        groupCtx.state.addValue(value);
      } else {
        groupCtx.state.removeValue(value);
      }
    } else if (!isControlled) {
      internalChecked = next;
    }

    onChange?.({ isChecked: next, value, event });

    // Keep DOM in sync with source-of-truth (mirrors Switch pattern)
    if (inputEl && inputEl.checked !== isCheckedState) {
      inputEl.checked = isCheckedState;
    }
  }

  // ─── Derived classes ──────────────────────────────────────────────────────────

  const iconWrapperClasses = $derived(
    getCheckboxIconWrapperClasses({
      size: effectiveSize,
      isChecked: isCheckedState && !isIndeterminate,
      isIndeterminate,
      isNegative: hasError,
    }),
  );

  const labelTextClasses = $derived(getCheckboxLabelTextClasses({ size: effectiveSize }));
  const helpTextClasses = $derived(getCheckboxHelpTextClasses({ size: effectiveSize }));
  const errorTextClasses = $derived(getCheckboxErrorTextClasses({ size: effectiveSize }));
  const supportingTextWrapperClasses = $derived(
    getCheckboxSupportingTextWrapperClasses({ size: effectiveSize }),
  );

  const styledProps = $derived(getStyledPropsClasses(rest));
  const wrapperClasses = $derived(
    [templateClasses.checkbox, ...(styledProps.classes || [])].filter(Boolean).join(' '),
  );
  const wrapperStyles = $derived(
    Object.entries(styledProps.inlineStyles || {})
      .map(([prop, val]) => `${prop}: ${val}`)
      .join('; ') || undefined,
  );

  const metaAttrs = $derived(metaAttribute({ name: MetaConstants.Checkbox, testID }));
  const labelMetaAttrs = metaAttribute({ name: MetaConstants.CheckboxLabel });
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));

  const inputA11y = $derived(
    makeAccessible({
      label: undefined, // label element wraps the input — no explicit aria-label needed
      checked: isCheckedState || isIndeterminate,
      disabled: effectiveDisabled,
      required: effectiveRequired,
    }),
  );

  // SVG size per checkbox size
  const svgSize = $derived.by(() => {
    if (effectiveSize === 'small') return 8;
    if (effectiveSize === 'large') return 16;
    return 12; // medium
  });

  const iconSvgClasses = $derived(templateClasses.iconSvg);
  const iconSvgVisibleClass = templateClasses.iconSvgVisible;

  const checkedIconClasses = $derived(
    [iconSvgClasses, isCheckedState && !isIndeterminate ? iconSvgVisibleClass : '']
      .filter(Boolean)
      .join(' '),
  );

  const indeterminateIconClasses = $derived(
    [iconSvgClasses, isIndeterminate ? iconSvgVisibleClass : ''].filter(Boolean).join(' '),
  );
</script>

<div class={wrapperClasses} style={wrapperStyles} {...metaAttrs} {...analyticsAttrs}>
  <label
    class={templateClasses.label}
    data-disabled={effectiveDisabled || undefined}
    {...labelMetaAttrs}
  >
    <input
      bind:this={inputEl}
      class={templateClasses.input}
      type="checkbox"
      {name}
      {value}
      checked={isCheckedState}
      disabled={effectiveDisabled}
      required={effectiveRequired}
      tabindex={tabIndex}
      aria-checked={isIndeterminate ? 'mixed' : isCheckedState}
      aria-describedby={describedBy}
      onchange={handleChange}
      {...inputA11y}
    />

    <div class={templateClasses.row}>
      <!-- Visible checkbox box with SVG icons -->
      <div
        class={iconWrapperClasses}
        data-disabled={effectiveDisabled || undefined}
        aria-hidden="true"
      >
        <!-- Checked icon -->
        <svg
          class={checkedIconClasses}
          width={svgSize}
          height={svgSize}
          viewBox="0 0 8 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M6.90237 1.76413C7.03254 1.89431 7.03254 2.10536 6.90237 2.23554L3.2357 5.90221C3.10553 6.03238 2.89447 6.03238 2.7643 5.90221L1.09763 4.23554C0.967456 4.10536 0.967456 3.89431 1.09763 3.76414C1.22781 3.63396 1.43886 3.63396 1.56904 3.76414L3 5.1951L6.43096 1.76413C6.56114 1.63396 6.77219 1.63396 6.90237 1.76413Z"
            fill="currentColor"
            stroke="currentColor"
            stroke-width="0.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>

        <!-- Indeterminate icon -->
        <svg
          class={indeterminateIconClasses}
          width={svgSize}
          height={svgSize}
          viewBox="0 0 8 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M1.3335 3.99984C1.3335 3.81574 1.48273 3.6665 1.66683 3.6665H6.3335C6.51759 3.6665 6.66683 3.81574 6.66683 3.99984C6.66683 4.18393 6.51759 4.33317 6.3335 4.33317H1.66683C1.48273 4.33317 1.3335 4.18393 1.3335 3.99984Z"
            fill="currentColor"
            stroke="currentColor"
            stroke-width="0.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>

      <!-- Label text -->
      {#if children}
        <span
          class={labelTextClasses}
          data-disabled={effectiveDisabled || undefined}
        >
          {@render children()}
        </span>
      {/if}
    </div>

    <!-- Help text — indented to align with label text -->
    {#if helpText}
      <div class={supportingTextWrapperClasses}>
        <span class={helpTextClasses} id={helpTextId}>{helpText}</span>
      </div>
    {/if}
  </label>

  <!-- Error text — outside label so it spans full width -->
  {#if hasError && errorText}
    <span class={errorTextClasses} id={errorTextId}>{errorText}</span>
  {/if}
</div>
