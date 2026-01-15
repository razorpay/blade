<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { ValidationState, InputSize } from './types';
  import {
    getInputWrapperClasses,
    getFocusRingWrapperClasses,
    type BaseInputState,
  } from '@razorpay/blade-core/styles';

  type Props = {
    isDisabled?: boolean;
    validationState?: ValidationState;
    size?: InputSize;
    isTextArea?: boolean;
    children?: Snippet;
    onclick?: (event: MouseEvent) => void;
  };

  let {
    isDisabled = false,
    validationState = 'none',
    size = 'medium',
    isTextArea = false,
    children,
    onclick,
  }: Props = $props();

  // Internal focus/hover state
  let isFocused = $state(false);
  let isHovered = $state(false);

  // Determine the current state for styling
  const currentState = $derived.by((): BaseInputState => {
    if (isDisabled) return 'disabled';
    if (validationState === 'error') return 'error';
    if (validationState === 'success') return 'success';
    if (isFocused) return 'focus';
    if (isHovered) return 'hover';
    return 'default';
  });

  // CSS classes
  const focusRingClasses = getFocusRingWrapperClasses();
  const wrapperClasses = $derived(
    getInputWrapperClasses({
      state: currentState,
      size,
      isTextArea,
      isDisabled,
    })
  );

  // Event handlers
  function handleMouseEnter(): void {
    if (!isDisabled) {
      isHovered = true;
    }
  }

  function handleMouseLeave(): void {
    isHovered = false;
  }

  function handleFocusIn(): void {
    if (!isDisabled) {
      isFocused = true;
    }
  }

  function handleFocusOut(): void {
    isFocused = false;
  }

  function handleClick(event: MouseEvent): void {
    onclick?.(event);
  }
</script>

<div class={focusRingClasses}>
  <div
    class={wrapperClasses}
    role="presentation"
    onmouseenter={handleMouseEnter}
    onmouseleave={handleMouseLeave}
    onfocusin={handleFocusIn}
    onfocusout={handleFocusOut}
    onclick={handleClick}
  >
    {#if children}
      {@render children()}
    {/if}
  </div>
</div>

