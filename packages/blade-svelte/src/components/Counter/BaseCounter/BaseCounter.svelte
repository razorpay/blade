<script lang="ts">
  import {
    makeAnalyticsAttribute,
    metaAttribute,
    MetaConstants,
    getStyledPropsClasses,
  } from '@razorpay/blade-core/utils';
  import {
    getCounterClasses,
    getCounterContentClasses,
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

  const content = $derived(
    max !== undefined && value > max ? `${max}+` : `${value}`,
  );

  const hasHorizontalPadding = $derived(value > 9);

  const contentClasses = $derived(
    getCounterContentClasses({ size, hasHorizontalPadding }),
  );

  const textColor = $derived(
    getCounterTextColorToken({ color, emphasis }) as TextColors,
  );

  const textSize = $derived(counterTextSizes[size]);

  const counterClasses = $derived(getCounterClasses({ size, color, emphasis }));

  const styledProps = $derived(getStyledPropsClasses(rest));

  const combinedClasses = $derived.by(() => {
    const classes = [counterClasses];
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

<div class={combinedClasses} {...metaAttrs} {...analyticsAttrs}>
  <div class={contentClasses}>
    <BaseText
      fontSize={textSize.fontSize}
      lineHeight={textSize.lineHeight}
      fontWeight="medium"
      color={textColor}
      as="span"
      truncateAfterLines={1}
      textAlign="center"
    >
      {content}
    </BaseText>
  </div>
</div>
