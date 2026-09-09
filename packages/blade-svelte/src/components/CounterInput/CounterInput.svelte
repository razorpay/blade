<script module lang="ts">
  // Module-scoped counter → stable, unique ids for label/input association.
  let counterInputIdCounter = 0;
</script>

<script lang="ts">
  import { untrack, onDestroy } from 'svelte';
  import {
    metaAttribute,
    MetaConstants,
    makeAccessible,
    makeAnalyticsAttribute,
    getStyledPropsClasses,
  } from '@razorpay/blade-core/utils';
  import {
    getCounterInputContainerClasses,
    getCounterInputButtonClasses,
    getCounterInputInputClasses,
    getCounterInputTemplateClasses,
  } from '@razorpay/blade-core/styles';
  import { MinusIcon } from '../Icons/MinusIcon';
  import { PlusIcon } from '../Icons/PlusIcon';
  import FormLabel from '../Input/_Form/FormLabel.svelte';
  import type { CounterInputProps } from './types';

  const templateClasses = getCounterInputTemplateClasses();

  let {
    label,
    accessibilityLabel,
    labelPosition = 'top',
    name,
    value,
    defaultValue,
    min = 0,
    max,
    emphasis = 'subtle',
    size = 'medium',
    isLoading = false,
    isDisabled = false,
    onChange,
    onFocus,
    onBlur,
    testID,
    ...rest
  }: CounterInputProps = $props();

  const uid = `counter-input-${(counterInputIdCounter += 1)}`;
  const inputId = `${uid}-input`;
  const labelId = `${uid}-label`;

  const iconSizeMap = {
    xsmall: 'small',
    medium: 'large',
    large: 'xlarge',
  } as const;

  // Controllable value — mirrors React `useControllableState`. Presence of `value`
  // switches the component to controlled mode; otherwise `internalValue` is the source.
  let internalValue = $state(untrack(() => defaultValue) ?? min);
  const currentValue = $derived(value !== undefined ? value : internalValue);
  const isControlled = $derived(value !== undefined);
  const isEffectivelyDisabled = $derived(isDisabled || isLoading);

  const isDecrementDisabled = $derived(isEffectivelyDisabled || currentValue <= min);
  const isIncrementDisabled = $derived(
    isEffectivelyDisabled || (max !== undefined && currentValue >= max),
  );

  // Slide animation bookkeeping (non-reactive refs, like React `useRef`).
  let lastAction: 'increment' | 'decrement' | null = null;
  let previousValue = untrack(() => (value !== undefined ? value : defaultValue ?? min));
  let latestValue = untrack(() => (value !== undefined ? value : defaultValue ?? min));
  let animationTimeout: ReturnType<typeof setTimeout> | undefined;
  let animationFrame: number | undefined;
  let animationClass = $state('');

  function clearAnimationTimers(): void {
    if (animationFrame !== undefined) {
      cancelAnimationFrame(animationFrame);
      animationFrame = undefined;
    }
    if (animationTimeout) {
      clearTimeout(animationTimeout);
      animationTimeout = undefined;
    }
  }

  // Focus-ring gating: show the input ring only on keyboard (Tab) navigation.
  let isKeyboardFocus = $state(false);

  function commitValue(next: number): void {
    if (!isControlled) {
      internalValue = next;
    }
    onChange?.({ value: next });
  }

  function handleIncrement(): void {
    if (isEffectivelyDisabled) return;
    const newValue = latestValue + 1;
    const constrained = max !== undefined ? Math.min(newValue, max) : newValue;
    lastAction = 'increment';
    latestValue = constrained;
    commitValue(constrained);
  }

  function handleDecrement(): void {
    if (isEffectivelyDisabled) return;
    const newValue = latestValue - 1;
    const constrained = Math.max(newValue, min);
    lastAction = 'decrement';
    latestValue = constrained;
    commitValue(constrained);
  }

  function handleInput(event: Event): void {
    if (isEffectivelyDisabled) return;
    const raw = (event.currentTarget as HTMLInputElement).value;
    const numeric = raw ? parseInt(raw, 10) : min;
    let next = Number.isNaN(numeric) ? min : numeric;
    if (next < min) next = min;
    if (max !== undefined && next > max) next = max;
    latestValue = next;
    commitValue(next);
  }

  function handleFocus(): void {
    onFocus?.({ name, value: currentValue?.toString() ?? '' });
  }

  function handleBlur(): void {
    onBlur?.({ name, value: currentValue?.toString() ?? '' });
  }

  // Trigger the slide animation only when the value actually changed via a button.
  $effect(() => {
    const nextValue = currentValue;
    const loading = isLoading;
    if (lastAction !== null && !loading && nextValue !== previousValue) {
      const action = lastAction;
      lastAction = null;

      clearAnimationTimers();
      animationClass = '';
      animationFrame = requestAnimationFrame(() => {
        animationClass =
          action === 'increment'
            ? templateClasses.animateSlideUp
            : templateClasses.animateSlideDown;
        animationTimeout = setTimeout(() => {
          animationClass = '';
        }, 300);
      });
    }
    previousValue = nextValue;
    latestValue = nextValue;
  });

  // `:focus-visible` misfires on text inputs (rings on click too), so gate the ring
  // behind a real Tab press — mirrors the React `document` capture listeners.
  $effect(() => {
    const handleTabKey = (event: KeyboardEvent): void => {
      if (event.key === 'Tab') {
        isKeyboardFocus = true;
      }
    };
    const handleMouseDown = (): void => {
      isKeyboardFocus = false;
    };
    document.addEventListener('keydown', handleTabKey, true);
    document.addEventListener('mousedown', handleMouseDown, true);
    return () => {
      document.removeEventListener('keydown', handleTabKey, true);
      document.removeEventListener('mousedown', handleMouseDown, true);
    };
  });

  onDestroy(() => {
    clearAnimationTimers();
  });

  const containerClasses = $derived(getCounterInputContainerClasses({ size, emphasis }));
  const decrementButtonClasses = $derived(
    getCounterInputButtonClasses({ size, emphasis, direction: 'decrement' }),
  );
  const incrementButtonClasses = $derived(
    getCounterInputButtonClasses({ size, emphasis, direction: 'increment' }),
  );
  const inputClasses = $derived(getCounterInputInputClasses({ size, emphasis }));

  const styledProps = $derived(getStyledPropsClasses(rest));

  const rootClasses = $derived(
    [templateClasses.counterInput, ...(styledProps.classes || [])].filter(Boolean).join(' '),
  );
  const rootStyles = $derived(
    Object.entries(styledProps.inlineStyles || {})
      .map(([prop, val]) => `${prop}: ${val}`)
      .join('; ') || undefined,
  );

  const layoutClasses = $derived(
    [templateClasses.layout, labelPosition === 'left' ? templateClasses.layoutLeft : '']
      .filter(Boolean)
      .join(' '),
  );

  const inputWrapperClasses = $derived(
    [templateClasses.inputWrapper, animationClass].filter(Boolean).join(' '),
  );

  const progressBarClasses = $derived(
    [
      templateClasses.progressBar,
      emphasis === 'intense' ? templateClasses.progressBarIntense : templateClasses.progressBarSubtle,
    ]
      .filter(Boolean)
      .join(' '),
  );

  const metaAttrs = $derived(metaAttribute({ name: MetaConstants.CounterInput, testID }));
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));

  const inputA11yAttrs = $derived(
    makeAccessible({
      role: 'spinbutton',
      label: accessibilityLabel,
      valueMin: min,
      valueMax: max,
      valueNow: currentValue,
    }),
  );
</script>

<div
  class={rootClasses}
  style={rootStyles}
  data-emphasis={emphasis}
  data-keyboard-focus={isKeyboardFocus ? '' : undefined}
  {...metaAttrs}
  {...analyticsAttrs}
>
  <div class={layoutClasses}>
    {#if label}
      <FormLabel
        as="label"
        position={labelPosition}
        htmlFor={inputId}
        id={labelId}
        size={size === 'xsmall' ? 'small' : size}
      >
        {label}
      </FormLabel>
    {/if}

    <div class={containerClasses} data-disabled={isEffectivelyDisabled || undefined}>
      <div class={templateClasses.controls}>
        <button
          type="button"
          class={decrementButtonClasses}
          onclick={handleDecrement}
          disabled={isDecrementDisabled}
          aria-label="Decrement value"
        >
          <MinusIcon size={iconSizeMap[size]} color="currentColor" />
        </button>

        <div class={inputWrapperClasses}>
          <input
            class={inputClasses}
            {name}
            id={inputId}
            type="number"
            value={currentValue}
            disabled={isDisabled}
            oninput={handleInput}
            onfocus={handleFocus}
            onblur={handleBlur}
            {...inputA11yAttrs}
          />
        </div>

        <button
          type="button"
          class={incrementButtonClasses}
          onclick={handleIncrement}
          disabled={isIncrementDisabled}
          aria-label="Increment value"
        >
          <PlusIcon size={iconSizeMap[size]} color="currentColor" />
        </button>
      </div>

      {#if isLoading}
        <div class={templateClasses.progressBarWrapper}>
          <div
            class={progressBarClasses}
            role="progressbar"
            aria-label="Loading"
            aria-valuemin={0}
            aria-valuemax={100}
          ></div>
        </div>
      {/if}
    </div>
  </div>
</div>
