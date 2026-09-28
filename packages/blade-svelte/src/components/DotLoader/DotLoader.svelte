<script lang="ts">
  import { getTokenCSSVariable, makeAccessible, type AriaRoles } from '@razorpay/blade-core/utils';
  import { getDotLoaderClasses } from '@razorpay/blade-core/styles';
  import type { DotLoaderProps } from './types';

  let { color, size = 'medium', accessibilityLabel, className }: DotLoaderProps = $props();

  const colorCSSVar = $derived(color ? getTokenCSSVariable(color) : undefined);

  const classes = $derived(getDotLoaderClasses({ size, className }));

  // Announced only when the consumer asks for it. Otherwise the dots are purely
  // decorative — the surrounding component owns the loading announcement.
  const accessibilityAttrs = $derived(
    accessibilityLabel
      ? makeAccessible({ role: 'status' as AriaRoles, label: accessibilityLabel })
      : { 'aria-hidden': 'true' },
  );
</script>

<span class={classes} style:--dot-loader-color={colorCSSVar} {...accessibilityAttrs}>
  <span></span><span></span><span></span>
</span>
