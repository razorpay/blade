<script lang="ts">
  import {
    getIndicatorColorTokens,
    indicatorDotSizes,
    indicatorTextSize,
    type IndicatorSize,
    type IndicatorColor,
    type IndicatorEmphasis,
  } from '@razorpay/blade-core/styles';
  import {
    makeAccessible,
    metaAttribute,
    MetaConstants,
    makeAnalyticsAttribute,
  } from '@razorpay/blade-core/utils';
  import { getStyledPropsClasses } from '@razorpay/blade-core/utils';
  import BaseText from '../../Typography/BaseText/BaseText.svelte';
  import type { BaseIndicatorProps } from './types';

  let {
    children,
    color = 'neutral',
    emphasis = 'subtle',
    size = 'medium',
    accessibilityLabel,
    testID,
    style,
    ...rest
  }: BaseIndicatorProps = $props();

  // Get children as string for accessibility
  const childrenString = $derived(typeof children === 'string' ? children : undefined);

  // Check if intense
  const isIntense = $derived(emphasis === 'intense');

  // Get color tokens
  const colorTokens = $derived(
    getIndicatorColorTokens({
      color: color as IndicatorColor,
      emphasis: emphasis as IndicatorEmphasis,
    }),
  );

  // Get SVG size
  const svgSize = $derived(
    isIntense
      ? indicatorDotSizes[emphasis as IndicatorEmphasis][size as IndicatorSize].outer
      : indicatorDotSizes[emphasis as IndicatorEmphasis][size as IndicatorSize].inner,
  );

  // Extract styled props
  const styledProps = $derived(getStyledPropsClasses(rest));

  // Combine classes
  const combinedClasses = $derived(() => {
    const classes: string[] = [];
    if (styledProps.classes) {
      classes.push(...styledProps.classes);
    }
    return classes.filter(Boolean).join(' ');
  });

  // Merge inline styles (custom style prop with component's base styles)
  const mergedStyles = $derived(() => {
    let baseStyles = 'display: inline-flex;';
    if (style) {
      baseStyles += ` ${style}`;
    }
    if (styledProps.style) {
      baseStyles += ` ${styledProps.style}`;
    }
    return baseStyles;
  });

  // Accessibility attributes
  const accessibilityAttrs = makeAccessible({
    role: 'status',
    label: accessibilityLabel ?? childrenString,
  });

  // Meta attributes
  const metaAttrs = metaAttribute({
    name: MetaConstants.Indicator,
    testID,
  });

  // Analytics attributes
  const analyticsAttrs = makeAnalyticsAttribute(rest);

  // Text size mapping
  const textSize = $derived(indicatorTextSize[size as IndicatorSize]);

  // Get color values from tokens (convert dot notation to CSS variable names)
  const fillColorOuter = $derived(() => {
    const varName = colorTokens.fillColorOuter.replace(/\./g, '-');
    return `var(--${varName})`;
  });

  const fillColorInner = $derived(() => {
    const varName = colorTokens.fillColorInner.replace(/\./g, '-');
    return `var(--${varName})`;
  });
</script>

<div
  class={combinedClasses()}
  style={mergedStyles()}
  {...accessibilityAttrs}
  {...metaAttrs}
  {...analyticsAttrs}
>
  <div style="display: flex; flex-direction: row; align-items: center;">
    <svg
      width={svgSize}
      height={svgSize}
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {#if isIntense}
        <circle cx="5" cy="5" r="5" fill={fillColorOuter()} />
        <circle cx="5" cy="5" r="2.5" fill={fillColorInner()} />
      {:else}
        <circle cx="5" cy="5" r="5" fill={fillColorInner()} />
      {/if}
    </svg>
    {#if childrenString}
      <div style="margin-left: var(--spacing-2);">
        <BaseText
          as="span"
          color="surface.text.gray.subtle"
          size={textSize}
          fontWeight="medium"
          textAlign="left"
          componentName={MetaConstants.Indicator}
        >
          {childrenString}
        </BaseText>
      </div>
    {:else if children && typeof children === 'function'}
      <div style="margin-left: var(--spacing-2);">
        <BaseText
          as="span"
          color="surface.text.gray.subtle"
          size={textSize}
          fontWeight="medium"
          textAlign="left"
          componentName={MetaConstants.Indicator}
        >
          {@render children()}
        </BaseText>
      </div>
    {/if}
  </div>
</div>
