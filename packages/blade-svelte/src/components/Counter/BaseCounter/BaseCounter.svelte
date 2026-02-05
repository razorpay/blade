<script lang="ts">
  import {
    makeAnalyticsAttribute,
    metaAttribute,
    MetaConstants,
    getStyledPropsClasses,
  } from '@razorpay/blade-core/utils';
  import {
    getCounterClasses,
    getCounterTemplateClasses,
    counterTextSizes,
    getCounterTextColorToken,
  } from '@razorpay/blade-core/styles';
  import type { BaseCounterProps } from './types';
  import BaseText from '../../Typography/BaseText/BaseText.svelte';
  import type { TextColors } from '../../Typography/BaseText/types';

  let {
    value,
    max,
    color = 'neutral',
    emphasis = 'subtle',
    size = 'medium',
    testID,
    ...rest
  }: BaseCounterProps = $props();

  // Get template classes via function to prevent tree-shaking
  const templateClasses = getCounterTemplateClasses();

  // Format the counter content
  const content = $derived(() => {
    if (max !== undefined && value > max) {
      return `${max}+`;
    }
    return `${value}`;
  });

  // Get text color based on color and emphasis
  const textColor = $derived(
    getCounterTextColorToken({ color, emphasis }) as TextColors,
  );

  // Get text sizes for the current size
  const textSize = $derived(counterTextSizes[size]);

  // Generate counter classes
  const counterClasses = $derived(() => {
    return getCounterClasses({ size, color, emphasis });
  });

  // Extract styled props
  const styledProps = $derived(getStyledPropsClasses(rest));

  // Combine classes
  const combinedClasses = $derived(() => {
    const classes = [counterClasses()];
    if (styledProps.classes) {
      classes.push(...styledProps.classes);
    }
    return classes.filter(Boolean).join(' ');
  });

  // Meta attributes
  const metaAttrs = metaAttribute({
    name: MetaConstants.Counter,
    testID,
  });

  // Analytics attributes
  const analyticsAttrs = makeAnalyticsAttribute(rest);
</script>

<div class={combinedClasses()} {...metaAttrs} {...analyticsAttrs}>
  <div class={templateClasses.content}>
    <BaseText
      fontSize={textSize.fontSize}
      lineHeight={textSize.lineHeight}
      fontWeight="medium"
      color={textColor}
      as="span"
      truncateAfterLines={1}
      textAlign="center"
    >
      {content()}
    </BaseText>
  </div>
</div>
