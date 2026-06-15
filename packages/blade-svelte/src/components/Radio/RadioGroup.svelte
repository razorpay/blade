<script lang="ts">
  import {
    metaAttribute,
    MetaConstants,
    makeAccessible,
    getStyledPropsClasses,
    makeAnalyticsAttribute,
  } from '@razorpay/blade-core/utils';
  import {
    getRadioGroupFieldClasses,
    getRadioGroupItemsClasses,
    getRadioGroupLabelSizeClass,
    getRadioGroupTemplateClasses,
  } from '@razorpay/blade-core/styles';
  import { setRadioGroupContext } from './radioContext';
  import { InfoIcon } from '../Icons';
  import type { RadioGroupProps, RadioGroupContextType, State } from './types';

  const templateClasses = getRadioGroupTemplateClasses();

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

  let idCounter = 0;
  const idBase = `radio-group-${++idCounter}-${Math.random().toString(36).slice(2, 6)}`;
  const labelId = `${idBase}-label`;
  const fallbackName = name ?? idBase;

  const isControlled = $derived(controlledValue !== undefined);

  let internalValue = $state<string | undefined>(defaultValue);

  // Sync controlled value into local state.
  $effect(() => {
    if (controlledValue !== undefined) {
      internalValue = controlledValue;
    }
  });

  const checkedValue = $derived(isControlled ? controlledValue : internalValue);

  const radioState: State = {
    get value() {
      return checkedValue;
    },
    isChecked(val: string): boolean {
      if (val === undefined || checkedValue === undefined) return false;
      return checkedValue === val;
    },
    setValue(val: string, event?: Event): void {
      if (isDisabled) return;
      if (!isControlled) {
        internalValue = val;
      }
      onChange?.({ name: fallbackName, value: val, event });
    },
    removeValue(): void {
      if (isDisabled) return;
      if (!isControlled) {
        internalValue = undefined;
      }
    },
  };

  const contextValue: RadioGroupContextType = {
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
    state: radioState,
  };

  setRadioGroupContext(() => contextValue);

  const showError = $derived(validationState === 'error' && Boolean(errorText));
  const showHelpText = $derived(!showError && Boolean(helpText));
  const hintIconSize = $derived(size === 'large' ? 'medium' : 'small');

  const fieldClasses = $derived(getRadioGroupFieldClasses({ labelPosition }));
  const itemsClasses = $derived(getRadioGroupItemsClasses({ orientation, size }));
  const labelSizeClass = $derived(getRadioGroupLabelSizeClass(size, labelPosition));

  const styledProps = $derived(getStyledPropsClasses(rest));
  const wrapperClasses = $derived(
    [...(styledProps.classes || [])].filter(Boolean).join(' ') || undefined,
  );

  const metaAttrs = metaAttribute({ name: MetaConstants.RadioGroup, testID });
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
  const a11yAttrs = $derived(
    makeAccessible({
      role: 'radiogroup',
      labelledBy: label ? labelId : undefined,
    }),
  );

  const necessityClass = $derived.by(() => {
    if (necessityIndicator === 'required') return templateClasses.necessityRequired;
    if (necessityIndicator === 'optional') return templateClasses.necessityOptional;
    return '';
  });
</script>

<div class={wrapperClasses} {...metaAttrs} {...analyticsAttrs}>
  <div class={fieldClasses} {...a11yAttrs}>
    {#if label}
      <span
        id={labelId}
        class={[templateClasses.groupLabel, labelSizeClass, necessityClass]
          .filter(Boolean)
          .join(' ')}
      >
        {label}
      </span>
    {/if}
    <div>
      <div class={itemsClasses}>
        {@render children()}
      </div>
      {#if showError}
        <span class={templateClasses.hintWrapper}>
          <span class={templateClasses.hintIcon}>
            <InfoIcon size={hintIconSize} color="feedback.icon.negative.intense" />
          </span>
          <span class={templateClasses.errorText}>{errorText}</span>
        </span>
      {:else if showHelpText}
        <span class={templateClasses.helpText}>{helpText}</span>
      {/if}
    </div>
  </div>
</div>
