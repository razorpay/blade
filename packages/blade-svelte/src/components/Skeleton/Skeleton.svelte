<script lang="ts">
  import { getSkeletonClasses, getSkeletonTemplateClasses } from '@razorpay/blade-core/styles';
  import {
    metaAttribute,
    MetaConstants,
    getStyledPropsClasses,
    getSpacingValue,
  } from '@razorpay/blade-core/utils';
  import { makeAccessible } from '@razorpay/blade-core/utils';
  import type { SkeletonProps } from './types';

  getSkeletonTemplateClasses();

  const BORDER_RADIUS_TOKENS = new Set([
    'none', 'xsmall', 'small', 'medium', 'large', 'xlarge', '2xlarge', 'max', 'round',
  ]);

  function resolveBorderRadius(value: string | undefined): string | undefined {
    if (!value) return undefined;
    if (BORDER_RADIUS_TOKENS.has(value)) {
      return `var(--border-radius-${value})`;
    }
    return value;
  }

  let {
    width,
    maxWidth,
    minWidth,
    height,
    maxHeight,
    minHeight,
    borderRadius,
    testID,
    flexWrap,
    flexDirection,
    flexGrow,
    flexShrink,
    flexBasis,
    alignItems,
    alignContent,
    alignSelf,
    justifyItems,
    justifyContent,
    justifySelf,
    placeSelf,
    placeItems,
    order,
    gap,
    rowGap,
    columnGap,
    flex,
    ...rest
  }: SkeletonProps = $props();

  const styledProps = $derived(getStyledPropsClasses(rest));

  const combinedClasses = $derived(
    [getSkeletonClasses(), ...(styledProps.classes || [])].filter(Boolean).join(' '),
  );

  const dynamicStyle = $derived.by(() => {
    const parts: string[] = [];

    if (width !== undefined) parts.push(`width:${width}`);
    if (maxWidth !== undefined) parts.push(`max-width:${maxWidth}`);
    if (minWidth !== undefined) parts.push(`min-width:${minWidth}`);
    if (height !== undefined) parts.push(`height:${height}`);
    if (maxHeight !== undefined) parts.push(`max-height:${maxHeight}`);
    if (minHeight !== undefined) parts.push(`min-height:${minHeight}`);

    const resolvedRadius = resolveBorderRadius(borderRadius);
    if (resolvedRadius !== undefined) parts.push(`border-radius:${resolvedRadius}`);

    if (flexWrap !== undefined) parts.push(`flex-wrap:${flexWrap}`);
    if (flexDirection !== undefined) parts.push(`flex-direction:${flexDirection}`);
    if (flexGrow !== undefined) parts.push(`flex-grow:${flexGrow}`);
    if (flexShrink !== undefined) parts.push(`flex-shrink:${flexShrink}`);
    if (flexBasis !== undefined) parts.push(`flex-basis:${flexBasis}`);
    if (alignItems !== undefined) parts.push(`align-items:${alignItems}`);
    if (alignContent !== undefined) parts.push(`align-content:${alignContent}`);
    if (alignSelf !== undefined) parts.push(`align-self:${alignSelf}`);
    if (justifyItems !== undefined) parts.push(`justify-items:${justifyItems}`);
    if (justifyContent !== undefined) parts.push(`justify-content:${justifyContent}`);
    if (justifySelf !== undefined) parts.push(`justify-self:${justifySelf}`);
    if (placeSelf !== undefined) parts.push(`place-self:${placeSelf}`);
    if (placeItems !== undefined) parts.push(`place-items:${placeItems}`);
    if (order !== undefined) parts.push(`order:${order}`);
    if (flex !== undefined) parts.push(`flex:${flex}`);

    const resolvedGap = getSpacingValue(gap);
    if (resolvedGap !== undefined) parts.push(`gap:${resolvedGap}`);
    const resolvedRowGap = getSpacingValue(rowGap);
    if (resolvedRowGap !== undefined) parts.push(`row-gap:${resolvedRowGap}`);
    const resolvedColumnGap = getSpacingValue(columnGap);
    if (resolvedColumnGap !== undefined) parts.push(`column-gap:${resolvedColumnGap}`);

    const sp = styledProps.inlineStyles;
    for (const key in sp) {
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      parts.push(`${cssKey}:${sp[key]}`);
    }

    return parts.length > 0 ? parts.join(';') : undefined;
  });

  const metaAttrs = $derived(metaAttribute({ name: MetaConstants.Skeleton, testID }));
  const a11yAttrs = makeAccessible({ hidden: true });
</script>

<div
  class={combinedClasses}
  style={dynamicStyle}
  {...metaAttrs}
  {...a11yAttrs}
></div>
