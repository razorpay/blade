<script context="module" lang="ts">
  // Fix #6: module-scope counter so each CheckboxGroup instance gets a unique ID prefix
  let idCounter = 0;
</script>

<script lang="ts">
  import {
    metaAttribute,
    MetaConstants,
    makeAccessible,
    makeAnalyticsAttribute,
    getStyledPropsClasses,
  } from '@razorpay/blade-core/utils';
  import {
    getCheckboxGroupFieldClasses,
    getCheckboxGroupLabelClasses,
    getCheckboxGroupItemsClasses,
    getCheckboxGroupHintClasses,
    getCheckboxTemplateClasses,
  } from '@razorpay/blade-core/styles';
  import { setCheckboxGroupContext } from './checkboxGroupContext';
  import type { CheckboxGroupProps, CheckboxGroupContextType, CheckboxGroupState } from './types';

  const templateClasses = getCheckboxTemplateClasses();

  let {
    children,
    label,
    helpText,
    errorText,
    validationState = 'none',
    necessityIndicator = 'none',
    isDisabled = false,
    isRequired = false,
    labelPosition = 'top',
    defaultValue,
    value: controlledValue,
    onChange,
    name,
    size = 'medium',
    orientation = 'vertical',
    testID,
    ...rest
  }: CheckboxGroupProps = $props();

  // ─── IDs ──────────────────────────────────────────────────────────────────────

  const idBase = `checkbox-group-${++idCounter}-${Math.random().toString(36).slice(2, 6)}`;
  const labelId = `${idBase}-label`;
  const hintId = `${idBase}-hint`;
  const fallbackName = name ?? idBase;

  // ─── Selection state ──────────────────────────────────────────────────────────

  const initialValue = (() => {
    if (controlledValue !== undefined) return [...controlledValue];
    if (defaultValue !== undefined) return [...defaultValue];
    return [];
  })();

  let checkedValues = $state<string[]>(initialValue);

  // Sync when controlled value changes
  $effect(() => {
    if (controlledValue !== undefined) {
      checkedValues = [...controlledValue];
    }
  });

  const groupState: CheckboxGroupState = {
    isChecked(val: string): boolean {
      return checkedValues.includes(val);
    },
    // Fix #4: capture next value locally so onChange receives the updated array
    addValue(val: string) {
      if (isDisabled) return;
      const next = checkedValues.includes(val) ? checkedValues : [...checkedValues, val];
      checkedValues = next;
      onChange?.({ values: next, name: fallbackName });
    },
    removeValue(val: string) {
      if (isDisabled) return;
      const next = checkedValues.filter((v) => v !== val);
      checkedValues = next;
      onChange?.({ values: next, name: fallbackName });
    },
  };

  // Fix #3: inline the object inside the getter so reactive prop reads happen at
  // call time — prop changes (isDisabled, validationState, size, etc.) are always
  // reflected in child Checkboxes instead of being frozen at mount time.
  setCheckboxGroupContext(() => ({
    name: fallbackName,
    isDisabled,
    isRequired,
    necessityIndicator,
    validationState,
    size,
    state: groupState,
    // Fix #7: pass hintId so children can include it in aria-describedby
    hintId: (validationState === 'error' && errorText) || helpText ? hintId : undefined,
  }));

  // ─── Derived UI state ─────────────────────────────────────────────────────────

  const showError = $derived(validationState === 'error' && errorText);
  const showHelpText = $derived(!showError && helpText);
  const showHint = $derived(showError || showHelpText);

  // ─── Classes ──────────────────────────────────────────────────────────────────

  const fieldClasses = $derived(getCheckboxGroupFieldClasses({ labelPosition }));
  const labelClasses = $derived(
    getCheckboxGroupLabelClasses({ size, labelPosition, necessityIndicator }),
  );
  const itemsClasses = $derived(getCheckboxGroupItemsClasses({ orientation, size }));
  const hintClasses = $derived(
    getCheckboxGroupHintClasses({
      size,
      type: showError ? 'error' : 'help',
    }),
  );

  const styledProps = $derived(getStyledPropsClasses(rest));
  const wrapperClasses = $derived(
    [templateClasses.groupWrapper, ...(styledProps.classes || [])].filter(Boolean).join(' '),
  );
  const wrapperStyles = $derived(
    Object.entries(styledProps.inlineStyles || {})
      .map(([prop, val]) => `${prop}: ${val}`)
      .join('; ') || undefined,
  );

  const metaAttrs = metaAttribute({ name: MetaConstants.CheckboxGroup, testID });
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
  const a11yAttrs = $derived(
    makeAccessible({
      role: 'group',
      labelledBy: label ? labelId : undefined,
    }),
  );
</script>

<div class={wrapperClasses} style={wrapperStyles} {...metaAttrs} {...analyticsAttrs}>
  <div class={fieldClasses} {...a11yAttrs}>
    {#if label}
      <span id={labelId} class={labelClasses}>{label}</span>
    {/if}

    <div>
      <div class={itemsClasses}>
        {@render children()}
      </div>

      <!-- Fix #7: hint span has a stable ID so child Checkboxes can reference it -->
      {#if showHint}
        <span id={hintId} class={hintClasses}>
          {showError ? errorText : helpText}
        </span>
      {/if}
    </div>
  </div>
</div>
