<script lang="ts">
  import './baseText.css';
  import { makeAccessible, makeAnalyticsAttribute, metaAttribute, MetaConstants } from '@razorpay/blade-core/utils';
  import type { BaseTextProps } from './types';
  import { getBaseTextClassNames, getBaseTextStyles } from './utils';
  import { getStyledPropsClasses, combineStyleStrings } from '../../../utils/styledProps';

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

  // Extract styled props and convert to classes and inline styles
  const styledProps = $derived(getStyledPropsClasses(rest));

  // Combine base classes with styled props classes
  const combinedClasses = $derived(() => {
    const classes = [baseTextClasses];
    if (styledProps.classes) {
      classes.push(styledProps.classes);
    }
    if (className) {
      classes.push(className);
    }
    return classes.filter(Boolean).join(' ');
  });

  // Combine base styles with custom style prop and styled props inline styles
  const combinedStyle = $derived(() => {
    const customStyle = style
      ? typeof style === 'string'
        ? style
        : Object.entries(style)
            .map(([k, v]) => `${k}: ${v}`)
            .join('; ')
      : undefined;

    return combineStyleStrings(baseStyles, styledProps.inlineStyles, customStyle);
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
  style={combinedStyle()}
  {...accessibilityAttrs}
  {...metaAttrs}
  {...analyticsAttrs}
>
  {@render children()}
</svelte:element>

