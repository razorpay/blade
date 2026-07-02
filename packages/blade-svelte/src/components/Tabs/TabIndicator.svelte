<script lang="ts">
  import { tick } from 'svelte';
  import {
    metaAttribute,
    MetaConstants,
  } from '@razorpay/blade-core/utils';
  import { getTabsTemplateClasses } from '@razorpay/blade-core/styles';
  import { getTabsContext } from './context';

  const classes = getTabsTemplateClasses();

  let { tabListContainerEl }: { tabListContainerEl: HTMLDivElement | undefined } = $props();

  const getCtx = getTabsContext();
  const ctx = $derived(getCtx());

  let shouldAnimate = $state(false);
  let dimensions = $state({ width: 0, height: 0, x: 0, y: 0 });

  const updateDimensions = () => {
    if (!tabListContainerEl) return;
    const activeTabItem = tabListContainerEl.querySelector<HTMLElement>(
      `#${CSS.escape(`${ctx.baseId}-${ctx.selectedValue}-tabitem`)}`,
    );
    if (!activeTabItem || activeTabItem.offsetWidth === 0) return;

    dimensions = {
      width: activeTabItem.offsetWidth,
      height: activeTabItem.offsetHeight,
      x: activeTabItem.offsetLeft,
      y:
        ctx.variant === 'filled' || ctx.isVertical
          ? activeTabItem.offsetTop
          : activeTabItem.offsetTop + activeTabItem.offsetHeight - 1.5,
    };

    if (!shouldAnimate) {
      requestAnimationFrame(() => {
        shouldAnimate = true;
      });
    }
  };

  $effect(() => {
    if (ctx.selectedValue && tabListContainerEl) {
      // Re-measure when selection, variant, or orientation changes — all affect the y formula.
      void (ctx.variant, ctx.isVertical, tick().then(updateDimensions));
    }
  });

  $effect(() => {
    if (!tabListContainerEl) return;
    const observer = new ResizeObserver(updateDimensions);
    observer.observe(tabListContainerEl);
    return () => observer.disconnect();
  });

  $effect(() => {
    if (!('fonts' in document)) return;
    const handler = () => updateDimensions();
    document.fonts.addEventListener('loadingdone', handler);
    return () => document.fonts.removeEventListener('loadingdone', handler);
  });

  const isFilled = $derived(ctx.variant === 'filled');
  const isVerticalBordered = $derived(ctx.isVertical && !isFilled);
  const shouldHaveMediumRadius = $derived(ctx.size === 'small' && !ctx.isVertical);

  const transitionDuration = $derived(shouldAnimate ? 'var(--duration-moderate)' : '0ms');

  const indicatorClasses = $derived.by(() => {
    const result = [classes.tabIndicator];
    if (isVerticalBordered) {
      result.push(classes.indicatorVerticalBordered);
    } else if (isFilled) {
      result.push(classes.indicatorFilled);
      result.push(shouldHaveMediumRadius ? classes.indicatorRadiusMedium : classes.indicatorRadiusSmall);
    } else {
      result.push(classes.indicatorHorizontalBordered);
    }
    return result.filter(Boolean).join(' ');
  });

  const indicatorStyle = $derived.by(() => {
    const base = `transition-property: transform, width, height, background-color; transition-duration: ${transitionDuration}; transition-timing-function: var(--easing-standard);`;
    if (isVerticalBordered) {
      return `${base} height: ${dimensions.height}px; transform: translateY(${dimensions.y}px);`;
    }
    if (isFilled) {
      return `${base} width: ${dimensions.width}px; height: ${dimensions.height}px; transform: translate(${dimensions.x}px, ${dimensions.y}px);`;
    }
    return `${base} width: ${dimensions.width}px; transform: translate(${dimensions.x}px, ${dimensions.y}px);`;
  });

  const metaAttrs = metaAttribute({ name: MetaConstants.TabIndicator });
</script>

<div
  class={indicatorClasses}
  style={indicatorStyle}
  {...metaAttrs}
></div>
