<script lang="ts">
  import type { CounterProps } from './types';
  import Text from '../Typography/Text/Text.svelte';
  import {
    counterStyles,
    getCounterColorProps,
    getCounterTextSize,
    getCounterTemplateClasses,
  } from '@razorpay/blade-core/styles';
  import {
    getStyledPropsClasses,
    makeAnalyticsAttribute,
    metaAttribute,
    MetaConstants,
  } from '@razorpay/blade-core/utils';

  let {
    value,
    max,
    color = 'neutral',
    emphasis = 'subtle',
    size = 'medium',
    testID,
    ...rest
  }: CounterProps = $props();

  // Calculate display content
  const content = $derived(max !== undefined && value > max ? `${max}+` : `${value}`);

  // Get color props
  const colorProps = $derived(getCounterColorProps({ color, emphasis }));

  // Get text size
  const textSize = $derived(getCounterTextSize(size));

  // Generate counter CSS classes
  const counterClasses = $derived(counterStyles({ size, color, emphasis }));

  // Get styled props classes
  const styledPropsClasses = $derived(getStyledPropsClasses(rest));

  // Get template classes
  const templateClasses = getCounterTemplateClasses();

  // Combine all classes
  const allClasses = $derived([counterClasses, styledPropsClasses].filter(Boolean).join(' '));

  // Get analytics attributes
  const analyticsAttrs = makeAnalyticsAttribute(rest);
</script>

<div
  class={allClasses}
  {...metaAttribute({ name: MetaConstants.Counter, testID })}
  {...analyticsAttrs}
>
  <div class={templateClasses.content}>
    <Text
      variant={textSize.variant}
      size={textSize.size}
      weight="medium"
      textAlign="center"
      truncateAfterLines={1}
      color={colorProps.textColor}
    >
      {content}
    </Text>
  </div>
</div>
