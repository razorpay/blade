<script lang="ts">
  import type { Snippet } from 'svelte';
  import {
    metaAttribute,
    MetaConstants,
    makeAnalyticsAttribute,
    getStyledPropsClasses,
    throwBladeError,
  } from '@razorpay/blade-core/utils';
  import {
    getBadgeClasses,
    getBadgeTemplateClasses,
    getBadgeIconPaddingClass,
    badgeTextSizes,
    badgeIconSize,
    getBadgeTextColorToken,
    getBadgeIconColorToken,
  } from '@razorpay/blade-core/styles';
  import BaseText from '../Typography/BaseText/BaseText.svelte';
  import type { TextColors } from '../Typography/BaseText/types';
  import type { IconColor } from '../Icons/types';
  import type { BadgeProps } from './types';

  // Get template classes via function call to prevent Svelte tree-shaking
  const badgeClasses = getBadgeTemplateClasses();

  let {
    children,
    color = 'neutral',
    emphasis = 'subtle',
    size = 'medium',
    icon: Icon,
    testID,
    ...rest
  }: BadgeProps = $props();

  // Validation - children must be provided (matches React behavior)
  // For string children, validate that it's not empty
  // For snippet children, we can only validate that children exists
  if (!children) {
    throwBladeError({
      message: 'Text as children is required for Badge.',
      moduleName: 'Badge',
    });
  }
  if (typeof children === 'string' && !children.trim()) {
    throwBladeError({
      message: 'Text as children is required for Badge.',
      moduleName: 'Badge',
    });
  }

  // Check if children is a string or a snippet
  const isStringChildren = $derived(typeof children === 'string');

  // Get snippet children for rendering (only valid when not string)
  const snippetChildren = $derived(
    !isStringChildren ? (children as Snippet) : undefined
  );

  // Get text color token based on color and emphasis
  const textColorToken = $derived(
    getBadgeTextColorToken({ color, emphasis }) as TextColors,
  );

  // Get icon color token based on color and emphasis
  const iconColorToken = $derived(
    getBadgeIconColorToken({ color, emphasis }) as IconColor,
  );

  // Get icon size based on badge size
  const iconSize = $derived(badgeIconSize[size]);

  // Get text sizes based on badge size
  const textSize = $derived(badgeTextSizes[size]);

  // Get icon padding class based on size
  const iconPaddingClass = $derived(getBadgeIconPaddingClass(size));

  // Generate badge classes from blade-core
  const badgeClassNames = $derived(
    getBadgeClasses({
      size,
      color,
      emphasis,
    }),
  );

  // Extract styled props
  const styledProps = $derived(getStyledPropsClasses(rest));

  // Combine classes for badge element
  const combinedClasses = $derived(
    [badgeClassNames, ...(styledProps.classes || [])].filter(Boolean).join(' ')
  );

  // Meta attributes
  const metaAttrs = metaAttribute({
    name: MetaConstants.Badge,
    testID,
  });

  // Analytics attributes
  const analyticsAttrs = makeAnalyticsAttribute(rest);
</script>

<div
  class={combinedClasses}
  {...metaAttrs}
  {...analyticsAttrs}
>
  <div class={badgeClasses.content}>
    {#if Icon}
      <span class="{badgeClasses.icon} {iconPaddingClass}">
        <Icon size={iconSize} color={iconColorToken} />
      </span>
    {/if}
    <BaseText
      as="span"
      color={textColorToken}
      fontSize={textSize.fontSize}
      lineHeight={textSize.lineHeight}
      fontFamily="text"
      fontWeight="medium"
      truncateAfterLines={1}
    >
      {#if isStringChildren}
        {children}
      {:else if snippetChildren}
        {@render snippetChildren()}
      {/if}
    </BaseText>
  </div>
</div>
