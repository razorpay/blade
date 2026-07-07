<script lang="ts">
  import {
    metaAttribute,
    MetaConstants,
    makeAccessible,
    makeAnalyticsAttribute,
  } from '@razorpay/blade-core/utils';
  import { getSegmentedControlTemplateClasses } from '@razorpay/blade-core/styles';
  import { setSegmentedControlContext } from './context';
  import SegmentedControlIndicator from './SegmentedControlIndicator.svelte';
  import FormLabel from '../Input/_Form/FormLabel.svelte';
  import FormHint from '../Input/_Form/FormHint.svelte';
  import type { SegmentedControlProps } from './types';

  const classes = getSegmentedControlTemplateClasses();

  let {
    children,
    defaultValue,
    value: controlledValue,
    onChange,
    size = 'medium',
    isDisabled = false,
    isRequired = false,
    name,
    label,
    accessibilityLabel,
    labelPosition = 'top',
    helpText,
    errorText,
    validationState = 'none',
    necessityIndicator = 'none',
    testID,
    ...rest
  }: SegmentedControlProps = $props();

  const baseId = `segmented-control-${
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10)
  }`;
  const labelId = `${baseId}-label`;
  const helpTextId = `${baseId}-helptext`;
  const errorTextId = `${baseId}-errortext`;

  let internalValue = $state<string | undefined>(defaultValue);
  const selectedValue = $derived(
    controlledValue !== undefined ? controlledValue : internalValue,
  );

  const setSelectedValue = (newValue: string) => {
    if (controlledValue === undefined) {
      internalValue = newValue;
    }
    onChange?.({ name, value: newValue });
  };

  // --- Item registration (Accordion-style: sync during init, not in $effect) ---
  // Plain counters accumulate during render; committed atomically to a single $state object
  // so totalItems and firstEnabledValue always update together (no tearing between them).
  let _itemCounter = 0;
  let _firstEnabledValue: string | undefined = undefined;
  let registrationState = $state<{ totalItems: number; firstEnabledValue: string | undefined }>({
    totalItems: 0,
    firstEnabledValue: undefined,
  });

  $effect.pre(() => {
    _itemCounter = 0;
    _firstEnabledValue = undefined;
  });

  const registerItem = (value: string, isItemDisabled: boolean): number => {
    _itemCounter += 1;
    if (!isDisabled && !isItemDisabled && _firstEnabledValue === undefined) {
      _firstEnabledValue = value;
    }
    // Single object assignment — both fields update atomically, no tearing on re-renders.
    registrationState = { totalItems: _itemCounter, firstEnabledValue: _firstEnabledValue };
    return _itemCounter;
  };

  setSegmentedControlContext(() => ({
    get selectedValue() { return selectedValue; },
    setSelectedValue,
    get size() { return size; },
    get isDisabled() { return isDisabled; },
    get name() { return name; },
    baseId,
    get totalItems() { return registrationState.totalItems; },
    get firstEnabledValue() { return registrationState.firstEnabledValue; },
    registerItem,
  }));

  let containerEl = $state<HTMLElement | undefined>(undefined);

  const hintType = $derived<'error' | 'help'>(
    validationState === 'error' ? 'error' : 'help',
  );

  const ariaLabel = $derived(label ? undefined : accessibilityLabel || name);
  const describedBy = $derived.by(() => {
    if (validationState === 'error' && errorText) return errorTextId;
    if (helpText) return helpTextId;
    return undefined;
  });

  const containerSizeClass = $derived.by(() => {
    if (size === 'small') return classes.containerSizeSmall;
    if (size === 'large') return classes.containerSizeLarge;
    return classes.containerSizeMedium;
  });

  const fieldClasses = $derived(
    [classes.field, labelPosition === 'left' ? classes.fieldLeft : classes.fieldTop]
      .filter(Boolean)
      .join(' '),
  );

  const metaAttrs = metaAttribute({ name: MetaConstants.SegmentedControl, testID });
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
  const a11yAttrs = $derived(
    makeAccessible({
      role: 'radiogroup',
      labelledBy: label ? labelId : undefined,
      label: ariaLabel,
      required: isRequired,
      describedBy,
    }),
  );
</script>

<div class={fieldClasses} {...metaAttrs} {...analyticsAttrs}>
  {#if label}
    <FormLabel
      as="span"
      id={labelId}
      position={labelPosition}
      size={size === 'small' ? 'small' : size === 'large' ? 'large' : 'medium'}
      {necessityIndicator}
    >
      {label}
    </FormLabel>
  {/if}
  <div class={classes.fieldBody}>
    <!-- svelte-ignore a11y_interactive_supports_focus -->
    <div
      bind:this={containerEl}
      class={[classes.container, containerSizeClass].filter(Boolean).join(' ')}
      {...a11yAttrs}
    >
      {@render children()}
      <SegmentedControlIndicator {containerEl} {baseId} />
    </div>
    <FormHint
      type={hintType}
      size={size === 'small' ? 'small' : size === 'large' ? 'large' : 'medium'}
      {helpText}
      {errorText}
      {helpTextId}
      {errorTextId}
    />
  </div>
</div>
