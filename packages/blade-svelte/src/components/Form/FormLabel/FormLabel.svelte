<script lang="ts">
  import type { FormLabelProps } from './types';
  import Text from '../../Typography/Text/Text.svelte';
  import {
    labelTextSize,
    labelOptionalIndicatorTextSize,
    getFormLabelClasses,
    getLabelTextContainerClasses,
    getLabelSuffixClasses,
    getLabelTrailingClasses,
  } from '@razorpay/blade-core/styles';
  import { metaAttribute, MetaConstants } from '@razorpay/blade-core/utils';

  let {
    children,
    as = 'label',
    id,
    htmlFor,
    position = 'top',
    necessityIndicator = 'none',
    size = 'medium',
    labelSuffix,
    labelTrailing,
    accessibilityText,
  }: FormLabelProps = $props();

  // Determine if label is left positioned (only on desktop, but for simplicity treating it as always applicable when set)
  const isLabelLeftPositioned = $derived(position === 'left');

  // Get text size based on position
  const textSize = $derived(
    labelTextSize[isLabelLeftPositioned ? 'left' : 'top'][size] as 'small' | 'medium' | 'large'
  );

  // Get text color based on position
  const textColor = $derived(
    isLabelLeftPositioned ? 'surface.text.gray.subtle' : 'surface.text.gray.muted'
  );

  // Get optional indicator text size
  const optionalTextSize = $derived(
    labelOptionalIndicatorTextSize[size] as 'small' | 'medium'
  );

  // Generate classes
  const labelClasses = $derived(
    getFormLabelClasses({ position, size, necessityIndicator })
  );

  const textContainerClasses = $derived(
    getLabelTextContainerClasses(necessityIndicator)
  );

  const suffixClasses = getLabelSuffixClasses();

  const trailingClasses = $derived(
    getLabelTrailingClasses(isLabelLeftPositioned)
  );

  // Meta attributes
  const metaAttrs = metaAttribute({
    name: MetaConstants.FormLabel,
  });
</script>

<svelte:element
  this={as}
  class={labelClasses}
  {id}
  for={as === 'label' ? htmlFor : undefined}
  {...metaAttrs}
>
  <div class="label-content" style="display: flex; flex-direction: {isLabelLeftPositioned ? 'column' : 'row'}; align-items: {isLabelLeftPositioned ? 'flex-start' : 'center'}; width: 100%;">
    <div style="display: flex; flex-direction: row; align-items: center; gap: 8px;">
      <div class={textContainerClasses}>
        {#if children}
          <Text
            variant="body"
            size={textSize}
            color={textColor}
            weight="semibold"
            truncateAfterLines={2}
          >
            {#if typeof children === 'function'}
              {@render children()}
            {:else}
              {children}
            {/if}
          </Text>
        {/if}

        {#if accessibilityText}
          <span class="visually-hidden">{accessibilityText}</span>
        {/if}

        {#if necessityIndicator === 'optional'}
          <Text
            variant="caption"
            size={optionalTextSize}
            color="surface.text.gray.muted"
          >
            (optional)
          </Text>
        {/if}

        {#if necessityIndicator === 'required'}
          <Text
            variant="body"
            size={isLabelLeftPositioned ? 'medium' : 'small'}
            color="feedback.text.negative.intense"
          >
            *
          </Text>
        {/if}
      </div>

      {#if labelSuffix}
        <div class={suffixClasses}>
          {@render labelSuffix()}
        </div>
      {/if}
    </div>

    {#if labelTrailing}
      <div class={trailingClasses}>
        {@render labelTrailing()}
      </div>
    {/if}
  </div>
</svelte:element>

<style>
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .label-content {
    width: 100%;
  }
</style>

