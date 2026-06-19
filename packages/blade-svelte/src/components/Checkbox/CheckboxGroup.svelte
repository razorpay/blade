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
    getCheckboxGroupFieldClasses,
    getCheckboxGroupOptionsClasses,
    getCheckboxGroupLabelSizeClass,
    getCheckboxGroupTemplateClasses,
    getCheckboxHintClasses,
  } from '@razorpay/blade-core/styles';
  import { InfoIcon } from '../Icons';
  import { setCheckboxGroupContext } from './checkboxContext';
  import type { CheckboxGroupProps, CheckboxGroupContextType, State } from './types';

  const templateClasses = getCheckboxGroupTemplateClasses();

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
    flexWrap = 'nowrap',
    labelSuffix,
    labelTrailing,
    testID,
    ...rest
  }: CheckboxGroupProps = $props();

  // ── ids ── (initial-only reads of `name`)
  const idBase = `checkbox-group-${Math.random().toString(36).slice(2, 8)}`;
  const labelId = `${idBase}-label`;
  const fallbackName = untrack(() => name) ?? idBase;

  // ── Controllable value[] (Chip pattern) ── (initial-only seed)
  const initialValue = untrack(() => controlledValue ?? defaultValue ?? []);
  let checkedValues = $state<string[]>([...initialValue]);

  $effect(() => {
    if (controlledValue !== undefined) {
      checkedValues = [...controlledValue];
    }
  });

  const groupState: State = {
    get value() {
      return checkedValues;
    },
    isChecked(val: string): boolean {
      return checkedValues.includes(val);
    },
    addValue(val: string) {
      if (isDisabled) return;
      if (!checkedValues.includes(val)) {
        checkedValues = [...checkedValues, val];
      }
      onChange?.({ name: fallbackName, values: checkedValues });
    },
    removeValue(val: string) {
      if (isDisabled) return;
      if (checkedValues.includes(val)) {
        checkedValues = checkedValues.filter((existing) => existing !== val);
      }
      onChange?.({ name: fallbackName, values: checkedValues });
    },
  };

  const contextValue: CheckboxGroupContextType = {
    get validationState() {
      return validationState;
    },
    get isDisabled() {
      return isDisabled;
    },
    get isRequired() {
      return isRequired;
    },
    get labelPosition() {
      return labelPosition;
    },
    get name() {
      return fallbackName;
    },
    get necessityIndicator() {
      return necessityIndicator;
    },
    get size() {
      return size;
    },
    state: groupState,
  };

  setCheckboxGroupContext(() => contextValue);

  const showError = $derived(validationState === 'error' && Boolean(errorText));
  const showHelpText = $derived(!showError && Boolean(helpText));

  // React FormHint icon sizing: small/medium hint -> 'small', large -> 'medium'.
  const hintIconSize = $derived(size === 'large' ? 'medium' : 'small');

  const fieldClasses = $derived(getCheckboxGroupFieldClasses({ labelPosition }));
  const optionsClasses = $derived(getCheckboxGroupOptionsClasses({ orientation, size, flexWrap }));
  const labelSizeClass = $derived(getCheckboxGroupLabelSizeClass(size));
  const hintClasses = $derived(
    getCheckboxHintClasses({ size, type: validationState === 'error' ? 'error' : 'help' }),
  );

  const necessityClass = $derived(
    necessityIndicator === 'required'
      ? templateClasses.necessityRequired
      : necessityIndicator === 'optional'
        ? templateClasses.necessityOptional
        : '',
  );

  const styledProps = $derived(getStyledPropsClasses(rest));
  const wrapperClasses = $derived(
    [...(styledProps.classes || [])].filter(Boolean).join(' ') || undefined,
  );
  const wrapperStyles = $derived(
    Object.entries(styledProps.inlineStyles || {})
      .map(([prop, val]) => `${prop}: ${val}`)
      .join('; ') || undefined,
  );

  const metaAttrs = $derived(metaAttribute({ name: MetaConstants.CheckboxGroup, testID }));
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
      <span
        id={labelId}
        class={[templateClasses.groupLabel, labelSizeClass].filter(Boolean).join(' ')}
      >
        <span class={[templateClasses.labelRow].join(' ')}>
          <span class={necessityClass}>{label}</span>
          {#if labelSuffix}
            <span class={templateClasses.labelSuffix}>{@render labelSuffix()}</span>
          {/if}
          {#if labelTrailing}
            <span class={templateClasses.labelTrailing}>{@render labelTrailing()}</span>
          {/if}
        </span>
      </span>
    {/if}
    <div>
      <div class={optionsClasses}>
        {@render children()}
      </div>
      {#if showError}
        <span class={templateClasses.hintWrapper}>
          <span class={templateClasses.hintIcon}>
            <InfoIcon size={hintIconSize} color="feedback.icon.negative.intense" />
          </span>
          <span class={hintClasses}>{errorText}</span>
        </span>
      {:else if showHelpText}
        <span class={hintClasses}>{helpText}</span>
      {/if}
    </div>
  </div>
</div>
