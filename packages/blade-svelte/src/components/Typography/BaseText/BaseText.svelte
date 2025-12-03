<script lang="ts">
  import { makeAccessible, makeAnalyticsAttribute, metaAttribute, MetaConstants } from '@razorpay/blade-core/utils';
  import type { BaseTextProps } from './types';
  import { getBaseTextClasses } from '@razorpay/blade-core/styles';
  import { getStyledPropsClasses } from '@razorpay/blade-core/utils';

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
    accessibilityProps = {},
    componentName = MetaConstants.BaseText,
    testID,
    numberOfLines,
    textTransform,
    ...rest
  }: BaseTextProps = $props();

  // Use truncateAfterLines if provided, otherwise numberOfLines (for API consistency)
  const lineClamp = truncateAfterLines ?? numberOfLines;

  // Generate all classes from blade-core (single source of truth)
  // Everything is class-based - no inline styles or data attributes
  const baseTextClasses = $derived(
    getBaseTextClasses({
      fontSize,
      lineHeight,
      fontWeight,
      fontFamily,
      fontStyle,
      textDecorationLine,
      textAlign,
      textTransform,
      wordBreak,
      letterSpacing,
      color,
      opacity,
      numberOfLines: lineClamp,
      className,
    }),
  );

  // Extract styled props and convert to classes
  const styledProps = $derived(getStyledPropsClasses(rest));

  // Combine all classes - everything is class-based, no inline styles
  const combinedClasses = $derived(() => {
    const classes = [baseTextClasses];
    if (styledProps.classes) {
      classes.push(...styledProps.classes);
    }
    return classes.filter(Boolean).join(' ');
  });

  const accessibilityAttrs = $derived(makeAccessible(accessibilityProps));
  const metaAttrs = metaAttribute({
    name: componentName,
    testID,
  });
  const analyticsAttrs = makeAnalyticsAttribute(rest);
</script>

<svelte:element
  this={as}
  {id}
  class={combinedClasses()}
  {...accessibilityAttrs}
  {...metaAttrs}
  {...analyticsAttrs}
>
  {@render children()}
</svelte:element>

