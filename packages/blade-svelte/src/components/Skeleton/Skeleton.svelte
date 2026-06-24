<script lang="ts">
  import {
    metaAttribute,
    MetaConstants,
    makeAccessible,
    makeAnalyticsAttribute,
    getStyledPropsClasses,
    kebabCase,
    combineStyleStrings,
  } from '@razorpay/blade-core/utils';
  import { getSkeletonClasses, getSkeletonInlineStyle } from '@razorpay/blade-core/styles';
  import type { SkeletonProps } from './types';

  let {
    width,
    maxWidth,
    minWidth,
    height,
    maxHeight,
    minHeight,
    borderRadius,
    flexDirection,
    flexWrap,
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
    testID,
    ...rest
  }: SkeletonProps = $props();

  const skeletonClassNames = $derived(
    getSkeletonClasses({
      borderRadius,
      flexDirection,
      flexWrap,
      alignItems,
      justifyContent,
      alignSelf,
      justifySelf,
      placeSelf,
    }),
  );

  const styledProps = $derived(getStyledPropsClasses(rest));

  const combinedClasses = $derived(
    [skeletonClassNames, ...(styledProps.classes || [])].filter(Boolean).join(' '),
  );

  const ownInlineStyle = $derived(
    getSkeletonInlineStyle({
      width,
      maxWidth,
      minWidth,
      height,
      maxHeight,
      minHeight,
      alignContent,
      justifyItems,
      placeItems,
      flexGrow,
      flexShrink,
      flexBasis,
      order,
    }),
  );

  const styledPropsInlineStyle = $derived.by(() => {
    const entries = Object.entries(styledProps.inlineStyles ?? {});
    if (entries.length === 0) return undefined;
    return entries.map(([key, value]) => `${kebabCase(key)}: ${value}`).join('; ');
  });

  const finalStyle = $derived(combineStyleStrings(ownInlineStyle, styledPropsInlineStyle) || undefined);

  const a11yAttrs = makeAccessible({ hidden: true });
  const metaAttrs = metaAttribute({ name: MetaConstants.Skeleton, testID });
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
</script>

<div
  class={combinedClasses}
  style={finalStyle}
  {...a11yAttrs}
  {...metaAttrs}
  {...analyticsAttrs}
></div>
