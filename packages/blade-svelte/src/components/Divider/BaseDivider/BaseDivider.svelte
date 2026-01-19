<script lang="ts">
  import {
    getDividerClasses,
    getDividerTemplateClasses,
    getDividerColorToken,
    getDividerBorderPosition,
    type DividerOrientation,
    type DividerStyle,
    type DividerVariant,
    type DividerThickness,
  } from '@razorpay/blade-core/styles';
  import { makeAccessible, metaAttribute, MetaConstants } from '@razorpay/blade-core/utils';
  import { getStyledPropsClasses } from '@razorpay/blade-core/utils';
  import type { BaseDividerProps } from './types';

  // Get template classes via function call to prevent Svelte tree-shaking
  const dividerClasses = getDividerTemplateClasses();

  let {
    orientation = 'horizontal',
    dividerStyle = 'solid',
    variant = 'muted',
    thickness = 'thin',
    height,
    width,
    testID,
    ...rest
  }: BaseDividerProps = $props();

  // Border position based on orientation
  const borderPosition = $derived(getDividerBorderPosition(orientation as DividerOrientation));

  // Get color token
  const colorToken = $derived(getDividerColorToken({ variant: variant as DividerVariant }));

  // Generate divider classes from blade-core
  const baseDividerClasses = $derived(
    getDividerClasses({
      orientation: orientation as DividerOrientation,
      dividerStyle: dividerStyle as DividerStyle,
      variant: variant as DividerVariant,
      thickness: thickness as DividerThickness,
    }),
  );

  // Extract styled props
  const styledProps = $derived(getStyledPropsClasses(rest));

  // Combine classes for divider element
  const combinedClasses = $derived.by(() => {
    const classes = [baseDividerClasses];
    if (styledProps.classes) {
      classes.push(...styledProps.classes);
    }
    return classes.filter(Boolean).join(' ');
  });

  // Accessibility attributes
  const accessibilityAttrs = makeAccessible({
    role: 'separator',
  });

  // Meta attributes
  const metaAttrs = metaAttribute({
    name: MetaConstants.Divider,
    testID,
  });

  // Border width mapping
  const borderWidthMap = {
    thinner: 'var(--border-width-thinner)',
    thin: 'var(--border-width-thin)',
    thick: 'var(--border-width-thick)',
    thicker: 'var(--border-width-thicker)',
  };

  // Generate inline styles for border
  const inlineStyles = $derived.by(() => {
    const styles: Record<string, string> = {};

    // Set border width
    styles[`${borderPosition}Width`] = borderWidthMap[thickness as DividerThickness];

    // Set border style
    styles[`${borderPosition}Style`] = dividerStyle;

    // Set border color using CSS variable
    const colorVarName = colorToken.replace(/\./g, '-');
    styles[`${borderPosition}Color`] = `var(--${colorVarName})`;

    // Set custom width/height if provided
    if (height) {
      styles.height = height;
    }
    if (width) {
      styles.width = width;
    }

    return styles;
  });

  // Convert styles object to style string
  const styleString = $derived.by(() => {
    return Object.entries(inlineStyles)
      .map(([key, value]) => {
        // Convert camelCase to kebab-case
        const kebabKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        return `${kebabKey}: ${value}`;
      })
      .join('; ');
  });
</script>

<div
  class={combinedClasses}
  style={styleString}
  {...accessibilityAttrs}
  {...metaAttrs}
></div>
