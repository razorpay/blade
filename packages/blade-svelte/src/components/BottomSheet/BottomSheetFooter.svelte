<script lang="ts">
  import {
    metaAttribute,
    MetaConstants,
    makeAnalyticsAttribute,
  } from '@razorpay/blade-core/utils';
  import {
    bottomSheetFooterClass,
    bottomSheetFooterInnerClass,
  } from '@razorpay/blade-core/styles';
  import { getBottomSheetContext } from './bottomSheetContext';
  import type { BottomSheetFooterProps } from './types';

  let { children, testID, ...rest }: BottomSheetFooterProps = $props();

  const ctx = getBottomSheetContext();

  let footerEl = $state<HTMLDivElement | null>(null);

  /* Measure footer height synchronously — same timing as the body — so
   * the parent's totalHeight (and thus positionY / surface height) is
   * correct on the first animation frame. This prevents the body and
   * footer from animating out of sync when the sheet opens/closes. */
  $effect(() => {
    if (!footerEl) return;
    void ctx?.isOpen;
    ctx?.setFooterHeight(footerEl.getBoundingClientRect().height);
  });

  const metaAttrs = metaAttribute({ name: MetaConstants.BottomSheetFooter, testID });
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
</script>

<div
  bind:this={footerEl}
  class={bottomSheetFooterClass}
  {...metaAttrs}
  {...analyticsAttrs}
>
  <div class={bottomSheetFooterInnerClass}>
    {@render children()}
  </div>
</div>
