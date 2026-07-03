<script lang="ts">
  import { tick } from 'svelte';
  import { getSegmentedControlTemplateClasses } from '@razorpay/blade-core/styles';
  import { getSegmentedControlContext } from './context';

  const classes = getSegmentedControlTemplateClasses();

  let { containerEl }: { containerEl: HTMLElement | undefined } = $props();

  const getCtx = getSegmentedControlContext();
  const ctx = $derived(getCtx());

  let shouldAnimate = $state(false);
  let dimensions = $state({ width: 0, height: 0, x: 0, y: 0 });
  let measureGeneration = 0;

  const updateDimensions = () => {
    if (!containerEl) return;
    const activeEl = ctx.getItemEl(ctx.selectedValue ?? '');
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
    if (ctx.selectedValue && containerEl) {
      measureGeneration += 1;
      const gen = measureGeneration;
      void tick().then(() => {
        if (gen === measureGeneration) updateDimensions();
      });
    }
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

  const transitionDuration = $derived(shouldAnimate ? 'var(--duration-moderate)' : '0ms');

  const indicatorClasses = $derived(
    [
      classes.indicator,
      ctx.isDisabled ? classes.indicatorDisabled : '',
      ctx.size === 'small' ? classes.indicatorRadiusSmall : classes.indicatorRadiusMediumToken,
    ]
      .filter(Boolean)
      .join(' '),
  );

  const indicatorStyle = $derived(
    `transition-property: transform, width, height; transition-duration: ${transitionDuration}; transition-timing-function: var(--easing-standard); width: ${dimensions.width}px; height: ${dimensions.height}px; transform: translate(${dimensions.x}px, ${dimensions.y}px);`,
  );
</script>

<div
  class={indicatorClasses}
  style={indicatorStyle}
  aria-hidden="true"
></div>
