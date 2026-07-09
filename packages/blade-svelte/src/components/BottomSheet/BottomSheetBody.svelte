<script lang="ts">
  import {
    metaAttribute,
    MetaConstants,
    makeAnalyticsAttribute,
  } from '@razorpay/blade-core/utils';
  import {
    getBottomSheetBodyClasses,
    getBottomSheetBodyContentClasses,
  } from '@razorpay/blade-core/styles';
  import { getBottomSheetContext } from './bottomSheetContext';
  import type { BottomSheetBodyProps } from './types';

  let {
    children,
    padding = 'spacing.5',
    overflow = 'auto',
    hasActionList = false,
    testID,
    ...rest
  }: BottomSheetBodyProps = $props();

  const ctx = getBottomSheetContext();

  let scrollEl = $state<HTMLDivElement | null>(null);
  let contentEl = $state<HTMLDivElement | null>(null);

  /* Report the scroll element so the parent can wire `useScrollLock`-style
   * behavior (touchmove prevention, scroll-lock activation) on the same
   * node. */
  $effect(() => {
    ctx?.setScrollElement(scrollEl);
    return () => ctx?.setScrollElement(null);
  });

  /* Measure content height every time the body re-renders. The parent uses
   * this to compute snap-point bounds. Mirrors React's `useIsomorphicLayoutEffect`
   * with `[contentRef, isOpen, children]` deps — Svelte's `$effect` re-runs
   * automatically when reactive deps change. */
  $effect(() => {
    if (!contentEl) return;
    void ctx?.isOpen;
    ctx?.setContentHeight(contentEl.getBoundingClientRect().height);
  });

  /* Inform the parent whether the body has zero padding. React tracks this
   * to float the empty-header close button over the body. */
  $effect(() => {
    ctx?.setHasBodyPadding(padding !== 'spacing.0');
  });

  const bodyClasses = $derived(getBottomSheetBodyClasses({ overflow }));
  const contentClasses = $derived(
    getBottomSheetBodyContentClasses({ padding, hasActionList }),
  );

  const metaAttrs = metaAttribute({ name: MetaConstants.BottomSheetBody, testID: testID ?? 'bottomsheet-body' });
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
  const bodyState = $derived(ctx?.isOpen ? 'open' : 'closed');
  const bodyDragging = $derived(Boolean(ctx?.isDragging));
</script>

<div
  bind:this={scrollEl}
  class={bodyClasses}
  data-state={bodyState}
  data-dragging={bodyDragging}
  {...metaAttrs}
  {...analyticsAttrs}
>
  <div bind:this={contentEl} class={contentClasses}>
    {@render children()}
  </div>
</div>
