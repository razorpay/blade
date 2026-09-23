<script lang="ts">
  import {
    metaAttribute,
    MetaConstants,
    makeAccessible,
    makeAnalyticsAttribute,
    getStyledPropsClasses,
  } from '@razorpay/blade-core/utils';
  import { getSkeletonClasses, getSkeletonStyleProps } from '@razorpay/blade-core/styles';
  import { getStyledProps } from '../../utils/getStyledProps';
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

  /* All style props — Skeleton's own dimensions/flex values (resolved by
   * getSkeletonStyleProps) plus arbitrary-value styled props — are fed as
   * --skeleton-* custom properties consumed by the skeleton root rule in
   * skeleton.module.css. */
  const { skeletonStyles } = $derived(
    getStyledProps('skeleton', {
      ...getSkeletonStyleProps({
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
      ...(styledProps.inlineStyles ?? {}),
    }),
  );

  const a11yAttrs = makeAccessible({ hidden: true });
  const metaAttrs = metaAttribute({ name: MetaConstants.Skeleton, testID });
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
</script>

<div
  class={combinedClasses}
  style={skeletonStyles}
  {...a11yAttrs}
  {...metaAttrs}
  {...analyticsAttrs}
></div>
