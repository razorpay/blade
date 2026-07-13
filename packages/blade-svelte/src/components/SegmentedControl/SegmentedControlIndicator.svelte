<script lang="ts">
  import { tick } from 'svelte';
  import { getSegmentedControlTemplateClasses } from '@razorpay/blade-core/styles';
  import { getSegmentedControlContext } from './context';

  const classes = getSegmentedControlTemplateClasses();

  let {
    containerEl,
    baseId,
  }: { containerEl: HTMLElement | undefined; baseId: string } = $props();

  const getCtx = getSegmentedControlContext();
  const ctx = $derived(getCtx());

  let shouldAnimate = $state(false);
  let dimensions = $state({ width: 0, height: 0, x: 0, y: 0 });

  const updateDimensions = () => {
    if (!containerEl) return;
    const activeEl = containerEl.querySelector<HTMLElement>(
      `#${CSS.escape(`${baseId}-${ctx.selectedValue}-item`)}`,
    );
    if (!activeEl || activeEl.offsetWidth === 0) return;

    dimensions = {
      width: activeEl.offsetWidth,
      height: activeEl.offsetHeight,
      x: activeEl.offsetLeft,
      y: activeEl.offsetTop,
    };

    if (!shouldAnimate) {
      requestAnimationFrame(() => {
        shouldAnimate = true;
      });
    }
  };

  $effect(() => {
    void ctx.selectedValue;
    if (!ctx.selectedValue || !containerEl) return;

    // Per-invocation cancelled flag: the cleanup function sets it to true when
    // the effect re-runs (new selection) or the component unmounts, ensuring a
    // stale tick() callback never overwrites a newer measurement.
    let cancelled = false;
    void tick().then(() => {
      if (!cancelled) updateDimensions();
    });
    return () => {
      cancelled = true;
    };
  });

  $effect(() => {
    if ('fonts' in document) {
      try {
        void document.fonts.ready.then(() => {
          updateDimensions();
        });
      } catch {
        /* empty */
      }
    }
  });

  $effect(() => {
    if (!containerEl) return;
    const observer = new ResizeObserver(() => {
      updateDimensions();
    });
    observer.observe(containerEl);
    return () => observer.disconnect();
  });

  const indicatorClasses = $derived(
    [
      classes.indicator,
      shouldAnimate ? classes.indicatorAnimating : classes.indicatorInstant,
      ctx.size === 'small' ? classes.indicatorRadiusSmall : classes.indicatorRadiusMediumToken,
    ]
      .filter(Boolean)
      .join(' '),
  );

  const indicatorStyle = $derived(
    `width: ${dimensions.width}px; height: ${dimensions.height}px; transform: translate(${dimensions.x}px, ${dimensions.y}px);`,
  );
</script>

<div
  class={indicatorClasses}
  style={indicatorStyle}
  aria-hidden="true"
></div>
