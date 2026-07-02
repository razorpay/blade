<script lang="ts">
  import {
    metaAttribute,
    MetaConstants,
    getStyledPropsClasses,
    makeAnalyticsAttribute,
  } from '@razorpay/blade-core/utils';
  import { getTabsTemplateClasses } from '@razorpay/blade-core/styles';
  import { getTabsContext } from './context';
  import TabIndicator from './TabIndicator.svelte';
  import type { TabListProps } from './types';

  const classes = getTabsTemplateClasses();

  let {
    children,
    testID,
    ...rest
  }: TabListProps = $props();

  const getCtx = getTabsContext();
  const ctx = $derived(getCtx());

  let tabListContainerEl: HTMLDivElement | undefined = $state();

  const isFilled = $derived(ctx.variant === 'filled');
  const isCompact = $derived(ctx.size === 'small' && !ctx.isVertical);

  const tabListInnerClasses = $derived.by(() => {
    const result = [classes.tabListInner];
    result.push(ctx.isVertical ? classes.tabListVertical : classes.tabListHorizontal);

    if (isFilled) {
      result.push(classes.tabListFilled);
      if (isCompact) result.push(classes.tabListFilledCompact);
      if (ctx.isVertical) result.push(classes.tabListFilledVertical);
    } else {
      result.push(classes.tabListBordered);
      if (ctx.isVertical) result.push(classes.tabListBorderedVertical);
    }

    return result.filter(Boolean).join(' ');
  });

  const handleKeyDown = (event: KeyboardEvent) => {
    const tabList = tabListContainerEl;
    if (!tabList) return;

    const tabs = Array.from(
      tabList.querySelectorAll<HTMLElement>('[role="tab"]:not([disabled]):not([aria-disabled="true"])'),
    );
    const currentIndex = tabs.findIndex((tab) => tab === document.activeElement);
    if (currentIndex === -1) return;

    let nextIndex: number | null = null;
    const isHorizontal = !ctx.isVertical;

    if (
      (isHorizontal && event.key === 'ArrowRight') ||
      (!isHorizontal && event.key === 'ArrowDown')
    ) {
      nextIndex = (currentIndex + 1) % tabs.length;
    } else if (
      (isHorizontal && event.key === 'ArrowLeft') ||
      (!isHorizontal && event.key === 'ArrowUp')
    ) {
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = tabs.length - 1;
    }

    if (nextIndex !== null) {
      event.preventDefault();
      tabs[nextIndex].focus();
      const tabId = tabs[nextIndex].id;
      const prefix = `${ctx.baseId}-`;
      const suffix = '-tabitem';
      const focusedTabValue = tabId.slice(prefix.length, tabId.length - suffix.length);
      ctx.setFocusedValue(focusedTabValue);
    }
  };

  const styledProps = $derived(getStyledPropsClasses(rest));
  const outerClasses = $derived(
    [classes.tabListOuter, ctx.isVertical ? classes.tabListOuterVertical : classes.tabListOuterHorizontal, ...(styledProps.classes || [])].filter(Boolean).join(' '),
  );

  const metaAttrs = metaAttribute({ name: MetaConstants.TabList, testID });
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
</script>

<div
  class={outerClasses}
  {...metaAttrs}
  {...analyticsAttrs}
>
  <div class={classes.scrollableArea}>
    <div class={classes.tabListScrollRow}>
      {#if ctx.isVertical && ctx.variant === 'bordered'}
        <div class={classes.verticalTrack}></div>
      {/if}
      <!-- svelte-ignore a11y_interactive_supports_focus -->
      <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
      <div
        bind:this={tabListContainerEl}
        role="tablist"
        class={tabListInnerClasses}
        onkeydown={handleKeyDown}
      >
        {@render children()}
      </div>
    </div>
    {#if !(ctx.isVertical && isFilled)}
      <TabIndicator {tabListContainerEl} />
    {/if}
  </div>
  {#if !ctx.isVertical && ctx.variant === 'bordered'}
    <div class={classes.horizontalTrack}></div>
  {/if}
</div>
