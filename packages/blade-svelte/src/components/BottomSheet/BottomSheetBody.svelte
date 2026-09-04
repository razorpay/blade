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

  /* Measure content height and keep it in sync as the content grows/shrinks.
   * React re-measures via a `children` dep — a new element object on every
   * parent render. Svelte snippets render in the caller's reactive scope, so
   * this effect would never see consumer state changes. Observe layout
   * directly instead: `ResizeObserver` fires regardless of what caused the
   * resize. The parent uses this to compute snap-point bounds. */
  $effect(() => {
    if (!contentEl) return undefined;
    const node = contentEl;
    void ctx?.isOpen;
    ctx?.setContentHeight(node.getBoundingClientRect().height);
    const observer = new ResizeObserver(() => {
      ctx?.setContentHeight(node.getBoundingClientRect().height);
    });
    observer.observe(node);
    return () => observer.disconnect();
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
</script>

<div
  bind:this={scrollEl}
  class={bodyClasses}
  {...metaAttrs}
  {...analyticsAttrs}
>
  <div bind:this={contentEl} class={contentClasses}>
    {@render children()}
  </div>
</div>
