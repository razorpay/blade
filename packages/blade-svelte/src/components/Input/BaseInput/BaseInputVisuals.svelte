<script lang="ts">
  import type { BaseInputVisualsProps, ValidationState } from './types';
  import Text from '../../Typography/Text/Text.svelte';
  import {
    baseInputIconSize,
    baseInputTextSize,
    getInputVisualsClasses,
    getVisualIconClasses,
    getVisualTextClasses,
    getInteractionElementClasses,
    getTrailingButtonClasses,
  } from '@razorpay/blade-core/styles';
  import type { IconColor } from '../../Icons/types';

  let {
    type,
    size,
    isDisabled = false,
    validationState = 'none',
    leadingIcon: LeadingIcon,
    trailingIcon: TrailingIcon,
    prefix,
    suffix,
    trailingInteractionElement,
    leadingInteractionElement,
    trailingButton,
    hasOtherTrailingElements = false,
  }: BaseInputVisualsProps = $props();

  // Determine what visuals to show
  const hasLeadingIcon = $derived(Boolean(LeadingIcon));
  const hasTrailingIcon = $derived(Boolean(TrailingIcon));
  const hasPrefix = $derived(Boolean(prefix));
  const hasSuffix = $derived(Boolean(suffix));
  const hasTrailingInteractionElement = $derived(Boolean(trailingInteractionElement));
  const hasLeadingInteractionElement = $derived(Boolean(leadingInteractionElement));
  const hasTrailingButton = $derived(Boolean(trailingButton));

  // Check if we have any visuals for this type
  const hasLeadingVisuals = $derived(
    type === 'leading' && (hasLeadingInteractionElement || hasLeadingIcon || hasPrefix)
  );

  const hasTrailingVisuals = $derived(
    type === 'trailing' && (hasTrailingInteractionElement || hasSuffix || hasTrailingIcon || hasTrailingButton)
  );

  // Get icon size
  const iconSize = $derived(baseInputIconSize[size] as 'small' | 'medium' | 'large');

  // Get text size
  const textSize = $derived(baseInputTextSize[size] as 'small' | 'medium' | 'large');

  // Trailing icon color based on validation state
  const trailingIconColor: Record<ValidationState, IconColor> = {
    none: 'surface.icon.gray.subtle',
    error: 'feedback.icon.negative.intense',
    success: 'feedback.icon.positive.intense',
  };

  // CSS classes
  const containerClasses = $derived(getInputVisualsClasses({ type }));
</script>

{#if type === 'leading' && hasLeadingVisuals}
  <div class={containerClasses}>
    {#if hasLeadingInteractionElement && leadingInteractionElement}
      <div class={getInteractionElementClasses('leading')}>
        {@render leadingInteractionElement()}
      </div>
    {/if}

    {#if LeadingIcon}
      <div class={getVisualIconClasses('leading')}>
        <LeadingIcon
          size={iconSize}
          color={isDisabled ? 'surface.icon.gray.disabled' : 'surface.icon.gray.muted'}
        />
      </div>
    {/if}

    {#if hasPrefix}
      <div class={getVisualTextClasses('prefix', hasLeadingIcon)}>
        <Text
          size={textSize}
          variant="body"
          weight="regular"
          color={isDisabled ? 'surface.text.gray.disabled' : 'surface.text.gray.muted'}
        >
          {prefix}
        </Text>
      </div>
    {/if}
  </div>
{/if}

{#if type === 'trailing' && hasTrailingVisuals}
  <div class={containerClasses}>
    {#if hasTrailingInteractionElement && trailingInteractionElement}
      <div class={getInteractionElementClasses('trailing', hasOtherTrailingElements)}>
        {@render trailingInteractionElement()}
      </div>
    {/if}

    {#if hasSuffix}
      <div class={getVisualTextClasses('suffix', hasTrailingIcon || hasTrailingButton)}>
        <Text
          size={textSize}
          variant="body"
          weight="regular"
          color={isDisabled ? 'surface.text.gray.disabled' : 'surface.text.gray.subtle'}
        >
          {suffix}
        </Text>
      </div>
    {/if}

    {#if TrailingIcon}
      <div class={getVisualIconClasses('trailing')}>
        <TrailingIcon
          size={iconSize}
          color={isDisabled ? 'interactive.icon.gray.disabled' : trailingIconColor[validationState ?? 'none']}
        />
      </div>
    {/if}

    {#if hasTrailingButton && trailingButton}
      <div class={getTrailingButtonClasses()}>
        {@render trailingButton()}
      </div>
    {/if}
  </div>
{/if}

