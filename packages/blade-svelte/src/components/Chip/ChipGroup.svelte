<script lang="ts">
  import {
    metaAttribute,
    MetaConstants,
    makeAccessible,
    getStyledPropsClasses,
    makeAnalyticsAttribute,
  } from '@razorpay/blade-core/utils';
  import {
    getChipGroupFieldClasses,
    getChipGroupGapClasses,
    getChipGroupTemplateClasses,
    getChipGroupLabelSizeClass,
  } from '@razorpay/blade-core/styles';
  import { setChipGroupContext } from './chipContext';
  import type { ChipGroupProps, ChipGroupContextType, State } from './types';

  const templateClasses = getChipGroupTemplateClasses();

  let {
    children,
    label,
    accessibilityLabel,
    labelPosition = 'top',
    helpText,
    errorText,
    validationState = 'none',
    necessityIndicator = 'none',
    isDisabled = false,
    isRequired = false,
    name,
    defaultValue,
    value: controlledValue,
    onChange,
    selectionType = 'single',
    size = 'small',
    color = 'primary',
    testID,
    ...rest
  }: ChipGroupProps = $props();

  // ID generation
  let idCounter = 0;
  const idBase = `chip-group-${++idCounter}-${Math.random().toString(36).slice(2, 6)}`;
  const labelId = `${idBase}-label`;
  const fallbackName = name ?? idBase;

  // Selection state
  const initialValue = (() => {
    if (controlledValue !== undefined) {
      return Array.isArray(controlledValue) ? controlledValue : [controlledValue];
    }
    if (defaultValue !== undefined) {
      return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
    }
    return [];
  })();

  let checkedValues = $state<string[]>(initialValue);

  // Sync controlled value
  $effect(() => {
    if (controlledValue !== undefined) {
      checkedValues = Array.isArray(controlledValue) ? controlledValue : [controlledValue];
    }
  });

  const chipState: State = {
    get value() {
      return checkedValues;
    },
    isChecked(val: string): boolean {
      if (selectionType === 'single') {
        if (val === undefined || checkedValues === undefined) return false;
        return checkedValues[0] === val;
      }
      return checkedValues.includes(val);
    },
    addValue(val: string) {
      if (isDisabled) return;
      if (selectionType === 'single') {
        checkedValues = [val];
      } else if (!checkedValues.includes(val)) {
        checkedValues = [...checkedValues, val];
      }
      onChange?.({ values: checkedValues, name: fallbackName });
    },
    removeValue(val: string) {
      if (isDisabled) return;
      if (selectionType === 'single') {
        checkedValues = [];
      } else if (checkedValues.includes(val)) {
        checkedValues = checkedValues.filter((v) => v !== val);
      }
      onChange?.({ values: checkedValues, name: fallbackName });
    },
  };

  const contextValue: ChipGroupContextType = {
    isDisabled,
    isRequired,
    necessityIndicator,
    validationState,
    name: fallbackName,
    size,
    color,
    selectionType,
    state: chipState,
  };

  setChipGroupContext(() => contextValue);

  const showError = $derived(validationState === 'error' && errorText);
  const showHelpText = $derived(!showError && helpText);

  const fieldClasses = $derived(getChipGroupFieldClasses({ labelPosition }));
  const gapClasses = $derived(getChipGroupGapClasses({ size }));
  const labelSizeClass = $derived(getChipGroupLabelSizeClass(size));

  const styledProps = $derived(getStyledPropsClasses(rest));
  const combinedWrapperClasses = $derived(
    [...(styledProps.classes || [])].filter(Boolean).join(' ') || undefined,
  );

  const groupRole = $derived(selectionType === 'single' ? 'radiogroup' : 'group');
  const metaAttrs = metaAttribute({ name: MetaConstants.ChipGroup, testID });
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
  const a11yAttrs = $derived(
    makeAccessible({
      role: groupRole,
      labelledBy: label ? labelId : undefined,
      label: !label ? accessibilityLabel : undefined,
    }),
  );

  const necessityClass = $derived.by(() => {
    if (necessityIndicator === 'required') return templateClasses.necessityRequired;
    if (necessityIndicator === 'optional') return templateClasses.necessityOptional;
    return '';
  });
</script>

<div class={combinedWrapperClasses} {...metaAttrs} {...analyticsAttrs}>
  <div class={fieldClasses} {...a11yAttrs}>
    {#if label}
      <span
        id={labelId}
        class={[templateClasses.groupLabel, labelSizeClass, necessityClass]
          .filter(Boolean)
          .join(' ')}
      >
        {label}
        {#if accessibilityLabel}
          <span class={templateClasses.srOnly}>, {accessibilityLabel}</span>
        {/if}
      </span>
    {:else if accessibilityLabel}
      <span class={templateClasses.srOnly}>{accessibilityLabel}</span>
    {/if}
    <div>
      <div class={gapClasses}>
        {@render children()}
      </div>
      {#if showError}
        <span class={templateClasses.errorText}>{errorText}</span>
      {:else if showHelpText}
        <span class={templateClasses.helpText}>{helpText}</span>
      {/if}
    </div>
  </div>
</div>
