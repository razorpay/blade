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

  /* Re-measure on next paint so the value reflects the browser's final
   * layout (matches React, which wraps the measurement in `setTimeout(0)`
   * because the height changes during drag). */
  $effect(() => {
    if (!footerEl) return;
    void ctx?.isOpen;
    const rafId = requestAnimationFrame(() => {
      if (!footerEl) return;
      ctx?.setFooterHeight(footerEl.getBoundingClientRect().height);
    });
    return () => cancelAnimationFrame(rafId);
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
