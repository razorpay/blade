<script lang="ts">
  import {
    metaAttribute,
    MetaConstants,
    getStyledPropsClasses,
    makeAnalyticsAttribute,
  } from '@razorpay/blade-core/utils';
  import { tooltipInteractiveWrapperClass } from '@razorpay/blade-core/styles';
  import { getTooltipContext } from './tooltipContext';
  import type { TooltipInteractiveWrapperProps } from './types';

  let { children, testID, ...rest }: TooltipInteractiveWrapperProps = $props();

  // Mirror React: assert nesting under <Tooltip>. In dev, warn (don't throw).
  if (typeof process === 'undefined' || process.env.NODE_ENV !== 'production') {
    if (getTooltipContext() === undefined) {
      // eslint-disable-next-line no-console
      console.warn(
        '[Blade][TooltipInteractiveWrapper] must be used within <Tooltip>',
      );
    }
  }

  const styledProps = $derived(getStyledPropsClasses(rest));
  const combinedClasses = $derived(
    [tooltipInteractiveWrapperClass, ...(styledProps.classes || [])]
      .filter(Boolean)
      .join(' '),
  );

  const metaAttrs = metaAttribute({
    name: MetaConstants.TooltipInteractiveWrapper,
    testID: testID ?? 'tooltip-interactive-wrapper',
  });
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div class={combinedClasses} tabindex={-1} {...metaAttrs} {...analyticsAttrs}>
  {@render children()}
</div>
