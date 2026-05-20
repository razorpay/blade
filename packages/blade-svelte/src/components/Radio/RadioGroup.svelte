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
    getRadioGroupFieldClasses,
    getRadioGroupLabelClasses,
    getRadioGroupGapClass,
    getRadioGroupRadiosClasses,
    getRadioTemplateClasses,
  } from '@razorpay/blade-core/styles';
  import { setRadioGroupContext } from './radioContext';
  import type { RadioGroupProps, RadioGroupContextType, RadioGroupState } from './types';

  const templateClasses = getRadioTemplateClasses();

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
  }: RadioGroupProps = $props();

  // ID generation
  let idCounter = 0;
  const idBase = `radio-group-${++idCounter}-${Math.random().toString(36).slice(2, 6)}`;
  const labelId = `${idBase}-label`;
  const fallbackName = $derived(name ?? idBase);

  // Selection state
  let internalValue = $state<string | undefined>(untrack(() => defaultValue));

  // Sync controlled value
  $effect(() => {
    if (controlledValue !== undefined) {
      internalValue = controlledValue;
    }
  });

  const isControlled = $derived(controlledValue !== undefined);

  const checkedValue = $derived(isControlled ? controlledValue : internalValue);

  const radioState: RadioGroupState = {
    get value() {
      return checkedValue;
    },
    setValue(val: string, event: Event) {
      if (isDisabled) return;
      if (!isControlled) {
        internalValue = val;
      }
      onChange?.({ value: val, name: fallbackName, event });
    },
    removeValue() {
      if (isDisabled) return;
      if (!isControlled) {
        internalValue = undefined;
      }
    },
    isChecked(val: string): boolean {
      if (val === undefined || checkedValue === undefined) return false;
      return checkedValue === val;
    },
  };

  const contextValue: RadioGroupContextType = {
    get isDisabled() {
      return isDisabled;
    },
    get isRequired() {
      return isRequired;
    },
    get necessityIndicator() {
      return necessityIndicator;
    },
    get validationState() {
      return validationState;
    },
    get name() {
      return fallbackName;
    },
    get size() {
      return size;
    },
    get labelPosition() {
      return labelPosition;
    },
    state: radioState,
  };

  setRadioGroupContext(() => contextValue);

  const showError = $derived(validationState === 'error' && errorText);
  const showHelpText = $derived(!showError && helpText);

  const fieldClasses = $derived(getRadioGroupFieldClasses(labelPosition));
  const labelClasses = $derived(getRadioGroupLabelClasses({ size, labelPosition }));
  const gapClass = $derived(getRadioGroupGapClass(size));
  const radiosClasses = $derived(getRadioGroupRadiosClasses(orientation));

  const styledProps = $derived(getStyledPropsClasses(rest));
  const wrapperClasses = $derived(
    [templateClasses.group, ...(styledProps.classes || [])].filter(Boolean).join(' '),
  );

  const metaAttrs = metaAttribute({ name: MetaConstants.RadioGroup, testID });
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
  const a11yAttrs = $derived(
    makeAccessible({
      role: 'radiogroup',
      labelledBy: label ? labelId : undefined,
    }),
  );

  const necessityText = $derived.by(() => {
    if (necessityIndicator === 'required') return '(required)';
    if (necessityIndicator === 'optional') return '(optional)';
    return '';
  });
</script>

<div class={wrapperClasses} {...metaAttrs} {...analyticsAttrs}>
  <div class={fieldClasses} {...a11yAttrs}>
    {#if label}
      <span id={labelId} class={labelClasses}>
        {label}
        {#if necessityText}
          <span class={templateClasses.necessity}>{necessityText}</span>
        {/if}
      </span>
    {/if}
    <div>
      <div class={[radiosClasses, gapClass].filter(Boolean).join(' ')}>
        {@render children()}
      </div>
      {#if showError}
        <span class={[templateClasses.hintText, templateClasses.hintError].join(' ')}>
          {errorText}
        </span>
      {:else if showHelpText}
        <span class={[templateClasses.hintText, templateClasses.hintHelp].join(' ')}>
          {helpText}
        </span>
      {/if}
    </div>
  </div>
</div>
