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
    getSwitchClasses,
    getSwitchTemplateClasses,
  } from '@razorpay/blade-core/styles';
  import type { SwitchProps } from './types';

  const switchClasses = getSwitchTemplateClasses();

  let {
    isChecked,
    defaultChecked,
    onChange,
    name,
    value,
    isDisabled = false,
    size = 'medium',
    accessibilityLabel,
    id,
    testID,
    ...rest
  }: SwitchProps = $props();

  let internalChecked = $state(untrack(() => defaultChecked) ?? false);

  const isCheckedState = $derived(
    isChecked !== undefined ? isChecked : internalChecked,
  );

  const isControlled = $derived(isChecked !== undefined);

  let isPressed = $state(false);

  let inputEl: HTMLInputElement | undefined = $state();

  export function focus(): void {
    inputEl?.focus();
  }

  function handleChange(event: Event): void {
    if (isDisabled) return;
    const next = !isCheckedState;
    if (!isControlled) {
      internalChecked = next;
    }
    onChange?.({ isChecked: next, value, event });
  }

  function handlePointerPressedIn(): void {
    if (isDisabled) return;
    isPressed = true;
  }

  function handlePointerPressedOut(): void {
    if (isDisabled) return;
    isPressed = false;
  }

  function handleKeyboardPressedIn(event: KeyboardEvent): void {
    if (isDisabled) return;
    if (event.key === ' ') {
      isPressed = true;
    }
  }

  function handleKeyboardPressedOut(event: KeyboardEvent): void {
    if (isDisabled) return;
    if (event.key === ' ') {
      isPressed = false;
    }
  }

  const trackClasses = $derived(
    getSwitchClasses({ size, isChecked: isCheckedState }),
  );

  const thumbClasses = $derived(
    [
      switchClasses.thumb,
      size === 'small' ? switchClasses.sizeSmall : switchClasses.sizeMedium,
    ]
      .filter(Boolean)
      .join(' '),
  );

  const animatedThumbClasses = $derived(
    [
      switchClasses.animatedThumb,
      isCheckedState ? switchClasses.checked : switchClasses.unchecked,
      isPressed ? switchClasses.pressed : '',
    ]
      .filter(Boolean)
      .join(' '),
  );

  const isEffectivelyChecked = $derived(Boolean(isCheckedState) && !isDisabled);

  const thumbIconClasses = $derived(
    [
      switchClasses.thumbIcon,
      size === 'small' ? switchClasses.sizeSmall : switchClasses.sizeMedium,
      isEffectivelyChecked ? switchClasses.effectiveChecked : '',
    ]
      .filter(Boolean)
      .join(' '),
  );

  const styledProps = $derived(getStyledPropsClasses(rest));

  const wrapperClasses = $derived(
    [switchClasses.switch, ...(styledProps.classes || [])]
      .filter(Boolean)
      .join(' '),
  );

  const wrapperStyles = $derived(
    Object.entries(styledProps.inlineStyles || {})
      .map(([prop, val]) => `${prop}: ${val}`)
      .join('; ') || undefined,
  );

  const metaAttrs = $derived(
    metaAttribute({
      name: MetaConstants.Switch,
      testID,
    }),
  );

  const labelMetaAttrs = metaAttribute({
    name: MetaConstants.SwitchLabel,
  });

  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));

  const a11yAttrs = $derived(
    makeAccessible({
      role: 'switch',
      label: accessibilityLabel,
      checked: isCheckedState,
      disabled: isDisabled,
    }),
  );

  const trackA11yAttrs = makeAccessible({ hidden: true });
</script>

<div class={wrapperClasses} style={wrapperStyles} {...metaAttrs} {...analyticsAttrs}>
  <label
    class={switchClasses.label}
    data-disabled={isDisabled || undefined}
    onmousedown={handlePointerPressedIn}
    onmouseup={handlePointerPressedOut}
    onmouseout={handlePointerPressedOut}
    ontouchstart={handlePointerPressedIn}
    ontouchend={handlePointerPressedOut}
    onkeydown={handleKeyboardPressedIn}
    onkeyup={handleKeyboardPressedOut}
    {...labelMetaAttrs}
  >
    <input
      bind:this={inputEl}
      class={switchClasses.input}
      type="checkbox"
      {id}
      {name}
      {value}
      checked={isCheckedState}
      disabled={isDisabled}
      onchange={handleChange}
      {...a11yAttrs}
    />
    <div class={trackClasses} data-disabled={isDisabled || undefined} {...trackA11yAttrs}>
      <div class={thumbClasses}>
        <div class={animatedThumbClasses} data-disabled={isDisabled || undefined}>
          <svg
            class={thumbIconClasses}
            viewBox="0 0 11 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M8.81891 0.546661C9.12722 0.238352 9.62709 0.238353 9.9354 0.546661C10.2437 0.85497 10.2437 1.35484 9.9354 1.66315L4.14592 7.45262C3.83761 7.76093 3.33775 7.76093 3.02944 7.45262L0.397858 4.82104C0.0895488 4.51273 0.0895488 4.01286 0.397857 3.70456C0.706166 3.39625 1.20603 3.39625 1.51434 3.70456L3.58768 5.77789L8.81891 0.546661Z"
            />
          </svg>
        </div>
      </div>
    </div>
  </label>
</div>
