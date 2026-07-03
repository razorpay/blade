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

  const baseId = `segmented-control-${crypto.randomUUID().slice(0, 8)}`;
  const labelId = `${baseId}-label`;

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
  // Plain counters — reset each render cycle via $effect.pre so re-renders re-count correctly.
  let _itemCounter = 0;
  let _firstEnabledValue: string | undefined = undefined;
  let totalItems = $state(0);
  let firstEnabledValue = $state<string | undefined>(undefined);

  $effect.pre(() => {
    _itemCounter = 0;
    _firstEnabledValue = undefined;
  });

  const registerItem = (value: string, isItemDisabled: boolean): void => {
    _itemCounter += 1;
    totalItems = _itemCounter;
    if (!isDisabled && !isItemDisabled && _firstEnabledValue === undefined) {
      _firstEnabledValue = value;
      firstEnabledValue = value;
    }
  };

  setSegmentedControlContext(() => ({
    get selectedValue() { return selectedValue; },
    setSelectedValue,
    get size() { return size; },
    get isDisabled() { return isDisabled; },
    get name() { return name; },
    baseId,
    get totalItems() { return totalItems; },
    get firstEnabledValue() { return firstEnabledValue; },
    registerItem,
  }));

  let containerEl = $state<HTMLElement | undefined>(undefined);

  const showError = $derived(validationState === 'error' && Boolean(errorText));
  const showHelpText = $derived(!showError && Boolean(helpText));
  const hasFieldWrapper = $derived(Boolean(label || helpText || errorText));
  const ariaLabel = $derived(label ? undefined : accessibilityLabel || name);

  const containerSizeClass = $derived.by(() => {
    if (size === 'small') return classes.containerSizeSmall;
    if (size === 'large') return classes.containerSizeLarge;
    return classes.containerSizeMedium;
  });

  const hintSizeClass = $derived.by(() => {
    if (size === 'small') return classes.hintTextSmall;
    if (size === 'large') return classes.hintTextLarge;
    return classes.hintTextMedium;
  });

  const metaAttrs = metaAttribute({ name: MetaConstants.SegmentedControl, testID });
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
  const a11yAttrs = $derived(
    makeAccessible({
      role: 'radiogroup',
      labelledBy: label ? labelId : undefined,
      label: ariaLabel,
      required: isRequired,
    }),
  );
</script>

{#snippet segmentedControlEl()}
  <!-- svelte-ignore a11y_interactive_supports_focus -->
  <div
    bind:this={containerEl}
    class={[classes.container, containerSizeClass].filter(Boolean).join(' ')}
    {...a11yAttrs}
  >
    {@render children()}
    <SegmentedControlIndicator {containerEl} {baseId} />
  </div>
{/snippet}

{#if hasFieldWrapper}
  <div
    class={labelPosition === 'left' ? classes.fieldWrapperLeft : classes.fieldWrapperTop}
    {...metaAttrs}
    {...analyticsAttrs}
  >
    {#if label}
      <span
        id={labelId}
        class={[
          labelPosition === 'left' ? classes.labelLeft : classes.labelTop,
          necessityIndicator === 'required'
            ? classes.necessityRequired
            : necessityIndicator === 'optional'
              ? classes.necessityOptional
              : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {label}
      </span>
    {/if}
    <div class={classes.fieldContent}>
      {@render segmentedControlEl()}
      {#if showError}
        <span class={[classes.hintText, classes.errorText, hintSizeClass].filter(Boolean).join(' ')}>
          {errorText}
        </span>
      {:else if showHelpText}
        <span class={[classes.hintText, classes.helpText, hintSizeClass].filter(Boolean).join(' ')}>
          {helpText}
        </span>
      {/if}
    </div>
  </div>
{:else}
  <div {...metaAttrs} {...analyticsAttrs}>
    {@render segmentedControlEl()}
  </div>
{/if}
