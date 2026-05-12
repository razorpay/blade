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

  let idCounter = 0;
  const idBase = `checkbox-group-${++idCounter}-${Math.random().toString(36).slice(2, 6)}`;
  const labelId = `${idBase}-label`;
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
    addValue(val: string) {
      if (isDisabled) return;
      if (!checkedValues.includes(val)) {
        checkedValues = [...checkedValues, val];
      }
      onChange?.({ values: checkedValues, name: fallbackName });
    },
    removeValue(val: string) {
      if (isDisabled) return;
      if (checkedValues.includes(val)) {
        checkedValues = checkedValues.filter((v) => v !== val);
      }
      onChange?.({ values: checkedValues, name: fallbackName });
    },
  };

  const contextValue: CheckboxGroupContextType = {
    name: fallbackName,
    isDisabled,
    isRequired,
    necessityIndicator,
    validationState,
    size,
    state: groupState,
  };

  setCheckboxGroupContext(() => contextValue);

  // ─── Derived UI state ─────────────────────────────────────────────────────────

  const showError = $derived(validationState === 'error' && errorText);
  const showHelpText = $derived(!showError && helpText);

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

      {#if showError}
        <span class={hintClasses}>{errorText}</span>
      {:else if showHelpText}
        <span class={hintClasses}>{helpText}</span>
      {/if}
    </div>
  </div>
</div>
