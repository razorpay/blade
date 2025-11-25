<script lang="ts">
  import './baseText.css';
  import { makeAccessible, makeAnalyticsAttribute, metaAttribute, MetaConstants } from '@razorpay/blade-core/utils';
  import type { BaseTextProps } from './types';
  import { getBaseTextClassNames, getBaseTextStyles } from './utils';

  let {
    id,
    color,
    fontFamily,
    fontSize,
    fontWeight,
    fontStyle,
    textDecorationLine,
    lineHeight,
    letterSpacing,
    as = 'span',
    textAlign,
    children,
    truncateAfterLines,
    wordBreak,
    opacity,
    className,
    style,
    accessibilityProps = {},
    componentName = MetaConstants.BaseText,
    testID,
    numberOfLines,
    textTransform,
    ...rest
  }: BaseTextProps = $props();

  // Use truncateAfterLines if provided, otherwise numberOfLines (for API consistency)
  const lineClamp = truncateAfterLines ?? numberOfLines;

  // Generate class names for variants (fontSize, lineHeight, fontWeight, fontFamily, etc.)
  const baseTextClasses = $derived(
    getBaseTextClassNames({
      fontSize,
      lineHeight,
      fontWeight,
      fontFamily,
      fontStyle,
      textDecorationLine,
      textAlign,
      textTransform,
      wordBreak,
    }),
  );

  // Combine base classes with custom className
  const combinedClasses = $derived(() => {
    return className ? `${baseTextClasses} ${className}` : baseTextClasses;
  });

  // Generate inline styles for dynamic values
  const baseStyles = $derived(
    getBaseTextStyles({
      color,
      fontFamily,
      fontSize,
      fontWeight,
      fontStyle,
      textDecorationLine,
      numberOfLines: lineClamp,
      wordBreak,
      lineHeight,
      letterSpacing,
      textAlign,
      opacity,
      textTransform,
      theme: {
        name: undefined,
        border: undefined,
        breakpoints: undefined,
        colors: undefined,
        spacing: undefined,
        motion: undefined,
        elevation: undefined,
        typography: undefined
      }
    }),
  );

  // Combine base styles with custom style prop
  const combinedStyle = $derived(() => {
    if (!style) return baseStyles;
    const customStyle = typeof style === 'string' ? style : Object.entries(style).map(([k, v]) => `${k}: ${v}`).join('; ');
    return `${baseStyles}; ${customStyle}`;
  });

  // Accessibility attributes
  const accessibilityAttrs = $derived(makeAccessible(accessibilityProps));

  // Meta attributes
  const metaAttrs = metaAttribute({
    name: componentName,
    testID,
  });

  // Analytics attributes
  const analyticsAttrs = makeAnalyticsAttribute(rest);
</script>

<svelte:element
  this={as}
  {id}
  class={combinedClasses()}
  style={combinedStyle()}
  {...accessibilityAttrs}
  {...metaAttrs}
  {...analyticsAttrs}
>
  {@render children()}
</svelte:element>

