<script lang="ts">
  import type { BadgeProps } from './types';
  import Text from '../Typography/Text/Text.svelte';
  import {
    badgeStyles,
    getBadgeColorProps,
    getBadgeTextSize,
    getBadgeIconSize,
    getBadgeTemplateClasses,
  } from '@razorpay/blade-core/styles';
  import {
    getStyledPropsClasses,
    makeAnalyticsAttribute,
    metaAttribute,
    MetaConstants,
  } from '@razorpay/blade-core/utils';

  let {
    children,
    color = 'neutral',
    emphasis = 'subtle',
    size = 'medium',
    icon,
    testID,
    ...rest
  }: BadgeProps = $props();

  // Validate children in development
  $effect(() => {
    if (import.meta.env.DEV) {
      if (!children || (typeof children === 'string' && !children.trim())) {
        console.error('[Blade: Badge]: Text as children is required for Badge.');
      }
    }
  });

  // Get color props based on color and emphasis
  const colorProps = $derived(getBadgeColorProps({ color, emphasis }));

  // Get text size configuration
  const textSize = $derived(getBadgeTextSize(size));

  // Get icon size
  const iconSize = $derived(getBadgeIconSize(size));

  // Generate badge CSS classes using CVA
  const badgeClasses = $derived(
    badgeStyles({
      size,
      color,
      emphasis,
      hasIcon: !!icon,
    }),
  );

  // Get styled props classes (margin, position, etc.)
  const styledPropsClasses = $derived(getStyledPropsClasses(rest));

  // Get analytics attributes
  const analyticsAttrs = makeAnalyticsAttribute(rest);

  // Get template classes
  const templateClasses = getBadgeTemplateClasses();

  // Combine all classes
  const allClasses = $derived([badgeClasses, styledPropsClasses].filter(Boolean).join(' '));
</script>

<div
  class={allClasses}
  {...metaAttribute({ name: MetaConstants.Badge, testID })}
  {...analyticsAttrs}
>
  <div class={templateClasses.content}>
    {#if icon}
      <div class={templateClasses.icon}>
        {@render icon()}
      </div>
    {/if}
    <Text
      variant={textSize.variant}
      size={textSize.size}
      weight="medium"
      truncateAfterLines={1}
      color={colorProps.textColor}
    >
      {#if typeof children === 'string'}
        {children}
      {:else}
        {@render children()}
      {/if}
    </Text>
  </div>
</div>
