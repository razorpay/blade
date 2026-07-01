<script lang="ts">
  import type { Snippet } from 'svelte';
  import { metaAttribute, MetaConstants } from '@razorpay/blade-core/utils';
  import {
    getFormLabelClasses,
    getFormLabelInnerClasses,
    getFormTemplateClasses,
    labelTextSize,
    labelOptionalIndicatorTextSize,
    labelTextColor,
  } from '@razorpay/blade-core/styles';
  import Text from '../../Typography/Text/Text.svelte';
  import type { TextColors } from '../../Typography/BaseText/types';
  import type { FormLabelProps } from './types';

  const templateClasses = getFormTemplateClasses();

  let {
    as = 'span',
    position = 'top',
    necessityIndicator = 'none',
    children,
    id,
    htmlFor,
    size = 'medium',
    labelSuffix,
    labelTrailing,
  }: FormLabelProps = $props();

  const isLabelLeftPositioned = $derived(position === 'left');

  const labelClasses = $derived(getFormLabelClasses({ position, size }));
  const innerClasses = $derived(getFormLabelInnerClasses({ position, size }));

  const textSize = $derived(
    labelTextSize[isLabelLeftPositioned ? 'left' : 'top'][size],
  );
  const labelColor = $derived(labelTextColor[size] as TextColors);

  const metaAttrs = metaAttribute({ name: MetaConstants.FormLabel });

  const trailingClasses = $derived(
    [templateClasses.labelTrailing, isLabelLeftPositioned ? templateClasses.labelLeft : '']
      .filter(Boolean)
      .join(' '),
  );

  const isStringChildren = $derived(typeof children === 'string');
  const snippetChildren = $derived(
    !isStringChildren ? (children as Snippet | undefined) : undefined,
  );
</script>

{#snippet textBlock()}
  <span class={templateClasses.labelTextGroup}>
    <Text
      as="span"
      variant="body"
      size={textSize}
      color={labelColor}
      weight="medium"
      truncateAfterLines={2}
    >
      {#if isStringChildren}
        {children}
      {:else if snippetChildren}
        {@render snippetChildren()}
      {/if}
    </Text>
    {#if necessityIndicator === 'optional'}
      <Text variant="caption" size={labelOptionalIndicatorTextSize[size]} color="surface.text.gray.muted">
        (optional)
      </Text>
    {:else if necessityIndicator === 'required'}
      <Text
        variant="body"
        size={isLabelLeftPositioned ? 'medium' : 'small'}
        color="feedback.text.negative.intense"
        alignSelf="flex-start"
      >
        *
      </Text>
    {/if}
  </span>
{/snippet}

{#snippet labelInner()}
  <span class={innerClasses}>
    <span class={templateClasses.labelTextGroup}>
      {@render textBlock()}
      {#if labelSuffix}
        <span class={templateClasses.labelSuffix}>{@render labelSuffix()}</span>
      {/if}
    </span>
    {#if labelTrailing}
      <span class={trailingClasses}>{@render labelTrailing()}</span>
    {/if}
  </span>
{/snippet}

{#if as === 'label'}
  <label class={labelClasses} for={htmlFor} {id} {...metaAttrs}>
    {@render labelInner()}
  </label>
{:else}
  <span class={labelClasses} {id} {...metaAttrs}>
    {@render labelInner()}
  </span>
{/if}
