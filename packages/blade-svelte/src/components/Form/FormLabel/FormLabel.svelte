<script lang="ts">
  import type { FormLabelProps } from './types';
  import Text from '../../Typography/Text/Text.svelte';
  import {
    labelTextSize,
    labelOptionalIndicatorTextSize,
    getFormLabelClasses,
    getLabelContentClasses,
    getLabelInnerRowClasses,
    getLabelTextContainerClasses,
    getLabelSuffixClasses,
    getLabelTrailingClasses,
    getFormTemplateClasses,
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

  // Get optional indicator text size
  const optionalTextSize = $derived(
    labelOptionalIndicatorTextSize[size] as 'small' | 'medium'
  );

  // Generate classes
  const labelClasses = $derived(
    getFormLabelClasses({ position, size, necessityIndicator })
  );

  const labelContentClasses = $derived(getLabelContentClasses(isLabelLeftPositioned));

  const labelInnerRowClasses = getLabelInnerRowClasses();

  const textContainerClasses = $derived(
    getLabelTextContainerClasses(necessityIndicator)
  );

  const suffixClasses = getLabelSuffixClasses();

  const trailingClasses = $derived(
    getLabelTrailingClasses(isLabelLeftPositioned)
  );

  // Template classes referenced via expressions (prevents Svelte tree-shaking of CSS modules)
  const templateClasses = getFormTemplateClasses();

  // Meta attributes
  const metaAttrs = metaAttribute({
    name: MetaConstants.FormLabel,
  });

  // Visually-hidden text exists when there's accessibility text OR a necessity word to announce
  const hasA11yContent = $derived(necessityIndicator !== 'none' || Boolean(accessibilityText));
</script>

<svelte:element
  this={as}
  class={labelClasses}
  {id}
  for={as === 'label' ? htmlFor : undefined}
  {...metaAttrs}
>
  <div class={labelContentClasses}>
    <div class={labelInnerRowClasses}>
      <div class={textContainerClasses}>
        {#if children}
          <Text
            variant="body"
            size={textSize}
            color="surface.text.gray.subtle"
            weight="medium"
            truncateAfterLines={2}
          >
            {#if typeof children === 'function'}
              {@render children()}
            {:else}
              {children}
            {/if}
          </Text>
        {/if}

        {#if hasA11yContent}
          <span class={templateClasses.srOnly}>
            {#if necessityIndicator !== 'none'}{necessityIndicator}{/if}
            {#if accessibilityText} {accessibilityText}{/if}
          </span>
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
