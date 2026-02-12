<script lang="ts">
  import {
    metaAttribute,
    MetaConstants,
    makeAccessible,
    getStyledPropsClasses,
    makeAnalyticsAttribute,
  } from '@razorpay/blade-core/utils';
  import {
    getChipTemplateClasses,
    getChipGroupFieldClasses,
    getChipGroupLabelClasses,
    getChipGroupContainerClasses,
    getChipGroupHintClasses,
  } from '@razorpay/blade-core/styles';
  import type { ChipGroupProps, ChipGroupContextType } from './types';
  import { setChipGroupContext } from './chipContext';
  import {
    generateChipGroupId,
    normalizeValue,
    createChipGroupState,
  } from './useChipGroup';

  // Prevent tree-shaking
  const cls = getChipTemplateClasses();

  let {
    accessibilityLabel,
    label,
    labelPosition = 'top',
    necessityIndicator = 'none',
    validationState = 'none',
    errorText,
    helpText,
    isRequired = false,
    children,
    isDisabled = false,
    name,
    defaultValue,
    onChange,
    value,
    size = 'small',
    color = 'primary',
    testID,
    selectionType = 'single',
    ...rest
  }: ChipGroupProps = $props();

  // Generate stable IDs
  const idBase = generateChipGroupId();
  const labelId = `${idBase}-label`;
  const fallbackName = name ?? idBase;

  // Internal reactive state for uncontrolled mode
  const normalizedDefault = normalizeValue(defaultValue, selectionType) ?? [];
  let internalValues: string[] = $state(normalizedDefault);

  // Determine if controlled
  const isControlled = $derived(value !== undefined);

  // The effective checked values
  const checkedValues = $derived.by((): string[] => {
    if (isControlled) {
      return normalizeValue(value, selectionType) ?? [];
    }
    return internalValues;
  });

  // Setter that handles both controlled and uncontrolled modes
  function setValues(newValues: string[]): void {
    if (!isControlled) {
      internalValues = newValues;
    }
    onChange?.({ values: newValues, name: fallbackName });
  }

  // Create the chip group state object reactively
  const chipGroupState = $derived(
    createChipGroupState({
      checkedValues,
      selectionType,
      isDisabled,
      onSetValues: setValues,
    }),
  );

  // Build the context value reactively
  const contextValue: ChipGroupContextType = $derived({
    isDisabled,
    isRequired,
    necessityIndicator,
    validationState,
    name: fallbackName,
    state: chipGroupState,
    size,
    color,
    selectionType,
  });

  // Provide context to child Chip components via getter for reactivity
  setChipGroupContext(() => contextValue);

  // Derived display logic
  const showError = $derived(validationState === 'error' && errorText);
  const showHelpText = $derived(!showError && helpText);

  // Accessibility role
  const groupRole = $derived(selectionType === 'single' ? 'radiogroup' : 'group');

  // Classes
  const fieldClasses = $derived(getChipGroupFieldClasses({ labelPosition }));
  const labelClasses = $derived(
    getChipGroupLabelClasses({ size, labelPosition, necessityIndicator }),
  );
  const containerClasses = $derived(getChipGroupContainerClasses({ size }));

  const hintClasses = $derived.by(() => {
    if (showError) {
      return getChipGroupHintClasses({ size, type: 'error' });
    }
    if (showHelpText) {
      return getChipGroupHintClasses({ size, type: 'help' });
    }
    return '';
  });

  // Styled props
  const styledProps = $derived(getStyledPropsClasses(rest));
  const outerClasses = $derived(
    (styledProps.classes || []).filter(Boolean).join(' ') || undefined,
  );

  // Meta & analytics
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));

  // Accessibility
  const a11yAttrs = $derived(
    makeAccessible({
      role: groupRole,
      labelledBy: label ? labelId : undefined,
      label: !label ? accessibilityLabel : undefined,
    }),
  );
</script>

<div
  class={outerClasses}
  {...metaAttribute({ name: MetaConstants.ChipGroup, testID })}
  {...analyticsAttrs}
>
  <div class={fieldClasses} {...a11yAttrs}>
    {#if label}
      <span
        class={labelClasses}
        id={labelId}
      >
        {label}
      </span>
    {/if}

    <div>
      {#if accessibilityLabel && !label}
        <span class={cls.srOnly}>{accessibilityLabel}</span>
      {/if}

      <div class={containerClasses}>
        {@render children()}
      </div>

      {#if showError}
        <span class={hintClasses} role="alert">
          {errorText}
        </span>
      {:else if showHelpText}
        <span class={hintClasses}>
          {helpText}
        </span>
      {/if}
    </div>
  </div>
</div>
